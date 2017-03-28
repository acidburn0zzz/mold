import React from 'react';
import axios from '../axios';
import Profile from '../components/dash/Profile';

export default class DashProfileContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    axios.get('/user').then((res) => {
      this.setState({ user: res.data });
    });
  }

  render() {
    return(
      <div>
        <Profile user={this.state.user} />
      </div>
    );
  }
}
