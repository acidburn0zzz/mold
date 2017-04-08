import React from 'react';
import axios from '../../axios';
import PostCard from '../../components/dash/PostCard';
import EmptyCard from '../../components/dash/EmptyCard';

export default class PostCardListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      total_pages: 0,
      current_page: 1
    }
  }

  setPage = (page) => {
    this.setState({ current_page: page }, this.updatePostList);
  }

  updatePostList = () => {
    axios.get(`/post?page=${this.state.current_page}`).then((res) => {
      this.setState({ posts: res.data.rows });
    });
  }

  componentDidMount() {
    axios.get(`/post?page=${this.state.current_page}`).then((res) => {
      this.setState({ total_pages: res.data.total_pages });
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

  renderPagination = () => {
    let pagination = [];
    for (let i = 0; i < this.state.total_pages; i++) {
      pagination.push(
        <li key={i} className="page-item">
          <a className="page-link" onClick={() => {this.setPage(i + 1)}}>{i + 1}</a>
        </li>
      );
    }
    return(
      <nav className="offset-2 col-8" aria-label="Pages">
        <ul className="pagination justify-content-center">
          {pagination}
        </ul>
      </nav>
    );
  }

  render() {
    return(
      <div>
        <div>
          {this.state.posts.length === 0 ?
              <EmptyCard to={"/dash/post/new"} />:
              this.state.posts.map(post => 
                <PostCard key={post.id} post={post} deletePost={this.deletePost} />
              )}
            </div>
            {this.renderPagination()}
          </div>
    );
  }
}
