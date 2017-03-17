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
    this.handleAuth = this.handleAuth.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleAuth() {
    axios.post('http://localhost:3001/api/auth', {
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      if (res.status === 200) {
        console.log("You logged in ok but still got fucking redirected");
      }
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
              <input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.handleUsernameChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" className="form-control" value={this.state.password} placeholder="Password" onChange={this.handlePasswordChange} />
            </div>
            <button onClick={this.handleAuth} className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
