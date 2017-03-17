import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Post extends Component {
  render() {
    let excerpt = { __html: this.props.post.excerpt }
    return(
      <div>
        <Link to={`${this.props.post.url}`}>
          <h1>{this.props.post.title}</h1>
        </Link>
        <p>{`By: ${this.props.user.name}`}</p>
        <div dangerouslySetInnerHTML={excerpt} />
      </div>
    );
  }
}
