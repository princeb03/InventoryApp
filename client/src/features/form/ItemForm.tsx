import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { InventoryItemFormValues } from "../../models/inventoryItem";

export default function ItemForm() {
    const [itemData, setItemData] = useState<InventoryItemFormValues>();
    function handleSubmit() {
        setItemData(undefined);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Input value={itemData?.itemName} name="itemName" label="Name" required/>
            <Form.Input name="itemDescription" label="Description" />
            <Form.Input name="totalStock" label="Total Stock" required />
            <Button type="submit" />
        </Form>
    );
}