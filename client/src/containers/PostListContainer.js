import React, {Component} from 'react';
import axios from '../axios';
import PostBrief from '../components/PostBrief';

export default class PostListContainer extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    }
  }

  componentDidMount() {
    axios.get('/post/published').then((res) => {
      this.setState({ posts: res.data });
    });
  }

  render() {
    let style = { paddingTop: 65 };
    return(
      <div>
        <div style={style}>
          {this.state.posts.map(post => 
            <PostBrief key={post.id} style={style} post={post} user={post.User} />
          )}
        </div>
      </div>
    );
  }
}
