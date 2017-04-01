import React from 'react';
import PostCompose from '../../components/dash/PostCompose';
import DashPostSideNav from '../../components/dash/DashPostSideNav';
import moment from 'moment';
import axios from '../../axios';

export default class NewPostContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
      content: "",
      draft: true,
      path: "",
      createdAtDate: moment().format("YYYY-MM-DD"),
      createdAtTime: moment().format("HH:mm"),
      postSubmitSuccessful: false,
    };
  }

  submitPostChanges = () => {
    axios.post('/post/', {
      title: this.state.title,
      content: this.state.content,
      draft: this.state.draft,
      createdAt: moment(`${this.state.createdAtDate} ${this.state.createdAtTime}`, "YYYY-MM-DD HH:mm")
    }).then((res) => {
      this.setState({ postSubmitSuccessful: true });
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
