import { makeAutoObservable, reaction } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
    rootStore: RootStore;

    token: string | null = window.localStorage.getItem("jwt");
    appLoaded = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this, {
            rootStore: false
        });

        reaction(
            () => this.token,
            (token) => {
                if (token) {
                    window.localStorage.setItem("jwt", token);
                } else {
                    window.localStorage.removeItem("jwt");
                }
            }
        );
    }

    setToken = (token: string | null) => {
        this.token = token;
    };

    setAppLoaded = () => {
        this.appLoaded = true;
    };
}