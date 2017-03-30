import React from 'react';
import axios from '../axios';
import Profile from '../components/dash/Profile';

export default class DashProfileContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      username: '',
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      email: '',
      submitionStatus: false,
    }
  }

  validateInput = () => {
  }

  submitProfileChanges = () => {
    axios.put('/user', {
      username: this.state.username,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      newPassword: this.state.newPassword
    }).then((res) => {
      this.setState({ submitionStatus: true });
    });
  }

  renderSubmitStatus = () => {
    return(
      this.state.submitionStatus ?
      <div className="alert alert-success alert-dismissible fade show" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => { this.setState({ submitionStatus: false })}}>
          <span aria-hidden="true">&times;</span>
        </button>
        Profile successfully changed.
      </div> : null
    );
  }

  componentDidMount() {
    axios.get('/user').then((res) => {
      this.setState({
        name: res.data.name,
        username: res.data.username,
        email: res.data.email,
      });
    });
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }


  render() {
    return(
      <div style={{ paddingTop: 65 }}>
        {this.renderSubmitStatus()}
        <Profile
          {...this.state} handleInputChange={this.handleInputChange} submitProfileChanges={this.submitProfileChanges} />
      </div>
    );
  }
}
