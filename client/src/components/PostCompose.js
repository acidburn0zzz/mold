import React from 'react';
import axios from 'axios';

export default class PostCompose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      user: {}
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/post/' + this.props.params.path).then((res) => {
        const post = res.data;
        const user = res.data.User;
        document.title = post.title;
        this.setState({ post: post, user: user });
      });
  }

  render() {
    return(
      <div style={{ paddingTop: 65}}>
        <form>
          <div className="form-group">
            <input className="form-control" type="text" value={this.state.post.title}/>
          </div>
          <div className="form-group">
            <input className="form-control" type="text" value={this.state.post.title}/>
          </div>
        </form>
      </div>
    );
  }
}
