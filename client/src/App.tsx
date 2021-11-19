import { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import OrderCart from './features/cart/OrderCart';
import ItemForm from './features/form/ItemForm';
import Dashboard from './features/inventory/Dashboard';
import ItemDetails from './features/inventory/ItemDetails';
import LandingPage from './layout/LandingPage';
import NavBar from './layout/NavBar';
import { useStore } from './stores/store';

function App() {
  const { userStore } = useStore();;
  const { getCurrentUser } = userStore;

  useEffect(() => {
    const token = localStorage.getItem('inventoryToken');
    if (token) {
      getCurrentUser();
    }
  }, [getCurrentUser]);

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
            <Route path="/cart" component={OrderCart} />
          </Switch>
        </Container>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
