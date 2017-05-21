import React, {Component} from 'react'
import {NavLink as Link} from 'react-router-dom'

export default class DashSideNav extends Component {
  onLogout = () => {
    window.localStorage.clear('token')
    window.location.href = '/'
  }

  render () {
    let sideBarStyle = {
      position: 'fixed',
      top: '51px',
      bottom: 0,
      left: 0,
      zIndex: 1000,
      padding: '20px',
      overflowX: 'hidden',
      overflowY: 'auto',
      borderRight: '1px solid #eee',
      paddingLeft: 0,
      paddingRight: 0
    }

    let sideBarNavItemStyle = {
      width: '100%',
      marginLeft: 0,
      borderRadius: 0
    }

    return (
      <div>
        <nav className='col-sm-3 col-md-2 hidden-xs-down bg-fadded' style={sideBarStyle}>
          <div className='justify-content-between'>
            <ul className='nav nav-pills flex-sm-column'>
              <li className='nav-item dropdown'>
                <Link to='/dash/posts' style={sideBarNavItemStyle} className='nav-link dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false' aria-haspopup='true'>
                  <i className='fa fa-book fa-fw' aria-hidden='true' />&nbsp;Posts
                </Link>
                <div className='dropdown-menu'>
                  <Link exact to='/dash/posts' className='dropdown-item'>
                    View All
                  </Link>
                  <Link exact to='/dash/post/new' className='dropdown-item'>
                    New
                  </Link>
                </div>
              </li>
              <li className='nav-item dropdown'>
                <Link to='/dash/pages' style={sideBarNavItemStyle} className='nav-link dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false' aria-haspopup='true'>
                  <i className='fa fa-file-text-o fa-fw' aria-hidden='true' />&nbsp;Pages
                </Link>
                <div className='dropdown-menu'>
                  <Link exact to='/dash/pages' className='dropdown-item'>
                    View All
                  </Link>
                  <Link exact to='/dash/page/new' className='dropdown-item'>
                    New
                  </Link>
                </div>
              </li>
              <li className='nav-item'>
                <Link to='/dash/profile' style={sideBarNavItemStyle} className='nav-link'>
                  <i className='fa fa-user fa-fw' aria-hidden='true' />&nbsp;Profile & Settings
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/dash/settings' style={sideBarNavItemStyle} className='nav-link'>
                  <i className='fa fa-cog fa-fw' aria-hidden='true' />&nbsp;Site Settings
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/dash/images' style={sideBarNavItemStyle} className='nav-link'>
                  <i className='fa fa-file-image-o fa-fw' />&nbsp;Images
                </Link>
              </li>
            </ul>
            <ul className='nav nav-pills flex-column'>
              <li className='nav-item'>
                <Link to='#' style={sideBarNavItemStyle} className='nav-link' onClick={this.onLogout}>
                  <i className='fa fa-sign-out fa-fw' />&nbsp;Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}
