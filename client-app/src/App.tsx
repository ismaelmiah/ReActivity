import React,{Component} from 'react';
import {Header, Icon, List} from 'semantic-ui-react';
import './App.css';
import axios from 'axios';

class App extends Component {

  state = {
    values: []
  }

  componentDidMount(){
    axios.get('http://localhost:5000/values').then((response) => {
      console.log(response);
      this.setState({
        values: response.data
      })
    })
  }

  render(){
    return(
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivities</Header.Content>
          <List>
              {this.state.values.map((values: any) => (
              <List.Item key={values.id}>{values.name}</List.Item>
            ))}
          </List>
        </Header>
    </div>
    )
  }
}

export default App;
