import React, { useContext } from 'react'
import { Form as FinalForm, Field} from 'react-final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import { RootStoreContext } from '../../App/Stores/rootStore';
import TextInput from '../../App/common/form/TextInput';
import ErrorMessage from '../../App/common/form/ErrorMessage';
import { IUserFormValue } from "../../App/Models/User";

const validate = combineValidators({
    username: isRequired('User Name'),
    displayName: isRequired('Display Name'),
    email: isRequired('Email'),
    password: isRequired('Password')
})

const RegisterForm = () => {

    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;
    return (
        <FinalForm 
            onSubmit={(values: IUserFormValue) => 
                {
                    return register(values).catch(error => ({
                        [FORM_ERROR]: error
                    }));
                }}

            validate={validate}
            render = {({
                handleSubmit, 
                submitting, 
                submitError, 
                invalid, 
                pristine,
                dirtySinceLastSubmit
            }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header
                        as='h2'
                        content='Sign Up to ReActivity'
                        color='green'
                        textAlign='center'
                    />
                    <Field name='username' component={TextInput} placeholder='User Name'/>
                    <Field name='displayName' component={TextInput} placeholder='Display Name'/>
                    <Field name='email' component={TextInput} placeholder='Ex: ismail@gmail.com'/>
                    <Field 
                        name='password' 
                        component={TextInput} 
                        placeholder='Password' 
                        type='password'
                    />
                    {submitError && !dirtySinceLastSubmit && (
                        <ErrorMessage
                            error={submitError}
                        />
                    )}
                    <Button 
                        disabled={(invalid && !dirtySinceLastSubmit) || pristine} 
                        loading={submitting} 
                        color='blue' 
                        content='Register'
                        fluid
                    />
                </Form>
            )}
        />
    )
}

export default RegisterForm