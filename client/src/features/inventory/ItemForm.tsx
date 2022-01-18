import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { InventoryItemFormValues } from "../../models/inventoryItem";
import { useStore } from "../../stores/store";

export default observer(function ItemForm() {
    const initialState: InventoryItemFormValues = {
        itemName: '',
        itemDescription: '',
        totalStock: '',
        availableStock: ''
    };
    const [itemData, setItemData] = useState<InventoryItemFormValues>(initialState);
    const { inventoryStore } = useStore();
    const { createNew, loading } = inventoryStore;
    
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setItemData({ ...itemData, [e.currentTarget.name]: e.currentTarget.value});
    }

    function handleSubmit() {
        createNew(itemData);
        setItemData(initialState);
    }

    return (
        <Form onSubmit={handleSubmit} style={{padding: '2em'}}>
            <Header as='h1' content="Create New Item" />
            <Form.Input name="itemName" value={itemData.itemName} label="Name" onChange={handleChange} required />
            <Form.Input name="itemDescription" value={itemData.itemDescription} label="Description" onChange={handleChange} />
            <Form.Input name="totalStock" value={itemData.totalStock} label="Total Stock" onChange={handleChange} required />
            <Form.Input name="availableStock" value={itemData.availableStock} label="Available Stock" onChange={handleChange} required />
            <Button loading={loading} 
                fluid
                size='large'
                type="submit" 
                content="Create Item" 
                color='facebook' 
            />
        </Form>
    );
})