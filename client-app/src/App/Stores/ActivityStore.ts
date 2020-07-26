import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import Agent from "../Api/Agent";
import { IActivity } from "../Models/Activity";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { createAttendee, setActivityProps } from "../common/util/util";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootstore: RootStore) {
    this.rootStore = rootstore;
  }

  @observable activityRegistry = new Map();
  @observable Activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action clearActivity = () => {
    this.Activity = null;
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await Agent.Activities.list();
      runInAction("loading Activities", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.Attendees = attendees;
      activity.isHost = true;
      runInAction("Create Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Create Activity error", () => {
        this.submitting = false;
      });
      toast.error("Problem Submitting Data");
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Agent.Activities.update(activity);
      runInAction("Edit Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.Activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Edit Activity Error", () => {
        this.submitting = false;
      });
      toast.error("Problem Submitting Data");
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    const user = this.rootStore.userStore.user!;
    if (activity) {
      this.Activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await Agent.Activities.details(id);
        runInAction("Getting Activity", () => {
          setActivityProps(activity, user);
          this.Activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await Agent.Activities.delete(id);
      runInAction("Delete Activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("Delete Activity Error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };
  
  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
        await Agent.Activities.attend(this.Activity!.id);
        runInAction(() => {
            if (this.Activity) {
                this.Activity.Attendees.push(attendee);
                this.Activity.isGoing = true;
                this.activityRegistry.set(this.Activity.id, this.Activity);
                this.loading = false;
            }
        })
    } catch (error) {
        runInAction(() => {
            this.loading = false;
        })
        toast.error('Problem for Joining Activity...!!!');
    }
}

@action cancelActivity = async () => {
    this.loading = true;
    try {
        await Agent.Activities.unattend(this.Activity!.id);
        runInAction(() => {
            if (this.Activity) {
                this.Activity.Attendees = this.Activity.Attendees.filter(
                    un => un.username !== this.rootStore.userStore.user!.username
                );
                this.Activity.isGoing = false;
                this.activityRegistry.set(this.Activity.id, this.Activity);
                this.loading = false;
            }
        })
    } catch (error) {
        runInAction(() => {
            this.loading = false;
        })
        toast.error('Problem for Cancelling Activity...!!!');
    }
}
}
