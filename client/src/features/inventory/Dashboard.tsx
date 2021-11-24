import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { Header, Grid } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { useStore } from "../../stores/store";
import ItemCard from "./ItemCard";

export default observer (function Dashboard() {
    const { inventoryStore, userStore } = useStore();
    const { inventoryItems, getAll, loadingInitial } = inventoryStore;
    useEffect(() => {
        getAll();
    }, [getAll, userStore.currentUser]);
    if (loadingInitial) return (<LoadingComponent content="Loading items..." />)
    return (
        <Fragment>
            <Header as='h1' style={{marginBottom: '3rem'}} content="All Items" />
            <Grid columns={3} doubling stackable>
            {inventoryItems.map(item => (
                <Grid.Column key={item.id}>
                    <ItemCard item={item} />
                </Grid.Column>
            ))}
            </Grid>        
        </Fragment>
    );
})