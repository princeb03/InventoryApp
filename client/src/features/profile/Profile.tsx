import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
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
            
            <p><strong></strong></p>
            <Header as='h2' content='My Orders' />
            <Segment.Group>
            {
                currentProfile.orders.map((order, index) => (
                    <Segment key={index}>
                        <Header as='h3' content={order.id} />
                        <p><strong>Created at:</strong> {order.orderCreatedAt}</p>
                        {order.orderStatus === 'Completed' && <p><strong>Completed at:</strong> {order.orderCompletedAt}</p>}
                        <p><strong>Status:</strong> {order.orderStatus}</p>
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