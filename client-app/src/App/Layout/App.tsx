import React,{useState, useEffect} from 'react';
import {Header, Icon, List} from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../Models/Activity';
import { NavBar } from '../../Features/Nav/NavBar';

  const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    useEffect(() => {
      axios.get<IActivity[]>('http://localhost:5000/activities').then((response) => {
        console.log(response);
        setActivities(response.data)
      });
    }, []);

    return(
      <div>
        <NavBar />
        <List>
              {activities.map((activity) => (
              <List.Item key={activity.id}>{activity.title}</List.Item>
            ))}
          </List>
    </div>
    );
}

export default App;