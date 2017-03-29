import React from 'react';
import moment from 'moment';
import axios from '../../axios';
import PostCompose from './PostCompose';
import DashPostSideNav from './DashPostSideNav';

export default class DashPostComposePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      draft: false,
      path: "",
      createdAtDate: {},
      createdAtTime: {},
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
        path: res.data.path,
        createdAtDate: moment(res.data.createdAt).format("YYYY-MM-DD"),
        createdAtTime: moment(res.data.createdAt).format("HH:mm")
      });
    });
  }

  submitFeaturedImage = () => {
  }

  submitPostChanges = () => {
    axios.put('/post/' + this.state.path, {
      title: this.state.title,
      content: this.state.content,
      draft: this.state.draft,
      createdAt: moment(`${this.state.createdAtDate} ${this.state.createdAtTime}`, "YYYY-MM-DD HH:mm")
    }).then((res) => {
      this.setState({ postChangeSuccessful: true });
    }).catch(() => {

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
        <DashPostSideNav
          createdAtDate={this.state.createdAtDate}
          createdAtTime={this.state.createdAtTime}
          handleInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}
