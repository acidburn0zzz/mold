import React, {Component} from 'react';
import axios from '../axios';
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
    axios.get('/post/published/' + this.props.params.post_url).then((res) => {
        document.title = res.data.title;
        this.setState({ post: res.data, user: res.data.User });
      });
  }

  render() {
    return(
      <div className="col-md-6 offset-md-3">
        <div style={{ paddingTop: 65 }}>
          <Post {...this.state} />
        </div>
      </div>
    );
  }
}
