import React from 'react';
import PostCardModal from './PostCardModal';
import moment from 'moment';
import {Link} from 'react-router-dom';

export default class PageCard extends React.Component {
  renderStatusBadge = () => { 
    return(
      this.props.page.draft ?
      <span className="badge badge-info" data-toggle="tooltip" title="This post has not yet been published">Draft</span> :
      <span className="badge badge-default" data-toggle="tooltip" title="This post is published and publicly viewable">Published</span>
    );
  }

  renderTimeUpdated = (created, updated) => {
    if (updated.isAfter(created)) {
      return (
        <p className="card-text text-muted">
          <small data-toggle="tooltip" title={`Created ${created.format("MMMM Do YYYY, h:mm a")}`}>
            <i className="fa fa-clock-o"></i>&nbsp;Created {created.fromNow()},&nbsp;
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
            <i className="fa fa-clock-o"></i>&nbsp;Created {created.fromNow()}&nbsp;
          </small>
          {this.renderStatusBadge()}
        </p>
      );
    }
  }

  render() {
    let renderedContent = { __html: this.props.page.rendered }
    return(
      <div>
        <PostCardModal post={this.props.page} deletePost={this.props.deletePage} />
        <div className="card">
          <div className="card-block">
            <h2 className="card-title">{this.props.page.title}</h2>
            {this.renderTimeUpdated(moment(this.props.page.createdAt), moment(this.props.page.updatedAt))}
            <div className="card-text" dangerouslySetInnerHTML={renderedContent} />
            <div className="btn-toolbar justify-content-between">
              <div className="btn-group">
                <Link to={`/dash/pages/${this.props.page.path}`}>
                  <button type="button" className="btn btn-outline-primary">
                    <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit
                  </button>
                </Link>&nbsp;
                <Link to={`/s/${this.props.page.path}`}>
                  <button type="button" className="btn btn-outline-success">
                    <i className="fa fa-eye" aria-hidden="true"></i>&nbsp;View
                  </button>
                </Link>
              </div>
              <div className="btn-group">
                <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target={`#postModal-${this.props.page.path}`}>
                  <i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
