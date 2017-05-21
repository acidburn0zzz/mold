import React, {Component} from 'react'
import axios from '../axios'
import PostBrief from '../components/PostBrief'

export default class PostListContainer extends Component {
  constructor () {
    super()
    this.state = {
      posts: []
    }
  }

  componentDidMount () {
    axios.get('/post/published').then((res) => {
      this.setState({ posts: res.data.rows })
    })
  }

  render () {
    let style = { paddingTop: 65 }
    return (
      <div>
        <div style={style}>
          {this.state.posts.map(post =>
            <div key={post.id}>
              <PostBrief post={post} user={post.User} />
              <hr />
            </div>
          )}
        </div>
      </div>
    )
  }
}
