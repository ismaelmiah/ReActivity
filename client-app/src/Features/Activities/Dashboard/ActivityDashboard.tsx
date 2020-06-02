import React, { useContext, useEffect } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/Stores/ActivityStore';
import LoadingComponent from '../../../App/Layout/Loader/LoadingComponent';

const ActivityDashboard = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
      activityStore.loadActivities();
  }, [activityStore]);

  if(activityStore.loadingInitial){
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
