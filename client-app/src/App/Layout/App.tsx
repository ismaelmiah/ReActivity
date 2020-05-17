import React,{useState, useEffect, Fragment, SyntheticEvent} from 'react';
import {Container} from 'semantic-ui-react';
import { IActivity } from '../Models/Activity';
import { NavBar } from '../../Features/Nav/NavBar';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import Agent from '../Api/Agent';
import LoadingComponent from './Loader/LoadingComponent';

  const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const[Editmode, setEditmode] = useState(false);
    const [Loading, setLoading] = useState(true);
    const [Submitting, setSubmitting] = useState(false);
    const [Target, setTarget] = useState('');
    useEffect(() => {
      //axios.get<IActivity[]>('http://localhost:5000/activities').then((response) => {
       Agent.Activities.list().then((response) => { 
        console.log(response);
        let activities: IActivity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      }).then(() => setLoading(false));
    }, []);

    if(Loading){
      return <LoadingComponent content="Loading Activities"/>
    }

    const handleSelectActivity = (id: string) => {
      setSelectedActivity(activities.filter( a => a.id === id)[0])
      setEditmode(false);
    }

    const handleOpenCreateForm = () => {
      setSelectedActivity(null);
      setEditmode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
      setSubmitting(true);
      Agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditmode(false);
      }).then(() => setSubmitting(false))
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
        <NavBar openCreateForm={handleOpenCreateForm} />
        <Container style={{marginTop: '7em'}}>
        <ActivityDashboard
         activities={activities}
         selectActivity={handleSelectActivity}
         selectedActivity={selectedActivity}
         editmode={Editmode}
         setEditmode={setEditmode}
         setSelectedActivity={setSelectedActivity}
         createActivity={handleCreateActivity}
         editActivity={handleEditActivity}
         deleteActivity={handleDeleteActivity} 
         submitting={Submitting}
         target={Target} />
        </Container>
    </Fragment>
    );
}

export default App;
