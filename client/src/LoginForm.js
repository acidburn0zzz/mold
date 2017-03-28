import React, {Component} from 'react';
import axios from './axios';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      remember_me: false,
      loginAlertShown: false,
    }
  }

  handleInputChange = (event) => {
    event.target.type === "checkbox" ?
      this.setState({ [event.target.name]: event.target.checked }) :
      this.setState({ [event.target.name]: event.target.value });
  }

  handleAuth = () => {
    axios.post('/auth', {
      username: this.state.username,
      password: this.state.password,
      remember_me: this.state.remember_me
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      window.location.href = "/dash";
    }).catch((err) => {
      this.setState({ loginAlertShown: true });
    });
  }

  checkLoginStatus = () => {
    if (this.state.loginAlertShown === true) {
      return(
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.setState({ loginAlertShown: false })}} >
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>Uh Oh!</strong> Login failed
        </div>
      );
    }
  }

  render() {
    document.title = "Login";
    return(
      <div className="container-fluid" style={{ paddingTop: 65 }}>
        <div className="col-md-6 offset-md-3">
          {this.checkLoginStatus()}
          <div className="card">
            <h3 className="card-header">
              Login
            </h3>
            <div className="card-block">
              <form>
                <div className="form-group">
                  <input type="text" name="username" className="form-control" value={this.state.username} placeholder="Username" onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                  <input type="password" name="password" className="form-control" value={this.state.password} placeholder="Password" onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        name="remember_me"
                        type="checkbox"
                        className="form-check-input"
                        value=""
                        onChange={this.handleInputChange} /> Remember Me
                    </label>
                  </div>
                </div>
              </form>
              <button onClick={() => this.handleAuth()} className="btn btn-primary"><i className="fa fa-sign-in" aria-hidden="true"></i>&nbsp;Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
