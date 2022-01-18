import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, Form, Input, Image, CardMeta } from "semantic-ui-react";
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
            <Image as={Link} to={`/items/${item.id}`} src={item.mainPhoto || '/assets/drill.jpeg'} />
            <CardContent>
                <CardHeader 
                    as={Link} 
                    to={`/items/${item.id}`}
                    style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}
                >
                    {item.itemName}
                </CardHeader>
                <CardMeta>
                    <p style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.itemDescription ? item.itemDescription  : 'No description for this item.'}</p>
                </CardMeta>
                <CardDescription>
                    <p><strong style={{color: 'green'}}>{item.availableStock}</strong>  Available</p>
                    <p><strong>{item.totalStock}</strong>  Total Stock</p>
                </CardDescription>
            </CardContent>
            <CardContent extra>
                <Form style={{marginBottom: '-0.9em'}}>
                    <Form.Group widths='equal'>
                        <Form.Field width={6}>
                            <Input 
                                placeholder="Amount" 
                                type="number" 
                                min="0"
                                step="1"
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
                                if (quantity > item.availableStock || quantity <= 0 || quantity % 1 !== 0) {
                                    toast.error('Invalid quantity.', {autoClose: 2000});
                                } else {
                                    addToCart({product: item, quantity: quantity});
                                    toast.info(`${quantity} ${item.itemName} added to cart.`, {autoClose: 2000});
                                }
                            }}
                        />    
                    </Form.Group>
                </Form>
            </CardContent>
        </Card>
    );
});