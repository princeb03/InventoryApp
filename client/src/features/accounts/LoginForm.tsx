import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { UserFormValues } from "../../models/user";
import { useStore } from "../../stores/store";

export default observer(function LoginForm() {

    const { userStore } = useStore();
    const { login, loading } = userStore;
    const initialState: UserFormValues = {
        email: '',
        password: ''
    };
    const [loginData, setLoginData] = useState<UserFormValues>(initialState);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setLoginData({...loginData, [e.currentTarget.name]: e.currentTarget.value});
    }

    function handleSubmit() {
        login(loginData);
        setLoginData(initialState);
    }

    return (
        <Form style={{padding: '2em'}} onSubmit={handleSubmit}>
            <Header as='h2' content='Login' />
            <Form.Input name="email" value={loginData.email} label="E-mail" onChange={handleChange} required/>
            <Form.Input name="password" type="password" value={loginData.password} label="Password" onChange={handleChange} required/>
            <Button fluid loading={loading} type="submit" content="Login" positive />
        </Form>
    )
});