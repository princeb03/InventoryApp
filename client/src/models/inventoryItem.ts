export interface InventoryItem {
    id: string;
    itemName: string;
    itemDescription: string;
    totalStock: number;
    availableStock: number;
    image: string;
};

export interface InventoryItemFormValues {
    id?: string;
    itemName: string;
    itemDescription: string | null;
    totalStock: string;
    availableStock: string;
}