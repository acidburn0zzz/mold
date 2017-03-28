import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

export default class PostCard extends React.Component {
  renderTimeUpdated = (created, updated) => {
    if (updated.isAfter(created)) {
      return (
        <p className="card-text text-muted">
          <small data-toggle="tooltip" title={`Created ${created.format("MMMM Do YYYY, h:mm a")}`}>
            Created {created.fromNow()}, &nbsp;
          </small>
          <small data-toggle="tooltip" title={`Updated ${updated.format("MMMM Do YYYY, h:mm a")}`}>
            last updated {updated.fromNow()}&nbsp;
          </small>
          <span className="badge badge-info">{this.props.post.draft ? "Draft" : "Published" }</span>
        </p>
      );
    } else {
      return (
        <p className="card-text text-muted">
          <small data-toggle="tooltip" title={`Created ${created.format("MMMM Do YYYY, h:mm a")}`}>
            Created {created.fromNow()}&nbsp;
          </small>
          <span className="badge badge-info">{this.props.post.draft ? "Draft" : "Published" }</span>
        </p>
      );
    }
  }

  render() {
    let createdAt = moment(this.props.post.createdAt);
    let updatedAt = moment(this.props.post.updatedAt);
    let renderedExcerpt = { __html: this.props.post.excerpt }
    return(
      <div className="card mb-3">
        <div className="card-block">
          <div className="card-title">
            <h4 className="card-title">{this.props.post.title} &nbsp;
              <small>
              </small>
            </h4>
          </div>
          <div className="card-text" dangerouslySetInnerHTML={renderedExcerpt} />
          {this.renderTimeUpdated(createdAt, updatedAt)}
          <Link to={`/dash/posts/${this.props.post.path}`}>
            <button type="button" className="btn btn-outline-primary">
              <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>&nbsp;
          </Link>
          <button type="button" className="btn btn-outline-danger">
            Delete
          </button>
        </div>
      </div>
    );
  }
}
