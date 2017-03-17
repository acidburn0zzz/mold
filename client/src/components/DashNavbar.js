import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Navbar extends Component {
  renderPages() {
    if (this.props.pages.length > 0) {
      return(
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ml-auto">
            {this.props.pages.map(page => 
              <li key={page.id} className="nav-item">
                <Link to={`${page.url}`} className="nav-link">{page.title}</Link>
              </li>
            )}
          </ul>
        </div>
      );
    }
  }

  render() {
    return(
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light fixed-top bg-faded">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand">{this.props.site.name}</Link>
          {this.renderPages()}
        </nav>
      </div>
    );
  }
}


export default Navbar;
