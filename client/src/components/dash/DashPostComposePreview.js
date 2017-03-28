import React from 'react';
import axios from '../../axios';
import PostCompose from './PostCompose';

export default class DashPostComposePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      draft: false,
      path: "",
      postChangeSuccessful: {},
    };
  }

  componentDidMount() {
    axios.get('/post/' + this.props.params.path).then((res) => {
      document.title = res.data.title;
      this.setState({
        title: res.data.title,
        content: res.data.content,
        draft: res.data.draft,
        path: res.data.path
      });
    });
  }

  submitPostChanges = () => {
    axios.put('/post/' + this.state.path, {
      title: this.state.title,
      content: this.state.content,
      draft: this.state.draft,
    }).then((res) => {
      if (res.status === 200) {
        this.setState({ postChangeSuccessful: true });
      }
    });
  }

  handleInputChange = (event) => {
    event.target.type === "checkbox" ?
      this.setState({ [event.target.name]: event.target.checked }) :
      this.setState({ [event.target.name]: event.target.value });
  }

  handleContentChange = (content) => {
    this.setState({ content: content });
  }

  render() {
    return(
      <div>
        <PostCompose
          title={this.state.title}
          content={this.state.content}
          draft={this.state.draft}
          postChangeSuccessful={this.state.postChangeSuccessful}
          handleInputChange={this.handleInputChange}
          handleContentChange={this.handleContentChange}
          submitPostChanges={this.submitPostChanges} />
      </div>
    );
  }
}
