import React, {Component} from 'react'
import axios from '../axios'
import {Link} from 'react-router-dom'
import PostTableRow from '../components/PostTableRow'

export default class DashPostTableContainer extends Component {
  constructor () {
    super()
    this.state = {
      posts: []
    }
  }

  componentDidMount () {
    axios.get('/post/').then((res) => {
      const posts = res.data
      this.setState({ posts: posts })
    })
  }

  render () {
    let style = { paddingTop: 65 }
    return (
      <div style={style}>
        {this.state.posts.map(post =>
          <div key={post.id} className='card mb-3'>
            <div className='card-block'>
              <h4 className='card-title'>{post.title}</h4>
              <p className='card-text'>{post.excerpt}</p>
              <Link to={`/dash/posts/${post.path}`}>
                <button type='button' className='btn btn-outline-primary'>Edit</button>
              </Link>
            </div>
          </div>
        )}
        <div style={style}>
          <table className='table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Draft</th>
                <th>Date Created</th>
                <th>View</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts.map(post =>
                <PostTableRow key={post.id} post={post} user={post.User} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
