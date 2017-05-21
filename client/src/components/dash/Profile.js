import React from 'react'

export default class Profile extends React.Component {
  render () {
    return (
      <div>
        <h1>Update Profile</h1>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input className='form-control' name='name' type='text' value={this.props.name} onChange={this.props.handleInputChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Username</label>
          <input className='form-control' name='username' type='text' value={this.props.username} onChange={this.props.handleInputChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Email</label>
          <input className='form-control' name='email' type='email' value={this.props.email} onChange={this.props.handleInputChange} />
        </div>
        <button className='btn btn-primary' onClick={() => { this.props.submitProfileChanges() }}>Submit</button>
        <hr />
        <h1>Change Password</h1>
        <div className='form-group'>
          <label htmlFor='name'>Current Password</label>
          <input className='form-control' name='password' type='password' value={this.props.password} onChange={this.props.handleInputChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>New Password</label>
          <input className='form-control' name='newPassword' type='password' value={this.props.newPassword} onChange={this.props.handleInputChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Confirm New Password</label>
          <input className='form-control' name='confirmNewPassword' type='password' value={this.props.confirmNewPassword} onChange={this.props.handleInputChange} />
        </div>
        <button className='btn btn-primary' onClick={() => { this.props.submitProfileChanges() }}>Updated Password</button>
      </div>
    )
  }
}
