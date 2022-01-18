import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile, ProfileOrder } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";
import { history } from "..";
import { toast } from "react-toastify";

export class ProfileStore {
    loading = false;
    profileUser: User | null = null;
    orderRegistry = new Map<string, ProfileOrder>();
    profiles: Profile[] = [];
    pagination: Pagination | null = null;
    pagingParams = new PagingParams(1, 4);
    orderFilters = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.orderFilters.keys(),
            () => {
                this.pagingParams = new PagingParams(1,4);
                this.orderRegistry.clear();
                this.getProfile(this.profileUser!.username);
            }
        )
    }

    resetStore = () => {
        this.pagingParams = new PagingParams(1,4);
        this.orderRegistry.clear();
        this.profileUser = null;
        this.orderFilters.clear();
        this.orderFilters.set('all', true);
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.orderFilters.forEach((value, key) => {
            params.append(key, value);
        });
        return params;
    }

    get profileOrders() {
        return Array.from(this.orderRegistry.values()).sort((a, b) => (
            new Date(b.orderCreatedAt).getTime() - new Date(a.orderCreatedAt).getTime()
        ));
    }

    setOrderFilter = (value: string) => {
        const resetFilter = () => this.orderFilters.clear();
        switch (value) {
            case 'all':
                resetFilter();
                this.orderFilters.set('all', true);
                break;
            case 'isCompleted':
                resetFilter();
                this.orderFilters.set('isCompleted', true);
                break;
            case 'isInUse':
                resetFilter();
                this.orderFilters.set('isInUse', true);
                break;
            default:
                break;
        }
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    getProfile = async (username: string) => {
        try {
            this.loading = true;
            const response = await agent.Profiles.getProfile(username, this.axiosParams);
            const profile = response.data;
            runInAction(() => {
                this.profileUser = {
                    displayName: profile.displayName,
                    username: profile.username,
                    email: profile.email
                };
                this.pagination = response.pagination;
                profile.orders.forEach((order) => {
                    this.orderRegistry.set(order.id, order);
                });
                this.loading = false;
            }); 
        } catch(err) {
            console.log(err);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    
    updateUser = async (userForm: UserFormValues) => {
        try {
            this.loading = true;
            userForm.password = 'placeholder';
            const updatedUsername = await agent.Accounts.update(userForm, this.profileUser!.username);
            runInAction(() => {
                this.loading = false;
            });
            history.push(`/profiles/${updatedUsername}`);
            store.modalStore.closeModal();
            toast.info('User updated', {autoClose: 1000});
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }
}