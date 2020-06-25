import React,{Fragment} from 'react';
import {Container} from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import NavBar from '../../Features/Nav/NavBar';
import { Route, withRouter, RouteComponentProps, Switch} from 'react-router-dom';
import HomePage from '../../Features/Home/HomePage';
import ActivityForm from '../../Features/Activities/Form/ActivityForm';
import ActivityDetails from '../../Features/Activities/Details/ActivityDetails';
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';
import LoginForm from '../../Features/User/LoginForm';

const App: React.FC<RouteComponentProps> =({location}) => {
    return(
      <Fragment>
        <ToastContainer position = 'bottom-right' />
        <Route exact path='/' component = {HomePage} />
        <Route path={'/(.+)'} render={() => (
          <Fragment>
            <NavBar/>
              <Container style={{marginTop: '7em'}}>
              <Switch>
                <Route exact path='/activities' component = {ActivityDashboard} />
                <Route path='/activities/:id' component = {ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component = {ActivityForm} />
                <Route path='/login' component={LoginForm} />
                <Route component={NotFound} />
              </Switch>            
            </Container>
          </Fragment>
        )} />
    </Fragment>
    );
}

export default withRouter(observer(App));
