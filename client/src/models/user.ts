export interface User {
    displayName: string;
    username: string;
    email: string;
    token?: string;
    role?: string;
}

export interface UserFormValues {
    username?: string;
    displayName?: string;
    password?: string;
    email: string;
}