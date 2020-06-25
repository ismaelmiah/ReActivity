import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../App/common/form/TextInput';
import { RootStoreContext } from '../../App/Stores/rootStore';
import { IUserFormValue } from '../../App/Models/User';

const LoginForm = () => {

    const rootStore = useContext(RootStoreContext);
    const {login} = rootStore.user;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValue) => login(values)}
            render={({handleSubmit}) => (
                <Form onSubmit={handleSubmit}>
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field name='password' component={TextInput} placeholder='Password' type='password' />
                    <Button positive content='Login' />
                </Form>
            )}
        />
    )
}

export default LoginForm
