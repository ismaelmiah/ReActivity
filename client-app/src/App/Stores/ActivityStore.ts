import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import Agent from '../Api/Agent';
import { IActivity } from '../Models/Activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] =[];
    @observable Activity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editmode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date)-Date.parse(b.date));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activities = await Agent.Activities.list();
            runInAction('loading Activities',() => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity)
                });
                this.loadingInitial = false;
            }); 
        }
        catch(error){
            runInAction('load activities error', () => {
                this.loadingInitial = false;
            });
            console.log(error);
        }
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try{
            await Agent.Activities.create(activity);
            runInAction('Create Activity', () => {
                this.activityRegistry.set(activity.id, activity)
                this.editmode = false;
                this.submitting = false;
            });
        }
        catch(error){
            runInAction('Create Activity error', () => {
                this.submitting = false;
            });
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await Agent.Activities.update(activity);
            runInAction('Edit Activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.Activity = activity;
                this.editmode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction('Edit Activity Error',() => {
                this.submitting = false;
            });
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity){
            this.Activity = activity;
        }
        else{
            this.loadingInitial = true;
            try {
                activity = await Agent.Activities.details(id);
                runInAction('Getting Activity',() => {
                    this.Activity = activity;
                    this.loadingInitial = false;
                });
            } catch (error) {
                runInAction('get activity error', () => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action openCreateForm = () => {
        this.editmode = true;
        this.Activity = undefined;
    }

    @action openEditForm = (id: string) => {
        this.Activity = this.activityRegistry.get(id);
        this.editmode = true;
    }

    @action cancelSelectedActivity = () => {
        this.Activity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editmode = false;
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await Agent.Activities.delete(id);
            runInAction('Delete Activity', () => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            });
        } catch (error) {
            runInAction('Delete Activity Error',() => {
                this.submitting = false;
                this.target = '';
            });
            console.log(error);
        }
    }

    @action selectActivity = (id: string) => {
        this.Activity = this.activityRegistry.get(id);
        this.editmode = false;
    }
}

export default createContext(new ActivityStore())