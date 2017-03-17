import React, {Component} from 'react';
import axios from 'axios';
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
    axios.get('http://localhost:3001/api/site').then((res) => {
      this.setState({ site: res.data, pages: res.data.Pages })
    });
  }

  render() {
    return(
      <Navbar site={this.state.site} pages={this.state.pages} />
    );
  }
}
