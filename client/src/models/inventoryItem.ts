export interface InventoryItem {
    id: string;
    itemName: string;
    itemDescription: string;
    totalStock: number;
};

export interface InventoryItemFormValues {
    id?: string;
    itemName: string;
    itemDescription: string | null;
    totalStock: number;
}