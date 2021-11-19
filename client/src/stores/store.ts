import { createContext, useContext } from "react";
import { InventoryStore } from "./inventoryStore";
import { OrderStore } from "./orderStore";
import { UserStore } from "./userStore";

interface Store {
    userStore: UserStore;
    inventoryStore: InventoryStore;
    orderStore: OrderStore;
}

export const store: Store = {
    userStore: new UserStore(),
    inventoryStore: new InventoryStore(),
    orderStore: new OrderStore()
};

export const StoreContext = createContext(store);

export const useStore = () => {
    return useContext(StoreContext);
};