import React from 'react';
import {Link} from 'react-router-dom';

export default class PostTableRow extends React.Component {
  render() {
    return(
      <tr>
        <td>{this.props.post.title}</td>
        <td>{this.props.user.name}</td>
        <td>{this.props.post.draft ? "True" : "False"}</td>
        <td>
          <Link to={`${this.props.post.url}`}>
            <button type="button" className="btn btn-outline-primary">View</button>
          </Link>
        </td>
        <td>
          <Link to="">
            <button type="button" className="btn btn-outline-primary">Edit</button>
          </Link>
        </td>
      </tr>
    );
  }
}
