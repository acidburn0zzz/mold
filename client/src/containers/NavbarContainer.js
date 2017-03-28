import React, {Component} from 'react';
import axios from '../axios';
import Navbar from '../components/Navbar';

export default class NavbarContainer extends Component {
  constructor() {
    super();
    this.state = {
      site: {},
      pages: [],
    }
  }

  componentDidMount() {
    axios.get('/site').then((res) => {
      this.setState({ site: res.data })
    });
    axios.get('/page/published').then((res) => {
      this.setState({ pages: res.data });
    });
  }

  render() {
    return(
      <Navbar site={this.state.site} pages={this.state.pages} />
    );
  }
}
