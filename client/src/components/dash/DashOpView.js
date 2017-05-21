import React from 'react'
import {Route} from 'react-router-dom'
import DashPostsView from './DashPostsView'
import DashPagesView from './DashPagesView'
import NewPostCompose from './NewPostCompose'
import DashPostComposePreview from './DashPostComposePreview'
import DashProfileContainer from '../../containers/DashProfileContainer'

export default class DashOpView extends React.Component {
  render () {
    return (
      <div>
        <div className='offset-2 col-8'>
          <Route exact path='/dash/posts' component={DashPostsView} />
          <Route exact path='/dash/pages' component={DashPagesView} />
          <Route exact path='/dash/profile' component={DashProfileContainer} />
        </div>
        <Route exact path='/dash/post/new' component={NewPostCompose} />
        <Route exact path='/dash/posts/:path' component={({match}) => (<DashPostComposePreview params={match.params} />)} />
      </div>
    )
  }
}
