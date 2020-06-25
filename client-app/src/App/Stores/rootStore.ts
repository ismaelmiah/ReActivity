import ActivityStore from "./ActivityStore";
import UserStore from "./UserStore";
import { createContext } from "react";
import CommonStore from "./CommonStore";
import { configure } from "mobx";
configure({enforceActions: 'always'});

export class RootStore{
    activityStore: ActivityStore;
    user: UserStore;
    commonStore: CommonStore;

    constructor(){
        this.activityStore = new ActivityStore(this);
        this.user = new UserStore(this);
        this.commonStore = new CommonStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());