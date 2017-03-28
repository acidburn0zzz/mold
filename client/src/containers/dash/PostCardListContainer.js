import React from 'react';
import axios from '../../axios';
import PostCard from '../../components/dash/PostCard';

export default class PostCardListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    }
  }

  componentDidMount() {
    axios.get('/post/').then((res) => {
      this.setState({ posts: res.data });
    });
  }

  deletePost = (post) => {
    axios.delete('/post/' + post.path).then((res) => {
      let posts = this.state.posts.slice();
      posts.splice(posts.indexOf(post), 1);
      this.setState({ posts: posts });
    });
  }

  render() {
    let style = { paddingTop: 65 };
    return(
      <div style={style}>
        {this.state.posts.map(post => 
          <PostCard key={post.id} post={post} deletePost={this.deletePost} />
        )}
      </div>
    );
  }
}
