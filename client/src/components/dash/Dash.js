import React, {Component} from 'react';
import DashSideNav from './DashSideNav';
import DashOpView from './DashOpView';
import DashNavbar from './DashNavbar';

class Dash extends Component {
  handleNonAuthorized = () => {
    if (localStorage.getItem('token') !== null) {
      return(
        <div>
          <DashNavbar />
          <div className="container-fluid">
            <div className="row">
              <div className="col-2">
                <DashSideNav />
              </div>
              <div className="col-10">
                <DashOpView />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      window.location.href = "/"; 
    }
  }

  render() {
    return(this.handleNonAuthorized());
  }
}

export default Dash;
