import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/profile";

export class ProfileStore {
    loading = false;
    currentProfile: Profile | null = null;
    profiles: Profile[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    getProfiles = async () => {
        return 'this contains the profiles';
    }

    getProfile = async (username: string) => {
        try {
            this.loading = true;
            const profile = await agent.Profiles.getProfile(username);
            runInAction(() => {
                this.currentProfile = profile;
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