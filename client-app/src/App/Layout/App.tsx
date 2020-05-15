import React,{useState, useEffect, Fragment} from 'react';
import {Header, Icon, List, Container} from 'semantic-ui-react';
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
        setActivities(response.data)
      });
    }, []);

    const handleSelectActivity = (id: string) => {
      setSelectedActivity(activities.filter( a => a.id === id)[0])
    }

    const handleOpenCreateForm = () => {
      setSelectedActivity(null);
      setEditmode(true);
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
         setSelectedActivity={setSelectedActivity} />
        </Container>
    </Fragment>
    );
}

export default App;
