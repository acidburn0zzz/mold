import React from 'react'

export default class PostCardModal extends React.Component {
  render () {
    return (
      <div className='modal fade' id={`postModal-${this.props.post.path}`} tabIndex='-1' role='dialog' aria-labelledby='modalLabel' aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='modalLabel'>Confirmation</h5>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              Are you sure you would like to delete '{this.props.post.title}'? This cannot be undone
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-dismiss='modal'>Cancel</button>
              <button type='button' className='btn btn-primary' data-dismiss='modal' onClick={() => { this.props.deletePost(this.props.post) }}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
