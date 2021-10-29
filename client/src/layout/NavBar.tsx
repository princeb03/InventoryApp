import { NavLink } from "react-router-dom";
import { Container, Menu, MenuItem } from "semantic-ui-react";

export default function NavBar() {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <MenuItem as={NavLink} to="/" content="Home"/>
                <MenuItem as={NavLink} to="/" content="All items"/>
                <MenuItem as={NavLink} to="/create" content="Create New"/>
                <MenuItem position='right' content="Login" />
            </Container>
        </Menu>
    );
}