import {InventoryItem} from './inventoryItem';

export interface Profile {
    username: string;
    displayName: string;
    email: string;
    orders: ProfileOrder[];
}

export interface ProfileOrder {
    id: string;
    orderStatus: string;
    orderCreatedAt: string;
    orderCompletedAt: string;
    orderItems: ProfileOrderItem[];
    notes: string;
}

export interface ProfileOrderItem {
    quantity: number;
    product: InventoryItem;
}

