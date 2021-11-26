import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { InventoryItem, InventoryItemFormValues } from "../models/inventoryItem";
import Photo from "../models/photo";

export class InventoryStore {
    inventoryItems: InventoryItem[] = [];
    currentItem: InventoryItem | null = null;
    loadingInitial = true;
    loading = false;
    uploading = false;

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

    uploadPhoto = async (file: Blob, itemId: string) => {
        this.uploading = true;
        try {
            const response = await agent.Inventory.uploadPhoto(file, itemId);
            const photo = response.data;
            runInAction(() => {
                if (this.currentItem) {
                    this.currentItem.photos?.push(photo);
                    if (photo.isMain) this.currentItem.mainPhoto = photo.url;
                }
                this.uploading = false;
            });
        } catch(err) {
            console.log(err);
            this.uploading = false;
        }

    }

    setMainPhoto = async (itemId: string, photo: Photo) => {
        this.loading = true;
        try {
            await agent.Inventory.setMainPhoto(itemId, photo.id);
            runInAction(() => {    
                if (this.currentItem && this.currentItem?.photos)
                {
                    this.currentItem.photos.find(p => p.isMain)!.isMain = false;
                    this.currentItem.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.currentItem.mainPhoto = photo.url
                    this.loading = false;
                }
            })

        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }

    deletePhoto = async (itemId: string, photo: Photo) => {
        this.loading = true;
        try {
            await agent.Inventory.deletePhoto(itemId, photo.id);
            runInAction(() => {
                if (this.currentItem && this.currentItem.photos) {
                    this.currentItem.photos = this.currentItem.photos.filter(p => p.id !== photo.id);
                }
                this.loading = false;
            })
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }


}