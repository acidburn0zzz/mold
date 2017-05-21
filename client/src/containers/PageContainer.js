import React, {Component} from 'react'
import axios from '../axios'

export default class PageContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: {}
    }
  }

  componentDidMount () {
    axios.get('/page/published/' + this.props.params.page_url).then((res) => {
      const page = res.data
      this.setState({ page: page })
    })
  }

  render () {
    document.title = this.state.page.title
    let renderedContent = { __html: this.state.page.rendered }
    return (
      <div>
        <div className='container-fluid' style={{ paddingTop: 65 }}>
          <div className='row'>
            <div className='col-md-9 offset-md-3'>
              <h1>{this.state.page.title}</h1>
              <div dangerouslySetInnerHTML={renderedContent} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
