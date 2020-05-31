import React,{useEffect, Fragment, useContext} from 'react';
import {Container} from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import LoadingComponent from './Loader/LoadingComponent';
import ActivityStore from '../Stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import NavBar from '../../Features/Nav/NavBar';

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
        <ActivityDashboard />
        </Container>
    </Fragment>
    );
}

export default observer(App);
