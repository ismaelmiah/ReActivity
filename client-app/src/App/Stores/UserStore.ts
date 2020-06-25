import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValue } from "../Models/User";
import Agent from "../Api/Agent";
import { RootStore } from "./rootStore";

export default class UserStore{
    
    rootStore: RootStore;
    constructor(rootstore: RootStore){
        this.rootStore=rootstore;
    }


    @observable user: IUser | null = null;

    @computed get isLoggedIn() {return!!this.user}

    @action login = async (values: IUserFormValue) => {
        try {
            const user = await Agent.User.login(values);
            runInAction(() => {
                this.user = user;
            })
            console.log(user);
            //this.rootStore.commonStore.setToken(user.token);
            //history.push('/activities');
        } catch (error) {
            throw error;
        }
    }
}