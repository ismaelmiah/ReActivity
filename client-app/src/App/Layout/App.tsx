import React,{useEffect, Fragment, useContext} from 'react';
import {Container} from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import LoadingComponent from './Loader/LoadingComponent';
import ActivityStore from '../Stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import NavBar from '../../Features/Nav/NavBar';
import { Route } from 'react-router-dom';
import HomePage from '../../Features/Home/HomePage';
import ActivityForm from '../../Features/Activities/Form/ActivityForm';
import ActivityDetails from '../../Features/Activities/Details/ActivityDetails';

  const App = () => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if(activityStore.loadingInitial){
      return <LoadingComponent content="Loading Activities"/>
    }

    return(
      <Fragment>
        <NavBar/>
        <Container style={{marginTop: '7em'}}>
        <Route exact path='/' component = {HomePage} />
        <Route exact path='/activities' component = {ActivityDashboard} />
        <Route path='/activities/:id' component = {ActivityDetails} />
        <Route path='/createActivity' component = {ActivityForm} />
        </Container>
    </Fragment>
    );
}

export default observer(App);
