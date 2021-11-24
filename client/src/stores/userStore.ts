import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { history } from '../index';

export class UserStore {
    currentUser: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.currentUser;
    }

    login = async (userForm: UserFormValues) => {
        try {
            const user = await agent.Accounts.login(userForm);
            runInAction(() => {
                this.currentUser = user;
                localStorage.setItem('inventoryToken', this.currentUser.token);
                history.push('/dashboard');
            });
        } catch(err) {
            console.log(err);
        }
    }

    register = async (userForm: UserFormValues) => {
        try {
            const newUser = await agent.Accounts.register(userForm);
            runInAction(() => {
                this.currentUser = newUser;
                localStorage.setItem('inventoryToken', this.currentUser.token);
                history.push('/dashboard');
            });
        } catch(err) {
            console.log(err);
        }
    }

    logout = () => {
        this.currentUser = null;
        localStorage.removeItem('inventoryToken');
        history.push('/');
    }

    getCurrentUser = async () => {
        try {
            const user = await agent.Accounts.getCurrent();
            runInAction(() => {
                this.currentUser = user;
            });
        } catch(err) {
            console.log(err);
        }
        

    }
}