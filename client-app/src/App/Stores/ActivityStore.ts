import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import Agent from '../Api/Agent';
import { IActivity } from '../Models/Activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] =[];
    @observable selectedActivity: IActivity | undefined;
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
                this.selectedActivity = activity;
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

    @action openCreateForm = () => {
        this.editmode = true;
        this.selectedActivity = undefined;
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editmode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
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
        this.selectedActivity = this.activityRegistry.get(id);
        this.editmode = false;
    }
}

export default createContext(new ActivityStore())