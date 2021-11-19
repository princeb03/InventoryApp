import { InventoryItem } from "./inventoryItem";

export interface OrderItem {
    product: InventoryItem;
    quantity: number;
}