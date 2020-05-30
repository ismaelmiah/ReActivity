import React,{useState, useEffect, Fragment, SyntheticEvent, useContext} from 'react';
import {Container} from 'semantic-ui-react';
import { IActivity } from '../Models/Activity';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import Agent from '../Api/Agent';
import LoadingComponent from './Loader/LoadingComponent';
import ActivityStore from '../Stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import NavBar from '../../Features/Nav/NavBar';

  const App = () => {
    const activityStore = useContext(ActivityStore);
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [Editmode, setEditmode] = useState(false);
    const [Loading, setLoading] = useState(true);
    const [Submitting, setSubmitting] = useState(false);
    const [Target, setTarget] = useState('');
    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if(activityStore.loadingInitial){
      return <LoadingComponent content="Loading Activities"/>
    }

    
    const handleEditActivity = (activity: IActivity) => {
      setSubmitting(true);
      Agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(a=> a.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditmode(false);
      }).then(() => setSubmitting(false))
    }

    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
      setSubmitting(true);
      setTarget(event.currentTarget.name);
      Agent.Activities.delete(id).then(() => {
        setActivities([...activities.filter(a=> a.id !== id)])  
      }).then(() => setSubmitting(false))
    }
    return(
      <Fragment>
        <NavBar/>
        <Container style={{marginTop: '7em'}}>
        <ActivityDashboard
         activities={activityStore.activities}
         setEditmode={setEditmode}
         setSelectedActivity={setSelectedActivity}
         editActivity={handleEditActivity}
         deleteActivity={handleDeleteActivity} 
         submitting={Submitting}
         target={Target} />
        </Container>
    </Fragment>
    );
}

export default observer(App);
