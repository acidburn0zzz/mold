import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class DashNavbar extends Component {
  render () {
    return (
      <div>
        <nav className='navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse'>
          <button className='navbar-toggler navbar-toggler-right' type='button' data-toggle='collapse' data-target='#navbarCollapse' aria-controls='navbarCollapse' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <Link to='/dash' className='navbar-brand'>Dashboard</Link>
        </nav>
      </div>
    )
  }
}

export default DashNavbar
