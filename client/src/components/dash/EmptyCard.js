import React from 'react'
import {Link} from 'react-router-dom'

export default class EmptyCard extends React.Component {
  render () {
    return (
      <div className='card'>
        <div className='card-block'>
          <div className='card-text'>
            <h1>Looks like there's nothing here.</h1>
            <Link to={this.props.to}>
              <button className='btn btn-primary'>
              Get writing
            </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
