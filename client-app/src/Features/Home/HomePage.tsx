import React from 'react';
import {Link} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

const HomePage = () => {
    return (
        <Container style={{marginTop: '7em'}}>
            <h1>Home Page</h1>
            <p>Go to <Link to='/activities'>Activities</Link></p>
        </Container>
    )
}

export default HomePage
