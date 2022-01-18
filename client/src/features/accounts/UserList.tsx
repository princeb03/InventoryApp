import { observer } from "mobx-react-lite";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { Button, Form, Grid, GridColumn, Header, Loader, Segment } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";
import { PagingParams } from "../../models/pagination";
import { useStore } from "../../stores/store";
import RegisterForm from "./RegisterForm";

export default observer(function UserList() {
    const {userStore, modalStore} = useStore();
    const {
        getAllUsers, 
        userList,
        setPagingParams, 
        pagination,
        loadingInitial,
        resetStore,
        searchString,
        setSearchString
    } = userStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const [search, setSearch] = useState('');

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, pagination!.itemsPerPage));
        getAllUsers().then(() => setLoadingNext(false));
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.currentTarget.value);
    } 

    function handleSubmit() {
        setSearchString(search);
    }

    function handleBackToAll() {
        setSearch('');
        setSearchString('');
    }

    useEffect(() => {
        resetStore();
        getAllUsers();
    }, [getAllUsers, resetStore]);

    if (loadingInitial && !loadingNext) return (<LoadingComponent content="Loading users..." />);
    return (
        <Fragment>
            <Header as='h1' content='Users' />
            <Button 
                content='Create new user' 
                color='facebook'
                size='large'
                style={{marginBottom: '1em'}}
                onClick={() => modalStore.openModal(<RegisterForm />)}
            />
            {
                searchString !== '' &&
                <Button content='Back to All'
                    style={{marginBottom:'1em'}}
                    icon='arrow circle left'
                    color='grey'
                    size='mini'
                    onClick={handleBackToAll}
                />
            }
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Form>
                        <Form.Group>
                            <Form.Input
                                icon='search'
                                iconPosition='left'
                                placeholder='Search by Name...'
                                fluid
                                value={search}
                                onChange={handleChange}
                                width={12}
                            />
                            <Form.Button
                                content='Search'
                                fluid
                                color='facebook'
                                size='medium'
                                onClick={handleSubmit}
                                width={4}
                            />
                        </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <GridColumn width={16}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <Segment.Group>
                            {
                                userList.map((user, index) => (
                                    <Segment key={index}>
                                        <Header 
                                            content={user.displayName}
                                            as={Link}
                                            to={`/profiles/${user.username}`}
                                        />
                                        <p><strong>E-mail: </strong>{user.email}</p>
                                        <p><strong>Username: </strong>{user.username}</p>
                                        <Button 
                                            content="Go to Profile" 
                                            as={Link}
                                            to={`/profiles/${user.username}`}
                                            color='facebook'
                                            size="large"
                                            fluid
                                        />
                                    </Segment> 
                                ))
                            }
                        </Segment.Group>
                    </InfiniteScroll>
                </GridColumn>
                <GridColumn width={16}>
                    <Loader active={loadingNext} size='big' style={{marginTop: '1em'}} />
                </GridColumn>
            </Grid>
            
        </Fragment>
    );
});