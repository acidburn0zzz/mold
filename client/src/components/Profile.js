import React from 'react';

export default class Profile extends React.Component {
  render() {
    return(
      <div style={{ paddingTop: 65 }}>
        <h1>{this.props.user.name}</h1>
        <h1>{this.props.user.email}</h1>
      </div>
    );
  }
}
