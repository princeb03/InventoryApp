import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../stores/store";

export default observer(function ProfileOrderFilters() {
    const { profileStore } = useStore();
    const { orderFilters, setOrderFilter } = profileStore;
    
    return (
        <Fragment>
            <Menu vertical fluid>
                <Header icon='filter' attached content='Filters'/>
                <Menu.Item
                    content='All Orders'
                    active={orderFilters.has('all')}
                    onClick={() => setOrderFilter('all')}
                    />
                <Menu.Item
                    content='Completed'
                    active={orderFilters.has('isCompleted')}
                    onClick={() => setOrderFilter('isCompleted')} 
                    />
                <Menu.Item
                    content='In Use'
                    active={orderFilters.has('isInUse')}
                    onClick={() => setOrderFilter('isInUse')}
                    />
            </Menu>
        </Fragment>
    )
});