import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header, Grid, Card, Image } from "semantic-ui-react";
import agent from "../../api/agent";
import { InventoryItem } from "../../models/inventoryItem";

export default function Dashboard() {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

    useEffect(() => {
        agent.Inventory.getAll().then(items => setInventoryItems(items));
    }, []);
    
    return (
        <Fragment>
            <Header as='h1' style={{marginBottom: '3rem'}} content="All Items" />
            <Grid columns={3} doubling stackable>
            {inventoryItems.map(item => (
                <Grid.Column key={item.id}>
                <Card as={Link} to={`/items/${item.id}`}>
                    <Image src={'/assets/drill.jpeg'} />
                    <Card.Content>
                    <Card.Header>{item.itemName}</Card.Header>
                    <Card.Description>{item.itemDescription}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                    {`${item.totalStock} in stock`}
                    </Card.Content>
                </Card>
                </Grid.Column>
            ))}
            </Grid>
        </Fragment>
    );
}