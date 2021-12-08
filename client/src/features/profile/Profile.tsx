import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Header, Label, Segment } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { useStore } from "../../stores/store";

export default observer(function Profile() {
    const { username } = useParams<{username: string}>();
    const { profileStore } = useStore();
    const { getProfile, currentProfile, loading } = profileStore;
    
    useEffect(() => {
        getProfile(username);
    }, [getProfile, username])
    if (currentProfile == null || loading) return <LoadingComponent content='Loading Profile...' />
    return (
        <Fragment>
            <Header as='h1' content={currentProfile.displayName} />
            <Header as='h2' content='Details' />
            <p>{`E-mail: ${currentProfile.email}`}</p>
            <p>{`Username: ${currentProfile.username}`}</p>
            <p>{`Display Name: ${currentProfile.displayName}`}</p>
            <Button content='Edit Details' color='facebook' />
            <Header as='h2' content='My Orders' />
            <Segment.Group>
            {
                currentProfile.orders.map((order, index) => (
                    <Segment key={index}>
                        <Header as={Link} to={`/orders/${order.id}`} content={order.id} />
                        <p>{order.orderStatus === 'Completed' ? <Label color='green' content='Completed' /> : <Label color='red' content='In Use' />}</p>
                        <p><strong>Created at:</strong> {order.orderCreatedAt}</p>
                        {order.orderStatus === 'Completed' && <p><strong>Completed at:</strong> {order.orderCompletedAt}</p>}
                        <Button 
                            as={Link}
                            to={`/orders/${order.id}`}
                            color='facebook' 
                            content='View Order' 
                            size='large' 
                            fluid />
                    </Segment>
                ))
            }
            </Segment.Group>
        </Fragment>
    );
});