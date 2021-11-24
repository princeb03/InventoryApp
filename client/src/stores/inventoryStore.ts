import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { InventoryItem, InventoryItemFormValues } from "../models/inventoryItem";

export class InventoryStore {
    inventoryItems: InventoryItem[] = [];
    currentItem: InventoryItem | null = null;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    getAll = async () => {
        this.loadingInitial = true;
        try {
            const inventory = await agent.Inventory.getAll();
            runInAction(() => {
                this.inventoryItems = inventory;
                this.loadingInitial = false;
            });
        } catch(err) {
            console.log(err);
            this.loadingInitial = false;
        }
    }

    createNew = async (newItem: InventoryItemFormValues) => {
        try {
            await agent.Inventory.create(newItem);
        } catch(err) {
            console.log(err);
        }
    }

    getDetails = async (id: string) => {
        try {
            this.loadingInitial = true;
            const item = await agent.Inventory.get(id);
            runInAction(() => {
                this.currentItem = item;
                this.loadingInitial = false
            }); 
        } catch(err) {
            console.log(err);
            this.loadingInitial = false;
        }
    }


}