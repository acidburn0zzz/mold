import React from 'react'
import markdown from 'markdown-it'

export default class PostPreview extends React.Component {
  render () {
    let mark = markdown()
    let markup = { __html: mark.render(this.props.content) }
    return (
      <div>
        <div dangerouslySetInnerHTML={markup} />
      </div>
    )
  }
}
