import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form';
import { Form, Button, Label } from 'semantic-ui-react';
import TextInput from '../../App/common/form/TextInput';
import { RootStoreContext } from '../../App/Stores/rootStore';
import { IUserFormValue } from '../../App/Models/User';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
    email: isRequired('Email'),
    password: isRequired('Password')
})

const LoginForm = () => {

    const rootStore = useContext(RootStoreContext);
    const {login} = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValue) => login(values).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                <Form onSubmit={handleSubmit}>
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field name='password' component={TextInput} placeholder='Password' type='password' />
                    {submitError && !dirtySinceLastSubmit && (<Label color='red' basic content={submitError.statusText} />)}
                    <br />
                    <Button disabled={invalid && !dirtySinceLastSubmit || pristine} loading={submitting} positive content='Login' />
                    <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
                </Form>
            )}
        />
    )
}

export default LoginForm
