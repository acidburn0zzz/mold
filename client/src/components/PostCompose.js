import React from 'react';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/markdown';

export default class PostCompose extends React.Component {
  render() {
    return(
      <div style={{ paddingTop: 65 }}>
        <form>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              name="title"
              className="form-control"
              type="text" value={this.props.title}
              onChange={this.props.handleInputChange} />
          </div>
          <div className="form-group" id="content">
            <label htmlFor="content">Body</label>
            <AceEditor
              name="content"
              value={this.props.content}
              mode="markdown"
              theme="github"
              width="100%"
              height="600px"
              onChange={this.props.handleContentChange}
              fontSize={16}
              editorProps={{ $blockScrolling: Infinity }}
            />
          </div>
          <div className="form-group">
            <div className="form-check">
              <label className="form-check-label">
                <input
                  name="draft"
                  type="checkbox"
                  className="form-check-input"
                  checked={this.props.draft}
                  onChange={this.props.handleInputChange} /> Draft
              </label>
            </div>
          </div>
        </form>
        <button className="btn btn-primary" onClick={this.props.submitPostChanges}>Submit</button>
        <button className="btn btn-primary">Preview</button>
      </div>
    );
  }
}
