export interface IProfile {
    displayName: string,
    username: string,
    bio: string,
    image: string,
    following: boolean,
    followerCount: number,
    followingCount: number,
    photos: IPhoto[]
}

export interface IPhoto{
    id: string,
    url: string,
    isMain: boolean
}