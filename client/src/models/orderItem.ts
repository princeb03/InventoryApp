import { InventoryItem } from "./inventoryItem";

export interface OrderItem {
    product: InventoryItem;
    quantity: number;
}

export interface CreateOrderItemAPI {
    product: string;
    quantity: number;
}