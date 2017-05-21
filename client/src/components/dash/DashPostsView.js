import React from 'react'
import PostCardListContainer from '../../containers/dash/PostCardListContainer'

export default class DashPostsView extends React.Component {
  render () {
    document.title = 'Dashboard | Posts'
    return (
      <div>
        <PostCardListContainer />
      </div>
    )
  }
}
