import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Header } from "semantic-ui-react";
import agent from "../../api/agent";
import { InventoryItem } from "../../models/inventoryItem";

export default function ItemDetails() {
    const {id} = useParams<{id: string}>();
    const [item, setItem] = useState<InventoryItem>();

    // useEffect(() => {
    //     agent.Inventory.get(id).then(item => setItem(item));
    // }, [id]);

    return (
        <Fragment>
            <Header content={item?.itemName} />
            <Header as='h2' content={item?.itemDescription} />
            <Header as='h2' content={item?.totalStock} />
        </Fragment>
    );
}