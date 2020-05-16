import React,{useState, useEffect, Fragment} from 'react';
import {Container} from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../Models/Activity';
import { NavBar } from '../../Features/Nav/NavBar';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';

  const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const[Editmode, setEditmode] = useState(false);

    useEffect(() => {
      axios.get<IActivity[]>('http://localhost:5000/activities').then((response) => {
        console.log(response);
        let activities: IActivity[] = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities)
      });
    }, []);

    const handleSelectActivity = (id: string) => {
      setSelectedActivity(activities.filter( a => a.id === id)[0])
      setEditmode(false);
    }

    const handleOpenCreateForm = () => {
      setSelectedActivity(null);
      setEditmode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditmode(false);
    }

    const handleEditActivity = (activity: IActivity) => {
      setActivities([...activities.filter(a=> a.id !== activity.id), activity])
      setSelectedActivity(activity);
      setEditmode(false);
    }

    const handleDeleteActivity = (id: string) => {
      setActivities([...activities.filter(a=> a.id !== id)])
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
         deleteActivity={handleDeleteActivity} />
        </Container>
    </Fragment>
    );
}

export default App;
