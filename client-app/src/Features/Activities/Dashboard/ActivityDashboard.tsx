import React, {useContext } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../Details/ActivityDetails';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/Stores/ActivityStore';
import ActivityForm from '../Form/ActivityForm';

const ActivityDashboard = () => {
    const activityStore = useContext(ActivityStore);
    const {editmode, selectedActivity} = activityStore;
    return (
      <Grid>
          <GridColumn width={10}>
            <ActivityList />
          </GridColumn>
          <GridColumn width={6}>
            {selectedActivity && !editmode && (<ActivityDetails />
               )}
            {editmode && (
            <ActivityForm 
            key={(selectedActivity && selectedActivity.id) || 0}
             activity={selectedActivity!}
             />)}
          </GridColumn>
      </Grid>  
    );
};

export default observer(ActivityDashboard);
