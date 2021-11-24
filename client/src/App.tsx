import { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import OrderCart from './features/cart/OrderCart';
import ItemForm from './features/form/ItemForm';
import Dashboard from './features/inventory/Dashboard';
import ItemDetails from './features/inventory/ItemDetails';
import OrderDetails from './features/orders/OrderDetails';
import Profile from './features/profile/Profile';
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
    <Fragment>
      <Route exact path='/' component={LandingPage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{marginTop: '7rem'}}>
              <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route path="/create" component={ItemForm} />
                <Route path="/items/:id" component={ItemDetails} />
                <Route path="/cart" component={OrderCart} />
                <Route path="/profiles/:username" component={Profile} />
                <Route path="/orders/:orderId" component={OrderDetails} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default App;
