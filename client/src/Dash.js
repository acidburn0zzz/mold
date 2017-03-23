import React, {Component} from 'react';
import DashSideNav from './components/DashSideNav';
import DashOpView from './components/DashOpView';
import DashNavbar from './components/DashNavbar';

class Dash extends Component {
  render() {
    return(
      <div>
        <DashNavbar />
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
