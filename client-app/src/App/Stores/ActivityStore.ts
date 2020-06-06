import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import Agent from '../Api/Agent';
import { IActivity } from '../Models/Activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable Activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        console.log(this.groupActivitiesByDate(Array.from(this.activityRegistry.values())));
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]){
        const sortedActivities = activities.sort(
            (a,b) => Date.parse(a.date)-Date.parse(b.date)
        )
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
    }

    @action clearActivity = () => {
        this.Activity = null;
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

}

export default createContext(new ActivityStore())