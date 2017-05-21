import React from 'react'
import {Link} from 'react-router-dom'
import PostCardModal from './PostCardModal'
import moment from 'moment'

export default class PostCard extends React.Component {
  renderStatusBadge = () => {
    return (
      this.props.post.draft
      ? <span className='badge badge-info' data-toggle='tooltip' title='This post has not yet been published'>Draft</span>
      : <span className='badge badge-default' data-toggle='tooltip' title='This post is published and publicly viewable'>Published</span>
    )
  }

  renderTimeUpdated = (created, updated) => {
    if (updated.isAfter(created)) {
      return (
        <p className='card-text text-muted'>
          <small data-toggle='tooltip' title={`Created ${created.format('MMMM Do YYYY, h:mm a')}`}>
            <i className='fa fa-clock-o' />&nbsp;Created {created.fromNow()},&nbsp;
          </small>
          <small data-toggle='tooltip' title={`Updated ${updated.format('MMMM Do YYYY, h:mm a')}`}>
            last updated {updated.fromNow()}&nbsp;
          </small>
          {this.renderStatusBadge()}
        </p>
      )
    } else {
      return (
        <p className='card-text text-muted'>
          <small data-toggle='tooltip' title={`Created ${created.format('MMMM Do YYYY, h:mm a')}`}>
            <i className='fa fa-clock-o' />&nbsp;Created {created.fromNow()}&nbsp;
          </small>
          {this.renderStatusBadge()}
        </p>
      )
    }
  }

  render () {
    let renderedExcerpt = { __html: this.props.post.excerpt }
    return (
      <div>
        <PostCardModal post={this.props.post} deletePost={this.props.deletePost} />
        <div className='card mb-3'>
          <div className='card-block'>
            <h2 className='card-title'>{this.props.post.title} &nbsp;</h2>
            <hr />
            <div className='card-text' dangerouslySetInnerHTML={renderedExcerpt} />
            {this.renderTimeUpdated(moment(this.props.post.createdAt), moment(this.props.post.updatedAt))}
            <div className='btn-toolbar justify-content-between'>
              <div className='btn-group'>
                <Link to={`/dash/posts/${this.props.post.path}`}>
                  <button type='button' className='btn btn-outline-primary'>
                    <i className='fa fa-pencil' aria-hidden='true' />&nbsp;Edit
                  </button>
                </Link>&nbsp;
                <Link to={`/p/${this.props.post.path}`}>
                  <button type='button' className='btn btn-outline-success'>
                    <i className='fa fa-eye' aria-hidden='true' />&nbsp;View
                  </button>
                </Link>
              </div>
              <div className='btn-group'>
                <button type='button' className='btn btn-outline-danger' data-toggle='modal' data-target={`#postModal-${this.props.post.path}`}>
                  <i className='fa fa-trash' aria-hidden='true' />&nbsp;Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
