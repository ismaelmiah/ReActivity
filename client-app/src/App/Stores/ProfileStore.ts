import { makeAutoObservable, reaction, runInAction } from "mobx";
import { RootStore } from "./rootStore";
import { IProfile, IPhoto, IUserActivity } from "../Models/Profile";
import Agent from "../Api/Agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  profile: IProfile | null = null;
  loadingProfile = true;
  uploadingPhoto = false;
  loading = false;
  followings: IProfile[] = [];
  activeTab = 0;
  userActivities: IUserActivity[] = [];
  loadingActivities = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false,
    });

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate =
            activeTab === 3 ? "followers" : "following";

          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return (
        this.rootStore.userStore.user.username ===
        this.profile.username
      );
    }

    return false;
  }

  loadUserActivities = async (
    username: string,
    predicate?: string
  ) => {
    this.loadingActivities = true;

    try {
      const activities =
        await Agent.Profiles.listActivities(
          username,
          predicate
        );

      runInAction(() => {
        this.userActivities = activities;
        this.loadingActivities = false;
      });
    } catch (error) {
      toast.error("Problem loading Activities");

      runInAction(() => {
        this.loadingActivities = false;
      });
    }
  };

  setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  loadProfile = async (username: string) => {
    this.loadingProfile = true;

    try {
      const profile =
        await Agent.Profiles.get(username);

      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });

      console.error("Load profile error:", error);
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;

    try {
      const photo =
        await Agent.Profiles.uploadPhoto(file);

      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);

          if (
            photo.isMain &&
            this.rootStore.userStore.user
          ) {
            this.rootStore.userStore.user.image =
              photo.url;

            this.profile.image = photo.url;
          }
        }

        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.error("Upload photo error:", error);
      toast.error("Problem Uploading Photo");

      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await Agent.Profiles.setMainPhoto(photo.id);

      runInAction(() => {
        this.rootStore.userStore.user!.image =
          photo.url;

        this.profile!.photos.find(
          (x) => x.isMain
        )!.isMain = false;

        this.profile!.photos.find(
          (x) => x.id === photo.id
        )!.isMain = true;

        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");

      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deletePhoto = async (photo: IPhoto) => {
    this.loading = true;

    try {
      await Agent.Profiles.deletePhoto(photo.id);

      runInAction(() => {
        this.profile!.photos =
          this.profile!.photos.filter(
            (x) => x.id !== photo.id
          );

        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");

      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateProfile = async (
    profile: Partial<IProfile>
  ) => {
    try {
      await Agent.Profiles.updateProfile(profile);

      runInAction(() => {
        if (
          profile.displayName !==
          this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName =
            profile.displayName!;
        }

        this.profile = {
          ...this.profile!,
          ...profile,
        };
      });
    } catch (error) {
      toast.error("Problem Updating Profile");
    }
  };

  follow = async (username: string) => {
    this.loading = true;

    try {
      await Agent.Profiles.follow(username);

      runInAction(() => {
        this.profile!.isFollowed = true;
        this.profile!.followerCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem following user!!!");

      runInAction(() => {
        this.loading = false;
      });
    }
  };

  unfollow = async (username: string) => {
    this.loading = true;

    try {
      await Agent.Profiles.unfollow(username);

      runInAction(() => {
        this.profile!.isFollowed = false;
        this.profile!.followerCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem unfollowing user!!!");

      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loading = true;

    try {
      const profiles =
        await Agent.Profiles.listFollowings(
          this.profile!.username,
          predicate
        );

      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem loading followings");

      runInAction(() => {
        this.loading = false;
      });
    }
  };
}