import React from 'react';
import markdown from 'markdown-it';

export default class PostPreview extends React.Component {
  updateMarkup = (event) => {
    
  }

  render() {
    let mark = new markdown();
    let markup = { __html: mark.render(this.props.content) }
    console.log(this.props.content);
    return(
      <div>
        <div dangerouslySetInnerHTML={markup} />
      </div>
    );
  }
}
