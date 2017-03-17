import React, {Component} from 'react';
import DashSideNav from './components/DashSideNav';
import DashPostsView from './components/DashPostsView';
import NavbarContainer from './containers/NavbarContainer';

class Dash extends Component {
  render() {
    return(
      <div>
        <NavbarContainer />
        <div className="container-fluid">
          <div className="row">
            <DashSideNav />
            <div className="col-sm-9 offset-sm-3 col-md-9 offset-med-3">
              <DashPostsView />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dash;
