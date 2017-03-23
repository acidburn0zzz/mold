import React, {Component} from 'react';
import axios from 'axios';
import Post from '../components/Post';

export default class PostContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      user: {}
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/v1/post/published/' + this.props.params.post_url).then((res) => {
        const post = res.data;
        const user = res.data.User;
        document.title = post.title;
        this.setState({ post: post, user: user });
      });
  }

  render() {
    return(
      <div className="col-md-6 offset-md-3">
        <div style={{ paddingTop: 65 }}>
          {/*{this.props.children, {user: this.state.post, post: this.state.post}}*/}
          <Post {...this.state} />
        </div>
      </div>
    );
  }
}
