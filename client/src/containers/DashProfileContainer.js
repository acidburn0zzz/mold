import React from 'react';
import axios from 'axios';
import Profile from '../components/Profile';

export default class DashProfileContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/v1/user').then((res) => {
      const user = res.data;
      this.setState({ user: user });
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
