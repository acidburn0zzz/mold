import React, {Component} from 'react';
import PostListContainer from './containers/PostListContainer';
import NavbarContainer from './containers/NavbarContainer';

class FrontPage extends Component {
  render() {
    document.title = "Mold";
    return(
      <div>
        <NavbarContainer/>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <PostListContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FrontPage;
