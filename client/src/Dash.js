import React, {Component} from 'react';
import DashSideNav from './components/DashSideNav';
import DashPostsView from './components/DashPostsView';
import NavbarContainer from './containers/NavbarContainer';
import {
  Route,
} from 'react-router-dom';
import PostCompose from './components/PostCompose';
import DashOpView from './components/DashOpView';

class Dash extends Component {
  render() {
    return(
      <div>
        <NavbarContainer />
        <div className="container-fluid">
          <div className="row">
            <DashSideNav />
            <DashOpView />
              {/*<Route exact={true} path="/dash" component={DashPostsView}/>*/}
              {/*<Route path="/dash/post/edit" component={({match}) => (<PostCompose params={match.params}/>)} />*/}
          </div>
        </div>
      </div>
    );
  }
}

export default Dash;
