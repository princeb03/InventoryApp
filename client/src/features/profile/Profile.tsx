import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Grid, Header, Label, Loader, Segment } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { PagingParams } from "../../models/pagination";
import { useStore } from "../../stores/store";
import ProfileDetailsForm from "./ProfileDetailsForm";
import ProfileOrderFilters from "./ProfileOrderFilters";

export default observer(function Profile() {
    const { username } = useParams<{username: string}>();
    const [loadingNext, setLoadingNext] = useState(false);
    const { profileStore, modalStore, userStore } = useStore();
    const { 
        getProfile, 
        profileUser,
        profileOrders,
        loading, 
        setPagingParams, 
        pagination, 
        resetStore 
    } = profileStore;
    
    useEffect(() => {
        resetStore();
        getProfile(username);
    }, [getProfile, username, resetStore]);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, pagination?.itemsPerPage));
        getProfile(username).then(() => setLoadingNext(false));
    }

    if (profileUser == null || (loading && !loadingNext)) return <LoadingComponent content='Loading Profile...' />
    return (
        <Fragment>
            <Header as='h1' content={profileUser.displayName} />
            <Header as='h2' content='Details' />
            <Fragment>
                <p><strong>E-mail: </strong>{profileUser.email}</p>
                <p><strong>Username: </strong>{profileUser.username}</p>
                <p><strong>Display Name: </strong>{profileUser.displayName}</p>
                {
                    userStore.currentUser?.role === "admin" && 
                    <Button 
                        content='Edit Details' 
                        color='facebook' 
                        onClick={() => modalStore.openModal(
                            <ProfileDetailsForm 
                                email={profileUser.email} 
                                displayName={profileUser.displayName}
                                username={profileUser.username}
                            />
                            )
                        }
                    />
                }
                
            </Fragment>
            
            <Header as='h2' content='My Orders' />
            <Grid>
                <Grid.Column width={11}>
                    {profileOrders.length >= 1 ?
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination?.currentPage < pagination?.totalPages}
                        initialLoad={false}
                    >
                        <Segment.Group>
                        {
                            profileOrders.map((order, index) => (
                                <Segment key={index}>
                                    <Header as={Link} to={`/orders/${order.id}`} content={order.id} style={{display:'block', marginBottom: '0.3em'}}/>
                                    {order.orderStatus === 'Completed' ? 
                                        <Label color='green' content='Completed' style={{marginBottom:'1em'}} /> : 
                                        <Label color='red' content='In Use' style={{marginBottom:'1em'}}/>}
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
                    </InfiniteScroll> : <Header content='No orders.' />
                    } 
                    
                </Grid.Column>
                <Grid.Column width={5}>
                    <ProfileOrderFilters />
                </Grid.Column>
                <Grid.Column width={11}>
                    <Loader active={loadingNext} inverted size='large'/>
                </Grid.Column>
            </Grid>
            
        </Fragment>
    );
});