import React,{Component} from 'react';
import logo from './logo.svg';
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {this.state.values.map((values: any) => (
          <li key={values.id}>{values.name}</li>
        ))}
      </header>
    </div>
    )
  }
}

export default App;
