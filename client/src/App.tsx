import { Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import ItemForm from './features/form/ItemForm';
import Dashboard from './features/inventory/Dashboard';
import ItemDetails from './features/inventory/ItemDetails';
import LandingPage from './layout/LandingPage';
import NavBar from './layout/NavBar';

function App() {

  return (
    <BrowserRouter>
      <Fragment>
        <NavBar />
        <Container style={{marginTop: '7rem'}}>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path="/create" component={ItemForm} />
            <Route path="/items/:id" component={ItemDetails} />
          </Switch>
        </Container>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
