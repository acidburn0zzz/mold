import React from 'react'
import PostCompose from '../../components/dash/PostCompose'
import PostPreview from '../../components/dash/PostPreview'
import moment from 'moment'
import axios from '../../axios'

export default class NewPostContainer extends React.Component {
  constructor () {
    super()
    this.state = {
      title: 'New Post',
      content: 'Start writing to see a live preview of your content',
      draft: true,
      path: '',
      createdAtDate: moment().format('YYYY-MM-DD'),
      createdAtTime: moment().format('HH:mm'),
      postSubmitSuccessful: false
    }
  }

  submitPostChanges = () => {
    axios.post('/post/', {
      title: this.state.title,
      content: this.state.content,
      draft: this.state.draft,
      createdAt: moment(`${this.state.createdAtDate} ${this.state.createdAtTime}`, 'YYYY-MM-DD HH:mm')
    }).then((res) => {
      this.setState({ postSubmitSuccessful: true })
    }).catch(() => {

    })
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
