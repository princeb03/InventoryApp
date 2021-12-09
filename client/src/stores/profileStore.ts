import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile, ProfileOrder } from "../models/profile";
import { User } from "../models/user";

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

    getProfiles = async () => {
        return 'this contains the profiles';    // future implementation
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
}