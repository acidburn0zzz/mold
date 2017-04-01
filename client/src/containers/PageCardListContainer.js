import React from 'react';
import axios from '../axios';
import PageCard from '../components/dash/PageCard';

export default class PageCardListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      pages: [],
    }
  }

  componentDidMount() {
    axios.get('/page/').then((res) => {
      this.setState({ pages: res.data });
    });
  }

  deletePage = (page) => {
    axios.delete('/page/' + page.path).then((res) => {
      let pages = this.state.pages.slice();
      pages.splice(pages.indexOf(page), 1);
      this.setState({ pages: pages });
    });
  }

  render() {
    let style = { paddingTop: 65 };
    return(
      <div style={style}>
        {this.state.pages.map(page => 
          <PageCard key={page.id} page={page} deletePage={this.deletePage} />
        )}
      </div>
    );
  }
}
