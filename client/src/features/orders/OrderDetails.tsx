import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Header, Table, Image, Button } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { useStore } from "../../stores/store";

export default observer(function OrderDetails() {
    const { orderId } = useParams<{orderId: string}>();
    const { orderStore, userStore } = useStore();
    const { getOrder, currentOrder, loading, toggleOrder } = orderStore;
    useEffect(() => {
        getOrder(orderId);
    },[getOrder, orderId]);

    if (currentOrder === null || loading) return <LoadingComponent content="Loading Order Details..." />
    return (
        <Fragment>
            <Header as='h1' content={currentOrder.id} />
            <Button as={Link} to={`/profiles/${userStore.currentUser?.username}`} size='medium' content='Back to Orders' color='grey' icon='arrow circle left'/>
            <Header as='h2' content={currentOrder.orderStatus} 
                color={currentOrder.orderStatus === 'Completed' ? 'green' : 'red'} 
            />
            <p><strong>Order Placed At: </strong>{currentOrder.orderCreatedAt}</p>
            
            {
                currentOrder.orderStatus === 'Completed' ? 
                <p><strong>Order Completed At: </strong>{currentOrder.orderCompletedAt}</p> :
                <Button content='Complete Order' 
                    positive 
                    size='large' 
                    onClick={() => toggleOrder(orderId)}
                />
            }
            <Header as='h2' content='Items' />
            <Table size='large'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={2}></Table.HeaderCell>
                        <Table.HeaderCell width={3}>Name</Table.HeaderCell>
                        <Table.HeaderCell width={9}>Description</Table.HeaderCell>
                        <Table.HeaderCell width={2} textAlign='center'>Quantity</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        currentOrder.orderItems.map((orderItem, index) => (
                            <Table.Row key={index}>
                                <Table.Cell><Image src='/assets/drill.jpeg' size='tiny' /></Table.Cell>
                                <Table.Cell>{<Link to={`/items/${orderItem.product.id}`}>{orderItem.product.itemName}</Link>}</Table.Cell>
                                <Table.Cell>{orderItem.product.itemDescription}</Table.Cell>
                                <Table.Cell textAlign='center'>{orderItem.quantity}</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
        </Fragment>
    );
});