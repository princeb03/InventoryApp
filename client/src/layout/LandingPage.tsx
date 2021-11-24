import { observer } from "mobx-react-lite";
import { Redirect } from "react-router-dom";
import { Container, Header, Segment, Image } from "semantic-ui-react";
import LoginForm from "../features/accounts/LoginForm";
import { useStore } from "../stores/store";

export default observer(function LandingPage() {
    const { userStore } = useStore();
    const { isLoggedIn } = userStore;
    const landingStyle = {
        display: 'flex',
        height: '100vh',
        alignItems: 'center'
    };
    if (isLoggedIn) return <Redirect to='/dashboard'/>
    return (
        <Segment vertical style={landingStyle}>
            <Container textAlign='center'>
                <Image centered src='/assets/CompanyLogo.png' size='large' />
                <Header content='Welcome to the Slab Specialists Inventory' />        
                <LoginForm />          
            </Container>
        </Segment>
        
    )
});