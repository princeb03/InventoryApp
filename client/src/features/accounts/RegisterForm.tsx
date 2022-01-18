import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { UserFormValues } from "../../models/user";
import { useStore } from "../../stores/store";

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    const { register } = userStore;
    const initialState: UserFormValues = {
        username: '',
        displayName: '',
        email: '',
        password: ''
    };
    const [registerData, setregisterData] = useState<UserFormValues>(initialState);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setregisterData({...registerData, [e.currentTarget.name]: e.currentTarget.value});
    }

    function handleSubmit() {
        register(registerData);
        setregisterData(initialState);
    }

    return (
        <Form onSubmit={handleSubmit} style={{padding: '2em'}}>
            <Header as='h1' content='Register New User' />
            <Form.Input name="email" value={registerData.email} label="E-mail" onChange={handleChange} required/>
            <Form.Input name="displayName" value={registerData.displayName} label="Display Name" onChange={handleChange} required/>
            <Form.Input name="username" value={registerData.username} label="Username" onChange={handleChange} required/>
            <Form.Input name="password" type="password" value={registerData.password} label="Password" onChange={handleChange} required/>
            <Button type="submit" content="Register" size='large' color="facebook" fluid/>
        </Form>     
    )
});