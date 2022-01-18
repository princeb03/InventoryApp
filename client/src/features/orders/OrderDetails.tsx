import { observer } from "mobx-react-lite";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Header, Table, Image, Button, Form } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { useStore } from "../../stores/store";

export default observer(function OrderDetails() {
    const { orderId } = useParams<{orderId: string}>();
    const { orderStore, userStore } = useStore();
    const { getOrder, currentOrder, loading, loadingInitial, toggleOrder, editNotes } = orderStore;
    const [orderNotes, setOrderNotes] = useState("");
    const [editMode, setEditMode] = useState(false);
    useEffect(() => {
        getOrder(orderId);
        setEditMode(false);
        setOrderNotes(currentOrder?.notes ? currentOrder.notes : "");
    },[getOrder, orderId, currentOrder?.notes]);

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setOrderNotes(e.currentTarget.value);
    }

    function handleSubmit() {
        editNotes(orderId, orderNotes);
    }

    if (currentOrder === null || loadingInitial) return <LoadingComponent content="Loading Order Details..." />
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
                    loading={loading}
                    color='facebook' 
                    size='large' 
                    onClick={() => {
                        toggleOrder(orderId);
                        toast.info('Order completed.', {autoClose: 1000});
                    }}
                />
            }
            <Header as='h2' content='Notes' />
            {
                editMode ? 
                <Form>
                    <Form.TextArea placeholder="Type order notes here..." rows={4} value={orderNotes} onChange={handleChange} />
                    <Button content='Close' color='grey' 
                        onClick={() => setEditMode(false)}
                    />
                    <Button type='submit' content='Submit' color='facebook' onClick={handleSubmit} loading={loading} />
                </Form> :
                <Fragment>
                    <p>{currentOrder.notes}</p>
                    <Button color='facebook' content='Edit Notes' 
                        onClick={() => setEditMode(true)}
                    />
                </Fragment>
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
                                <Table.Cell><Image src={orderItem.product.mainPhoto || '/assets/Cordless-Hammer-Drill.png'} size='tiny' /></Table.Cell>
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