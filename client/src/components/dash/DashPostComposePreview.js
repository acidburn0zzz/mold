import React from 'react'
import moment from 'moment'
import axios from '../../axios'
import PostCompose from './PostCompose'
import PostPreview from './PostPreview'

export default class DashPostComposePreview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      draft: false,
      path: '',
      createdAtDate: {},
      createdAtTime: {},
      postChangeSuccessful: false,
      titleConflict: false
    }
  }

  componentDidMount () {
    axios.get('/post/' + this.props.params.path).then((res) => {
      document.title = res.data.title
      this.setState({
        title: res.data.title,
        content: res.data.content,
        draft: res.data.draft,
        path: res.data.path,
        createdAtDate: moment(res.data.createdAt).format('YYYY-MM-DD'),
        createdAtTime: moment(res.data.createdAt).format('HH:mm')
      })
    })
  }

  submitPostChanges = () => {
    axios.put('/post/' + this.state.path, {
      title: this.state.title,
      content: this.state.content,
      draft: this.state.draft,
      createdAt: moment(`${this.state.createdAtDate} ${this.state.createdAtTime}`, 'YYYY-MM-DD HH:mm')
    }).then((res) => {
      this.setState({ postChangeSuccessful: true })
    }).catch(() => {
      this.setState({ titleConflict: true })
    })
  }

  renderPostSubmitStatus = () => {
    if (this.state.postChangeSuccessful) {
      return (
        <div className='alert alert-success alert-dismissible fade show' role='alert'>
          <button type='button' className='close' data-dismiss='alert' aria-label='Close' onClick={() => { this.setState({ postChangeSuccessful: false }) }}>
            <span aria-hidden='true'>&times;</span>
          </button>
          Post Saved
        </div>
      )
    } else if (this.state.titleConflict) {
      return (
        <div className='alert alert-danger alert-dismissible fade show' role='alert'>
          <button type='button' className='close' data-dismiss='alert' aria-label='Close' onClick={() => { this.setState({ titleConflict: false }) }}>
            <span aria-hidden='true'>&times;</span>
          </button>
          Post does not have a unique title.
        </div>
      )
    }
  }

  handleInputChange = (event) => {
    event.target.type === 'checkbox'
      ? this.setState({ [event.target.name]: event.target.checked })
      : this.setState({ [event.target.name]: event.target.value })
  }

  handleContentChange = (content) => {
    this.setState({ content: content })
  }

  render () {
    let previewStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      overflowY: 'scroll',
      height: '100%',
      width: '50%'
    }

    return (
      <div>
        <div className='col-6'>
          <PostCompose
            title={this.state.title}
            content={this.state.content}
            draft={this.state.draft}
            handleInputChange={this.handleInputChange}
            handleContentChange={this.handleContentChange}
            submitPostChanges={this.submitPostChanges} />
        </div>
        <div className='col-6' style={previewStyle}>
          <PostPreview
            title={this.state.title}
            content={this.state.content} />
        </div>
      </div>
    )
  }
}
