import Photo from "./photo";

export interface InventoryItem {
    id: string;
    itemName: string;
    itemDescription: string;
    totalStock: number;
    availableStock: number;
    mainPhoto?: string;
    orders?: any;
    photos?: Photo[];
};

export interface InventoryItemFormValues {
    id?: string;
    itemName: string;
    itemDescription: string | null;
    totalStock: string;
    availableStock: string;
}