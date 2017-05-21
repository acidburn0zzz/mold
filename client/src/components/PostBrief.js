import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'

export default class Post extends Component {
  render () {
    let excerpt = { __html: this.props.post.excerpt }
    return (
      <div>
        <h1>{this.props.post.title}</h1>
        <p className='text-muted'>{moment(this.props.post.createdAt).format('MMMM Do YYYY')}</p>
        <div dangerouslySetInnerHTML={excerpt} />
        <Link to={`${this.props.post.url}`}>
          <button className='btn btn-info'>Continue Reading...</button>
        </Link>
      </div>
    )
  }
}
