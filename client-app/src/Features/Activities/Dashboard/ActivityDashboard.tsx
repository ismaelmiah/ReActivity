import React, { SyntheticEvent, useContext } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import { IActivity } from '../../../App/Models/Activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../Details/ActivityDetails';
import { ActivityForm } from '../Form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/Stores/ActivityStore';

interface IProps{
    activities: IActivity[];
    setSelectedActivity: (activity: IActivity | null) => void;
    setEditmode: (editmode: boolean) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    submitting: boolean;
    target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  setSelectedActivity,
  setEditmode,
  editActivity,
  deleteActivity,
  submitting,
  target}) => {
    const activityStore = useContext(ActivityStore);
    const {editmode, selectedActivity} = activityStore;
    return (
      <Grid>
          <GridColumn width={10}>
            <ActivityList 
            deleteActivity={deleteActivity}
            submitting={submitting}
            target={target}/>
          </GridColumn>
          <GridColumn width={6}>
            {selectedActivity && !editmode && (<ActivityDetails
              setEditmode={setEditmode}
               setSelectedActivity={setSelectedActivity}/>
               )}
            {editmode && (
            <ActivityForm 
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditmode={setEditmode}
             activity={selectedActivity!}
             editActivity={editActivity}
             submitting={submitting}
             />)}
          </GridColumn>
      </Grid>  
    );
};

export default observer(ActivityDashboard);
