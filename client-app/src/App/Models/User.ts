export interface IUser{
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface IUserFormValue{
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}