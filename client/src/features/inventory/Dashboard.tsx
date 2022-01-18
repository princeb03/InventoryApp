import { observer } from "mobx-react-lite";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Header, Grid, Loader, Form, Button } from "semantic-ui-react";
import InfiniteScroll from 'react-infinite-scroller';
import LoadingComponent from "../../layout/LoadingComponent";
import { PagingParams } from "../../models/pagination";
import { useStore } from "../../stores/store";
import ItemCard from "./ItemCard";
import ItemForm from "./ItemForm";

export default observer (function Dashboard() {
    const { inventoryStore, userStore, modalStore } = useStore();
    const { inventoryItems, 
        getAll, 
        loadingInitial, 
        setPagingParams, 
        pagination, 
        resetStore, 
        setSearchString, 
        searchString } = inventoryStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const [search, setSearch] = useState('');

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, pagination?.itemsPerPage));
        getAll().then(() => setLoadingNext(false));
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
        getAll();
    }, [getAll, userStore.currentUser, resetStore]);

    if (loadingInitial && !loadingNext) return (<LoadingComponent content="Loading items..." />)
    return (
        <Fragment>
            <Header 
                as='h1' 
                content="All Items" 
            />
            {
                userStore.currentUser?.role === "admin" && 
                <Button 
                content='Create new item'
                color='facebook'
                size='large'
                style={{marginBottom: '1em'}}
                onClick={() => modalStore.openModal(<ItemForm />)}
            />
            }
            
            {
                searchString !== '' && 
                <Button content='Back to All' 
                    style={{marginBottom: '1em'}}
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
                                placeholder='Search by Item Name...'
                                fluid
                                value={search}
                                onChange={handleChange}
                                width={12}
                            /> 
                            <Form.Button 
                                content="Search"
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
                <Grid.Column width={16}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <Grid columns={3} doubling stackable>
                        {
                            inventoryItems.map(item => (
                                <Grid.Column key={item.id}>
                                    <ItemCard item={item} />
                                </Grid.Column>
                                ))
                        }
                        </Grid>
                    </InfiniteScroll>   
                </Grid.Column>
                <Grid.Column width={16}>
                    <Loader  active={loadingNext} size='big' style={{marginTop: '1em', marginBottom: '5em'}} /> 
                </Grid.Column>
            </Grid>
        </Fragment>
    );
})