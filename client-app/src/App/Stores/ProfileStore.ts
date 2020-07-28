import { RootStore } from "./rootStore";
import { observable, action, runInAction } from "mobx";
import { IProfile } from "../Models/Profile";
import Agent from "../Api/Agent";

export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    
    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await Agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }
}