import { Grid, GridColumn, Header } from "semantic-ui-react";
import LoginForm from "../features/accounts/LoginForm";

export default function LandingPage() {
    return (
        <Grid>
            <GridColumn width={10}>
                <Header content="Slab Specialists Inventory" />
            </GridColumn>
            <GridColumn width={6}>
                <LoginForm />
            </GridColumn>
        </Grid>
    )
}