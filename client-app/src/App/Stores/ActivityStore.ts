import {observable, action} from 'mobx';
import { createContext } from 'react';
import Agent from '../Api/Agent';
import { IActivity } from '../Models/Activity';

class ActivityStore {
    @observable activities: IActivity[] =[];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editmode = false;
    @observable submitting = false;

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activities = await Agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                this.activities.push(activity);
            });
            this.loadingInitial = false;
        }
        catch(error){
            console.log(error);
            this.loadingInitial = false;
        }
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try{
            await Agent.Activities.create(activity);
            this.activities.push(activity);
            this.editmode = false;
            this.submitting = false;
        }
        catch(error){
            this.submitting = false;
            console.log(error);
        }
    }

    @action openCreateForm = () => {
        this.editmode = true;
        this.selectedActivity = undefined;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a=> a.id === id);
        this.editmode = false;
    }
}

export default createContext(new ActivityStore())