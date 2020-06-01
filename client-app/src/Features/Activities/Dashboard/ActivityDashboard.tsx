import React, {useContext } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../Details/ActivityDetails';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/Stores/ActivityStore';
import ActivityForm from '../Form/ActivityForm';

const ActivityDashboard = () => {
    const activityStore = useContext(ActivityStore);
    const {editmode, Activity} = activityStore;
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
