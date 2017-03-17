import React, {Component} from 'react';
import axios from 'axios';
import PostTableRow from '../components/PostTableRow';

export default class DashPostTableContainer extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/post/').then((res) => {
        const posts = res.data;
        this.setState({ posts: posts });
      });
  }

  render() {
    let style = { paddingTop: 55 };
    return(
      <div>
        <div style={style}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Draft</th>
                <th>View</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts.map(post => 
                <PostTableRow key={post.id} style={style} post={post} user={post.User} />
              )}
            </tbody>
          </table>
    </div>
      </div>
    );
  }
}
