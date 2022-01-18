import { createContext, useContext } from "react";
import { InventoryStore } from "./inventoryStore";
import ModalStore from "./modalStore";
import { OrderStore } from "./orderStore";
import { ProfileStore } from "./profileStore";
import { UserStore } from "./userStore";

interface Store {
    userStore: UserStore;
    inventoryStore: InventoryStore;
    orderStore: OrderStore;
    profileStore: ProfileStore;
    modalStore: ModalStore;
}

export const store: Store = {
    userStore: new UserStore(),
    inventoryStore: new InventoryStore(),
    orderStore: new OrderStore(),
    profileStore: new ProfileStore(),
    modalStore: new ModalStore()
};

export const StoreContext = createContext(store);

export const useStore = () => {
    return useContext(StoreContext);
};