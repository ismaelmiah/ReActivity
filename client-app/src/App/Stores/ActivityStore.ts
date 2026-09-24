import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import { SyntheticEvent } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { toast } from "react-toastify";

import Agent from "../Api/Agent";
import { IActivity } from "../Models/Activity";
import { history } from "../..";
import { RootStore } from "./rootStore";
import { createAttendee, setActivityProps } from "../common/util/util";

const LIMIT = 3;

export default class ActivityStore {
  rootStore: RootStore;

  activityRegistry = new Map<string, IActivity>();
  Activity: IActivity | null = null;

  loadingInitial = false;
  submitting = false;
  target = "";
  loading = false;

  hubConnection: HubConnection | null = null;

  activityCount = 0;
  page = 0;

  predicate = new Map<string, string | Date>();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false,
    });

    reaction(
      () => Array.from(this.predicate.entries()),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      },
    );
  }

  setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();

    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  get axiosParams() {
    const params = new URLSearchParams();

    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);

    this.predicate.forEach((value, key) => {
      if (key === "startDate" && value instanceof Date) {
        params.append(key, value.toISOString());
      } else {
        params.append(key, String(value));
      }
    });

    return params;
  }

  get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  setPage = (page: number) => {
    this.page = page;
  };

  createHubConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log(this.hubConnection?.state);
      })
      .catch((error) => {
        console.error("Error establishing connection: ", error);
      });

    this.hubConnection.on("ReceiveComment", (comment) => {
      console.log("========== SIGNALR MESSAGE ==========");
      console.log("Event:", "ReceiveComment");
      console.log("Raw comment:", comment);
      console.log("Comment JSON:", JSON.stringify(comment, null, 2));
      console.log("====================================");
      runInAction(() => {
        if (this.Activity) {
          this.Activity.comments.push(comment);
        }
      });
    });
  };

  stopHubConnection = async () => {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  };

  addComment = async (values: any) => {
    if (!this.Activity || !this.hubConnection) {
      return;
    }

    values.ActivityId = this.Activity.id;

    try {
      await this.hubConnection.invoke("SendComment", values);
    } catch (error) {
      console.error("Add comment error:", error);
    }
  };

  get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values()),
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = [...activities].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    return Object.entries(
      sortedActivities.reduce(
        (grouped, activity) => {
          const date = activity.date.toISOString().split("T")[0];

          grouped[date] = grouped[date]
            ? [...grouped[date], activity]
            : [activity];

          return grouped;
        },
        {} as Record<string, IActivity[]>,
      ),
    );
  }

  clearActivity = () => {
    this.Activity = null;
  };

  loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activitiesEnvelope = await Agent.Activities.list(this.axiosParams);

      const { activities, activityCount } = activitiesEnvelope;

      runInAction(() => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);

          this.activityRegistry.set(activity.id, activity);
        });

        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });

      console.error("loadActivities error:", error);
    }
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await Agent.Activities.create(activity);

      const attendee = createAttendee(this.rootStore.userStore.user!);

      attendee.isHost = true;

      activity.attendees = [attendee];
      activity.comments = [];
      activity.isHost = true;

      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);

        this.submitting = false;
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });

      toast.error("Problem Submitting Data");
      console.error("Create activity error:", error);
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await Agent.Activities.update(activity);

      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);

        this.Activity = activity;
        this.submitting = false;
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });

      toast.error("Problem Submitting Data");
      console.error("Edit activity error:", error);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    const user = this.rootStore.userStore.user!;

    if (activity) {
      this.Activity = activity;
      return toJS(activity);
    }

    this.loadingInitial = true;

    try {
      activity = await Agent.Activities.details(id);

      runInAction(() => {
        setActivityProps(activity!, user);

        this.Activity = activity!;
        this.activityRegistry.set(activity!.id, activity!);

        this.loadingInitial = false;
      });

      return activity;
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });

      console.error("Load activity error:", error);
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string,
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await Agent.Activities.delete(id);

      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });

      console.error("Delete activity error:", error);
    }
  };

  attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);

    this.loading = true;

    try {
      await Agent.Activities.attend(this.Activity!.id);

      runInAction(() => {
        if (this.Activity) {
          this.Activity.attendees.push(attendee);
          this.Activity.isGoing = true;

          this.activityRegistry.set(this.Activity.id, this.Activity);

          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });

      toast.error("Problem for Joining Activity...!!!");
    }
  };

  cancelActivity = async () => {
    this.loading = true;

    try {
      await Agent.Activities.unattend(this.Activity!.id);

      runInAction(() => {
        if (this.Activity) {
          this.Activity.attendees = this.Activity.attendees.filter(
            (attendee) =>
              attendee.username !== this.rootStore.userStore.user!.username,
          );

          this.Activity.isGoing = false;

          this.activityRegistry.set(this.Activity.id, this.Activity);

          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });

      toast.error("Problem for Cancelling Activity...!!!");
    }
  };
}
