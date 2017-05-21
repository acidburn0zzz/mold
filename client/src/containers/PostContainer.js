import React, {Component} from 'react'
import axios from '../axios'
import Post from '../components/Post'

export default class PostContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      postStatus: {},
      post: {},
      user: {}
    }
  }

  componentDidMount () {
    axios.get('/post/published/' + this.props.params.post_url).then((res) => {
      document.title = res.data.title
      this.setState({ post: res.data, user: res.data.User })
    }).catch(() => {
      document.title = 'Not Found'
      this.setState({ postStatus: 404 })
    })
  }

  render () {
    return (
      <div className='col-md-6 offset-md-3'>
        <div style={{ paddingTop: 65 }}>
          {
            this.state.postStatus === 404
            ? <h1>404: Not Found</h1>
            : <Post {...this.state} />
          }
        </div>
      </div>
    )
  }
}
