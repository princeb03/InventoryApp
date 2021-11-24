import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, Form, Input, Image } from "semantic-ui-react";
import { InventoryItem } from "../../models/inventoryItem";
import { useStore } from "../../stores/store";

interface Props {
    item: InventoryItem;
}

export default observer(function ItemCard({ item }: Props) {
    const [quantity, setQuantity] = useState<number>(0);
    const { orderStore } = useStore();
    const { addToCart } = orderStore;

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setQuantity(e.currentTarget.valueAsNumber);
    }

    return (
        <Card fluid>
            <Image as={Link} to={`/items/${item.id}`} src={item.image || '/assets/drill.jpeg'} />
            <CardContent>
                <CardHeader as={Link} to={`/items/${item.id}`}>{item.itemName}</CardHeader>
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
                            }}
                        />    
                    </Form.Group>
                </Form>
            </CardContent>
        </Card>
    );
});