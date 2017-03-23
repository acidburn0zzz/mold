import React from 'react';
import {Route} from 'react-router-dom';
import DashPostsView from './DashPostsView';
import PostCompose from './PostCompose';
import DashPostComposePreview from './DashPostComposePreview';
import DashProfileContainer from '../containers/DashProfileContainer';

export default class DashOpView extends React.Component {
  constructor() {
    super();
    this.state = {
      view: {}
    }
  }

  render() {
    return(
      <div className="col-sm-6 offset-sm-3 col-md-6 offset-med-3">
        <Route exact={true} path="/dash/posts" component={DashPostsView}/>
        <Route exact={true} path="/dash/posts/:path" component={({match}) => (<DashPostComposePreview params={match.params}/>)} />
        <Route exact={true} path="/dash/profile" component={DashProfileContainer} />
      </div>
    );
  }
}
