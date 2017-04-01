import React from 'react';

export default class PageCard extends React.Component {
  render() {
    let renderedContent = { __html: this.props.page.rendered }
    return(
      <div>
        <div className="card">
          <div className="card-block">
            <h2 className="card-title">{this.props.page.title}</h2>
            <div className="card-text" dangerouslySetInnerHTML={renderedContent} />
          </div>
        </div>
      </div>
    );
  }
}
