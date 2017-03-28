import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

export default class PostCard extends React.Component {
  renderStatusBadge = () => { 
    return(
      this.props.post.draft ?
      <span className="badge badge-info">Draft</span> :
      <span className="badge badge-default">Published</span>
    );
  }

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
          {this.renderStatusBadge()}
        </p>
      );
    } else {
      return (
        <p className="card-text text-muted">
          <small data-toggle="tooltip" title={`Created ${created.format("MMMM Do YYYY, h:mm a")}`}>
            Created {created.fromNow()}&nbsp;
          </small>
          {this.renderStatusBadge()}
        </p>
      );
    }
  }

  render() {
    let renderedExcerpt = { __html: this.props.post.excerpt }
    return(
      <div className="card mb-3">
        <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you would like to delete '{this.props.post.title}'? This cannot be undone
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {this.props.deletePost(this.props.post)}}>Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-block">
          <div className="card-title">
            <h4 className="card-title">{this.props.post.title} &nbsp;
              <small>
              </small>
            </h4>
          </div>
          <div className="card-text" dangerouslySetInnerHTML={renderedExcerpt} />
          {this.renderTimeUpdated(moment(this.props.post.createdAt), moment(this.props.post.updatedAt))}
          <Link to={`/dash/posts/${this.props.post.path}`}>
            <button type="button" className="btn btn-outline-primary">
              <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</button>&nbsp;
          </Link>
          <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#myModal">
            <i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete
          </button>
        </div>
      </div>
    );
  }
}
