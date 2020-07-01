import React, { useContext, Fragment } from 'react';
import {Link} from 'react-router-dom';
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { RootStoreContext } from '../../App/Stores/rootStore';
import LoginForm from '../User/LoginForm';
import RegisterForm from '../User/RegisterForm';

const HomePage = () => {

    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;
    const {openModal} = rootStore.modalStore;
    return (        
    <Segment inverted textAlign='center' vertical className='masthead' >
        <Container text>
            <Header as='h1' inverted>
                <Image size='massive' src='/items/logo.png' alt='logo' style={{marginBottom: 12}}/>
                Reactivities
            </Header>
            {isLoggedIn && user ? (
                <Fragment>
                    <Header as='h2' inverted content={`Welcome to ${user.displayName}`} />
                    <Button as={Link} to='/activities' size='huge' inverted>
                        Go To Activites!
                    </Button>
                </Fragment>
                ):(
                <Fragment>
                    <Header as='h2' inverted content='Welcome to Reactivities' />
                    <Button onClick={() => openModal(<LoginForm />)} size='huge' inverted>
                        Login
                    </Button>
                    <Button onClick={() => openModal(<RegisterForm />)} size='huge' inverted>
                        Register
                    </Button>
                </Fragment>
            )}
        </Container>
    </Segment>

    )
}

export default HomePage
