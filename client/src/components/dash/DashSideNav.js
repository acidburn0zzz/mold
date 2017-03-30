import React, {Component} from 'react';
import {NavLink as Link} from 'react-router-dom';

export default class DashSideNav extends Component {
  onLogout = () => {
    localStorage.clear('token');
  }

  render() {
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
    };

    let sideBarNavItemStyle = {
      width: '100%',
      marginLeft: 0,
      borderRadius: 0
    };

    return(
      <div>
        <nav className="col-sm-3 col-md-2 hidden-xs-down bg-fadded" style={sideBarStyle}>
          <div className="justify-content-between">
            <ul className="nav nav-pills flex-sm-column">
              <li className="nav-item">
                <Link to="/dash/posts" style={sideBarNavItemStyle} className="nav-link">
                  <i className="fa fa-book fa-fw" aria-hidden="true"></i>&nbsp;Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dash/pages" style={sideBarNavItemStyle} className="nav-link">
                  <i className="fa fa-file-text-o fa-fw" aria-hidden="true"></i>&nbsp;Pages
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dash/profile" style={sideBarNavItemStyle} className="nav-link">
                  <i className="fa fa-user fa-fw" aria-hidden="true"></i>&nbsp;Profile & Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dash/settings" style={sideBarNavItemStyle} className="nav-link">
                  <i className="fa fa-cog fa-fw" aria-hidden="true"></i>&nbsp;Site Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dash/images" style={sideBarNavItemStyle} className="nav-link">
                  <i className="fa fa-file-image-o fa-fw"></i>&nbsp;Images
                </Link>
              </li>
            </ul>
            <ul className="nav nav-pills flex-column">
              <li className="nav-item">
                <Link to="#" style={sideBarNavItemStyle} className="nav-link" onClick={this.onLogout}>
                  <i className="fa fa-sign-out fa-fw"></i>&nbsp;Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
