import React from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'

export default class PostTableRow extends React.Component {
  render () {
    const dateCreated = moment(this.props.post.createdAt)
    return (
      <tr>
        <td>{this.props.post.title}</td>
        <td>{this.props.user.name}</td>
        <td>{this.props.post.draft ? 'True' : 'False'}</td>
        <td data-toggle='tooltip' data-placement='top' title={dateCreated.format('MMMM Do YYYY, h:mm a')}>
          {dateCreated.format('MMM Do YY')}
        </td>
        <td>
          <Link to={`${this.props.post.url}`}>
            <button type='button' className='btn btn-outline-primary'>View</button>
          </Link>
        </td>
        <td>
          <Link to={`/dash/posts/${this.props.post.path}`}>
            <button type='button' className='btn btn-outline-primary'>Edit</button>
          </Link>
        </td>
      </tr>
    )
  }
}
