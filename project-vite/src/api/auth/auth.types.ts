export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface ICreateUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}
