import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Container, Header, Segment, Button, Icon } from "semantic-ui-react";
import LoginForm from "../features/accounts/LoginForm";
import { useStore } from "../stores/store";

export default observer(function LandingPage() {
    const { userStore, modalStore } = useStore();
    const { isLoggedIn } = userStore;
    const landingStyle = {
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        // backgroundImage: "linear-gradient(135deg,rgb(24, 42, 115) 0%,rgb(33, 138, 174) 69%,rgb(32, 167, 172) 89%)"
        backgroundImage: "linear-gradient(to right bottom, rgb(41, 152, 255), rgb(86, 67, 250))"
    };
    if (isLoggedIn) return <Redirect to='/dashboard'/>
    return (
        <Segment vertical textAlign='center' style={landingStyle}>
            <Container>
                <Header as='h1' inverted style={{fontSize: '3.5em'}}>
                    {/* <Image centered src='/assets/CompanyLogo.png' size='large' style={{marginBottom: 12}} /> */}
                    <Icon name='warehouse' size='large' style={{marginRight: '0.4em'}} />
                    Inventory Application
                </Header>
                <Header as='h2' inverted content='Welcome!' style={{fontSize: '2em'}}/>
                {
                    isLoggedIn ? 
                    <Fragment>
                        <Button size='big' inverted as={Link} to='/dashboard' content='Go to Inventory' />
                    </Fragment> :
                    <Fragment>
                        <Button size='big' inverted onClick={() => modalStore.openModal(<LoginForm />)} >
                            Login
                        </Button>
                    </Fragment>
                }              
            </Container>
        </Segment>
        
    )
});