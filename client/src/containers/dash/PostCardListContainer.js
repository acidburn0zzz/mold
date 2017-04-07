import React from 'react';
import axios from '../../axios';
import PostCard from '../../components/dash/PostCard';

export default class PostCardListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1
    }
  }

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  }

  prevPage = () => {
    if (this.state.page !== 1) {
      this.setState({ page: this.state.page - 1 });
    }
  }

  componentDidMount() {
    axios.get(`/post?page=${this.state.page}`).then((res) => {
      this.setState({ posts: res.data.rows });
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
    return(
      <div>
        {this.state.posts.map(post => 
          <PostCard key={post.id} post={post} deletePost={this.deletePost} />
        )}
      </div>
    );
  }
}
