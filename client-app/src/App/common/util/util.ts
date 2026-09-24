import { IActivity, IAttendee } from "../../Models/Activity";
import { IUser } from "../../Models/User";

export const combineDateAndTime = (date: Date, time: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const timeString = time.toISOString().split('T')[1];

    return new Date(dateString + ' ' + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.date = new Date(activity.date);

    const attendees = activity.attendees ?? [];

    activity.isGoing = attendees.some(
        un => un.username === user.username
    );

    activity.isHost = attendees.some(
        un => un.username === user.username && un.isHost
    );

    return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.username,
        image: user.image!
    };
};