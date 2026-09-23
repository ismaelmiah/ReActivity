import { makeAutoObservable, runInAction } from "mobx";
import { IUser, IUserFormValue } from "../Models/User";
import agent from "../Api/Agent";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {
  rootStore: RootStore;

  user: IUser | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false,
    });
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (values: IUserFormValue) => {
    try {
      const user = await agent.User.login(values);

      runInAction(() => {
        this.user = user;
      });

      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();

      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  register = async (values: IUserFormValue) => {
    try {
      const user = await agent.User.register(values);

      runInAction(() => {
        this.user = user;
      });

      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();

      history.push("/");
    } catch (error) {
      throw error;
    }
  };

  getUser = async () => {
    try {
      const user = await agent.User.current();

      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      // Ignore authentication errors
    }
  };

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;

    history.push("/");
  };
}