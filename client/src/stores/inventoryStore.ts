import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { InventoryItem, InventoryItemFormValues } from "../models/inventoryItem";
import { Pagination, PagingParams } from "../models/pagination";
import Photo from "../models/photo";

export class InventoryStore {
    inventoryRegistry = new Map<string, InventoryItem>();
    
    currentItem: InventoryItem | null = null;
    loadingInitial = true;
    loading = false;
    uploading = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();

    constructor() {
        makeAutoObservable(this);
    }

    resetStore = () => {
        this.inventoryRegistry.clear();
        this.pagination = null;
        this.pagingParams = new PagingParams();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        return params;
    }
    
    get inventoryItems() {
        return Array.from(this.inventoryRegistry.values()).sort((a, b) => a.itemName.localeCompare(b.itemName));
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    getAll = async () => {
        this.loadingInitial = true;
        try {
            const paginatedInventory = await agent.Inventory.getAll(this.axiosParams);
            runInAction(() => {
                paginatedInventory.data.forEach((item) => {
                    this.inventoryRegistry.set(item.id, item);
                });
                this.pagination = paginatedInventory.pagination;
                this.loadingInitial = false;
            });
        } catch(err) {
            console.log(err);
            this.loadingInitial = false;
        }
    }

    createNew = async (newItem: InventoryItemFormValues) => {
        this.loading = true;
        try {
            await agent.Inventory.create(newItem);
            runInAction(() => {
                this.loading = false;
            })
        } catch(err) {
            console.log(err);
            this.loading = false;
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