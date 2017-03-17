import React from 'react';
import {Route} from 'react-router-dom';
import DashPostsView from './DashPostsView';
import PostCompose from './PostCompose';

export default class DashOpView extends React.Component {
  constructor() {
    super();
    this.state = {
      view: {}
    }
  }

  render() {
    return(
      <div className="col-sm-9 offset-sm-3 col-md-9 offset-med-3">
        <Route exact={true} path="/dash" component={DashPostsView}/>
        <Route exact={true} path="/dash/post/:path" component={({match}) => (<PostCompose params={match.params}/>)} />
      </div>
    );
  }
}
