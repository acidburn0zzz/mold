import React, {Component} from 'react';

export default class Post extends Component {
  render() {
    let renderedContent = { __html: this.props.post.rendered }
    return(
      <div>
        <h1>{this.props.post.title}</h1>
        <p>{`By: ${this.props.user.name}`}</p>
        <div dangerouslySetInnerHTML={renderedContent} />
      </div>
    );
  }
}
