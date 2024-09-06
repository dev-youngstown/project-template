export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
    is_disabled: boolean;
}

export interface IUserUpdate {
    first_name: string;
    last_name: string;
    email: string;
}
