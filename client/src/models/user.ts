export interface User {
    displayName: string;
    email: string;
    token: string;
}

export interface UserFormValues {
    username?: string;
    displayName?: string;
    password: string;
    email: string;
}