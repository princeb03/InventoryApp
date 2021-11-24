import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container, Dropdown, DropdownItem, DropdownMenu, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer(function NavBar() {
    const { userStore } = useStore();
    const { isLoggedIn, logout, currentUser } = userStore;
    return (
        <Menu fixed='top' inverted>
            <Container>
                <MenuItem as={NavLink} to="/" content="Home"/>
                <MenuItem as={NavLink} to="/dashboard" content="Inventory"/>
                <MenuItem as={NavLink} to="/create" content="Add to Inventory"/>
                {
                    isLoggedIn && 
                    <Fragment>
                        <MenuItem as={NavLink} to="/cart" content="My Cart" position='right' icon='cart' />
                        <MenuItem>
                            <Dropdown pointing='top right' text={`Welcome, ${currentUser?.displayName}`}>
                                <DropdownMenu>
                                    <DropdownItem
                                        icon='user'
                                        text='My Profile'
                                        as={Link}
                                        to={`/profiles/${currentUser?.username}`} 
                                    />
                                    <DropdownItem 
                                        text="Logout"
                                        onClick={logout}
                                        icon='sign-out' 
                                    />
                                </DropdownMenu>
                            </Dropdown>
                        </MenuItem>
                    </Fragment>
                }
            </Container>
        </Menu>
    );
})