import React, { useContext, useEffect } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite'
import LoadingComponent from '../../../App/Layout/Loader/LoadingComponent';
import { RootStoreContext } from '../../../App/Stores/rootStore';

const ActivityDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial} = rootStore.activityStore;


  useEffect(() => {
      loadActivities();
  },[loadActivities]);

  if(loadingInitial){
    return <LoadingComponent content="Loading Activities"/>
  }
  return (
      <Grid>
          <GridColumn width={10}>
            <ActivityList />
          </GridColumn>
          <GridColumn width={6}>
            <h2>Activity Filters</h2>
          </GridColumn>
      </Grid>  
    );
};

export default observer(ActivityDashboard);
