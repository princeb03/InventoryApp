import { observer } from "mobx-react-lite"
import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, GridColumn, Header, Segment, SegmentGroup, Image } from "semantic-ui-react";
import { useStore } from "../../stores/store"

export default observer(function OrderCart() {
    const { orderStore } = useStore();
    const { cart, removeFromCart, placeOrder, setCart } = orderStore;
    useEffect(() => {
        setCart();
    }, [setCart]);
    return (
        <Fragment>
            <Header as="h1" content="My Cart" />
            {
                cart.length === 0 ? 
                <Fragment>
                    <Header as='h3' content='No items in your cart.' />
                    <Button as={Link} to='/dashboard' size='huge' content='Back to Items' color='facebook' />
                </Fragment>
                :
                <Fragment>
                    <Button as={Link} to='/dashboard' size='medium' content='Back to Items' color='grey' icon='arrow circle left'/>
                    <SegmentGroup>
                    {   
                        cart.map((orderItem, index) => (
                            <Segment key={index}>
                                <Grid doubling stackable>
                                    <GridColumn width={2} verticalAlign='middle'>
                                        <Image src='/assets/drill.jpeg' />
                                    </GridColumn>
                                    <GridColumn width={5} verticalAlign='middle'>
                                        <Header content={orderItem.product.itemName} />
                                        <p>{orderItem.product.itemDescription}</p>
                                    </GridColumn>
                                    <GridColumn width={5} verticalAlign='middle'>
                                        <p>{orderItem.quantity}</p>
                                    </GridColumn>
                                    <GridColumn width={4} verticalAlign='middle'>
                                        <Button floated='right' 
                                            content="Remove from cart" 
                                            onClick={() => removeFromCart(index)}
                                            negative />
                                    </GridColumn>
                                </Grid>
                            </Segment>
                        ))
                    }
                    </SegmentGroup>
                    <Button size='huge' content='Checkout' color='facebook' onClick={placeOrder}/>
                </Fragment>
            }
            
            
        </Fragment>
    )
})