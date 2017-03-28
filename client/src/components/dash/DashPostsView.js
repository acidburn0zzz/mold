import React from 'react';
import PostCardListContainer from '../../containers/dash/PostCardListContainer';
import DashPostTableContainer from '../../containers/DashPostTableContainer'

export default class DashPostsView extends React.Component {
  render() {
    return(
      <div>
        <PostCardListContainer />
      </div>
    );
  }
}
