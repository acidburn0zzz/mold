import React from 'react'
import hljs from 'highlight.js'
const markdown = require('markdown-it')({
  html: true,
  highlight: function (string, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(lang, string, true).value + '</code></pre>'
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + markdown.utils.escapeHtml(string) + '</code></pre>'
  }
})

markdown.use(require('markdown-it-attrs'))
let container = require('markdown-it-container')
markdown.use(container, 'col-md-8')
markdown.use(container, 'row')
markdown.use(container, 'col-md-4')

export default class PostPreview extends React.Component {
  render () {
    let innerHtml = {
      __html: markdown.render(`# ${this.props.title}\n----\n\n${this.props.content}`)
    }
    return (
      <div>
        <div dangerouslySetInnerHTML={innerHtml} />
      </div>
    )
  }
}
