import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { Header, Grid, Loader } from "semantic-ui-react";
import InfiniteScroll from 'react-infinite-scroller';
import LoadingComponent from "../../layout/LoadingComponent";
import { PagingParams } from "../../models/pagination";
import { useStore } from "../../stores/store";
import ItemCard from "./ItemCard";

export default observer (function Dashboard() {
    const { inventoryStore, userStore } = useStore();
    const { inventoryItems, getAll, loadingInitial, setPagingParams, pagination, resetStore } = inventoryStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, pagination?.itemsPerPage));
        getAll().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        resetStore();
        getAll();
    }, [getAll, userStore.currentUser, resetStore]);
    if (loadingInitial && !loadingNext) return (<LoadingComponent content="Loading items..." />)
    return (
        <Fragment>
            <Header as='h1' style={{marginBottom: '3rem'}} content="All Items" />
            <Grid>
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