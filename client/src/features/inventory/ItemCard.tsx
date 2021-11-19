import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, Form, Input, Image } from "semantic-ui-react";
import { InventoryItem } from "../../models/inventoryItem";
import { useStore } from "../../stores/store";

interface Props {
    item: InventoryItem;
}

export default observer(function ItemCard({ item }: Props) {
    const [quantity, setQuantity] = useState<number>(0);
    const { orderStore } = useStore();
    const { addToCart, cart } = orderStore;

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setQuantity(e.currentTarget.valueAsNumber);
    }

    return (
        <Card fluid>
            <Image src={item.image || '/assets/drill.jpeg'} />
            <CardContent>
                <CardHeader>{item.itemName}</CardHeader>
                <CardDescription>{item.itemDescription}</CardDescription>
            </CardContent>
            <CardContent extra>
                <Form style={{marginBottom: '-0.9em'}}>
                    <Form.Group widths='equal'>
                        <Form.Field width={6}>
                            <Input 
                                placeholder="Amount" 
                                type="number" 
                                name="quantity"
                                value={quantity}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        <Form.Button 
                            content='Add to Cart'
                            color='facebook'
                            width={10}
                            fluid
                            style={{height: '100%'}}
                            onClick={() => {
                                addToCart({product: item, quantity: quantity});
                                console.log(quantity);
                            }}
                        />    
                    </Form.Group>
                </Form>
            </CardContent>
        </Card>
    );
});