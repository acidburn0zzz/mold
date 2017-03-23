import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    console.log(`NAME : VALUE ::: ${event.target.name}: ${event.target.value}`);
  }

  printValue = () => {
    console.log(this.state.username);
    console.log(this.state.password);
  }

  handleAuth = () => {
    axios.post('http://localhost:3001/api/v1/auth', {
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      if (res.status === 200) {
        window.location.href = "/dash";
      }
    }).catch((err) => {

    });
  }

  render() {
    document.title = "Login";
    return(
      <div className="container-fluid" style={{ paddingTop: 65 }}>
        <div className="col-md-6 offset-md-3">
          <form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" className="form-control" value={this.state.password} placeholder="Password" onChange={this.handleInputChange} />
            </div>
          </form>
          <button onClick={() => this.handleAuth()} className="btn btn-primary">Save</button>
        </div>
      </div>
    );
  }
}

export default LoginForm;
