import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { history } from '../index';
import { store } from "./store";
import { Pagination, PagingParams } from "../models/pagination";
import { toast } from "react-toastify";

export class UserStore {
    currentUser: User | null = null;
    userRegistry = new Map<string, User>();
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    loadingInitial = true;
    loading = false;
    searchString = '';

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.searchString,
            () => {
                this.pagingParams = new PagingParams();
                this.userRegistry.clear();
                this.getAllUsers();
            }
        )
    }

    get isLoggedIn() {
        return !!this.currentUser;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        params.append('searchString', this.searchString);
        return params;
    }

    get userList() {
        return Array.from(this.userRegistry.values());
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setSearchString = (value: string) => {
        this.searchString = value;
    }

    login = async (userForm: UserFormValues) => {
        this.loading = true;
        try {
            const user = await agent.Accounts.login(userForm);
            runInAction(() => {
                this.currentUser = user;
                this.loading = false;
                localStorage.setItem('inventoryToken', this.currentUser.token!);
                history.push('/dashboard');
            });
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }

    register = async (userForm: UserFormValues) => {
        this.loading = true;
        try {
            await agent.Accounts.register(userForm);
            runInAction(() => {
                this.loading = false;
            });
            history.push('/dashboard');
            store.modalStore.closeModal();
            toast.info('New User Created', {autoClose: 1000});
            
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }

    resetStore = () => {
        this.userRegistry.clear();
        this.pagination = null;
        this.pagingParams = new PagingParams();
        this.searchString = '';
    }
    
    logout = () => {
        this.currentUser = null;
        localStorage.removeItem('inventoryToken');
        store.orderStore.resetCart();
        store.inventoryStore.resetStore();
        this.resetStore();
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

    getAllUsers = async () => {
        this.loadingInitial = true;
        try {
            const paginatedUsers = await agent.Accounts.getAll(this.axiosParams);
            runInAction(() => {
                paginatedUsers.data.forEach(user => {
                    this.userRegistry.set(user.username, user);
                });
                this.pagination = paginatedUsers.pagination;
                this.loadingInitial = false;
            })
        } catch(err) {
            console.log(err);
            this.loadingInitial = false;
        }
    }
}