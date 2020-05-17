import React, { SyntheticEvent } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import { IActivity } from '../../../App/Models/Activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../Details/ActivityDetails';
import { ActivityForm } from '../Form/ActivityForm';

interface IProps{
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    setSelectedActivity: (activity: IActivity | null) => void;
    editmode: boolean;
    setEditmode: (editmode: boolean) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    submitting: boolean;
    target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  setSelectedActivity,
  editmode,
  setEditmode,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target}) => {
    return (
      <Grid>
          <GridColumn width={10}>
            <ActivityList 
            activities={activities}
            selectActivity={selectActivity}
            deleteActivity={deleteActivity}
            submitting={submitting}
            target={target}/>
          </GridColumn>
          <GridColumn width={6}>
            {selectedActivity && !editmode && (<ActivityDetails
             activity={selectedActivity}
              setEditmode={setEditmode}
               setSelectedActivity={setSelectedActivity}/>
               )}
            {editmode && (
            <ActivityForm 
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditmode={setEditmode}
             activity={selectedActivity!}
             createActivity={createActivity}
             editActivity={editActivity}
             submitting={submitting}
             />)}
          </GridColumn>
      </Grid>  
    );
};

export default ActivityDashboard
