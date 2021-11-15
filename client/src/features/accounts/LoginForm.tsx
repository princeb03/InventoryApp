import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { UserFormValues } from "../../models/user";
import { useStore } from "../../stores/store";

export default observer(function LoginForm() {

    const { userStore } = useStore();
    const { login } = userStore;
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
        <Form onSubmit={handleSubmit}>
            <Form.Input name="email" value={loginData.email} label="E-mail" onChange={handleChange} required/>
            <Form.Input name="password" type="password" value={loginData.password} label="Password" onChange={handleChange} required/>
            <Button type="submit" content="Login" positive />
        </Form>
    )
});