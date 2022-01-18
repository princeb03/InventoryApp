import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { UserFormValues } from "../../models/user";
import { useStore } from "../../stores/store";

interface Props {
    email: string;
    username: string;
    displayName: string;
}

export default observer(function ProfileDetailsForm(user: Props) {
    const { profileStore } = useStore();
    const { updateUser } = profileStore;
    const initialState: UserFormValues = {
        username: user.username,
        displayName: user.displayName,
        email: user.email
    };
    const [formData, setFormData] = useState<UserFormValues>(initialState);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({...formData, [e.currentTarget.name]: e.currentTarget.value});
    }

    function handleSubmit() {
        updateUser(formData);
        setFormData(initialState);
    }

    return (
        <Form onSubmit={handleSubmit} style={{padding: '2em'}}>
            <Header as='h1' content='Edit User Details' />
            <Form.Input name="email" value={formData.email} label="E-mail" onChange={handleChange} required/>
            <Form.Input name="displayName" value={formData.displayName} label="Display Name" onChange={handleChange} required/>
            <Form.Input name="username" value={formData.username} label="Username" onChange={handleChange} required/>
            <Button type="submit" content="Update" size='large' color="facebook" fluid/>
        </Form>     
    )
})