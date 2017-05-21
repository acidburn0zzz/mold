import React, {Component} from 'react'
import {Redirect} from 'react-router'
import DashSideNav from './DashSideNav'
import DashOpView from './DashOpView'
import DashNavbar from './DashNavbar'
import axios from '../../axios'

class Dash extends Component {
  constructor () {
    super()
    this.state = {
      authorized: {}
    }
  }

  componentWillMount () {
    axios.post('/auth/verify', {
      token: window.localStorage.getItem('token')
    }).then(() => {
      this.setState({ authorized: true })
    }).catch(() => {
      this.setState({ authorized: false })
    })
  }

  render () {
    return (
      this.state.authorized
      ? <div>
        <DashNavbar />
        <div className='container-fluid'>
          <div className='row' style={{paddingTop: 65}}>
            <div className='col-md-2'>
              <DashSideNav />
            </div>
            <div className='col-md-10' style={{minHeight: 'calc(100vh - 65px)'}}>
              <DashOpView />
            </div>
          </div>
        </div>
      </div>
      : <Redirect to='/' />
    )
  }
}

export default Dash
