import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { InventoryItem, InventoryItemFormValues } from "../models/inventoryItem";

export class InventoryStore {
    inventoryItems: InventoryItem[] = [];
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
        }
    }

    createNew = async (newItem: InventoryItemFormValues) => {
        try {
            await agent.Inventory.create(newItem);
        } catch(err) {
            console.log(err);
        }
    }


}