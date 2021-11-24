import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Header, Image } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { useStore } from "../../stores/store";

export default observer(function ItemDetails() {
    const {id} = useParams<{id: string}>();
    const { inventoryStore } = useStore();
    const { getDetails, currentItem, loadingInitial } = inventoryStore;
    useEffect(() => {
        getDetails(id);
    }, [getDetails, id]);

    if (loadingInitial) return (<LoadingComponent content='Loading Item...' />);
    return (
        <Fragment>
            <Image src='/assets/drill.jpeg' floated='right' size='large' />
            <Button as={Link} to='/dashboard' size='medium' content='Back to Items' color='grey' icon='arrow circle left'/>
            <Header as='h1' content={currentItem?.itemName} dividing />
            <p>{currentItem?.itemDescription}</p>
            <Header as='h2' content='Total Stock' dividing/>
            <p>{currentItem?.totalStock}</p>
            <Header as='h2' content='Available Stock' dividing />
            <p>{currentItem?.availableStock}</p>
            <Header as='h2' content='Orders' dividing />
            <p>Orders go here</p>
        </Fragment>
    );
});