import React from 'react';
import axios from '../../axios';
import {Link} from 'react-router-dom';
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

  render() {
    let style = { paddingTop: 65 };
    return(
      <div style={style}>
        {this.state.posts.map(post => 
          <PostCard key={post.id} post={post} />
        )}
      </div>
    );
  }
}
