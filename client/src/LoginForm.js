import React, {Component} from 'react';
import axios from './axios';

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
  }

  handleAuth = () => {
    axios.post('/auth', {
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
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
