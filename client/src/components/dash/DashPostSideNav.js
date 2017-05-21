import React, {Component} from 'react'

export default class DashPostSideNav extends Component {
  render () {
    let sideBarStyle = {
      position: 'fixed',
      top: '51px',
      bottom: 0,
      right: 0,
      zIndex: 1000,
      padding: '20px',
      overflowX: 'hidden',
      overflowY: 'auto',
      borderRight: '1px solid #eee',
      paddingLeft: 0,
      paddingRight: 0
    }

    let sideBarNavItemStyle = {
      width: '100%',
      marginLeft: 0,
      borderRadius: 0
    }

    return (
      <div>
        <nav className='col-sm-3 col-md-2 hidden-xs-down bg-fadded' style={sideBarStyle}>
          <ul className='nav flex-column'>
            <li className='nav-item'>
              <button style={sideBarNavItemStyle} className='btn btn-primary btn-block' type='button' data-toggle='collapse' data-target='#dateCollapse' aria-expanded='false' aria-controls='dateCollapse'>
                Creation Date & Time
              </button>
            </li>
            <div className='collapse' id='dateCollapse'>
              <div className='card card-block'>
                <div className='form-group'>
                  <label htmlFor='createdAt'>Date</label>
                  <input className='form-control'
                    type='date'
                    name='createdAtDate'
                    value={this.props.createdAtDate}
                    onChange={this.props.handleInputChange} />
                </div>
                <div className='form-group'>
                  <label htmlFor='time'>Time</label>
                  <input className='form-control'
                    type='time'
                    name='createdAtTime'
                    value={this.props.createdAtTime}
                    onChange={this.props.handleInputChange} />
                </div>
              </div>
            </div>
          </ul>
        </nav>
      </div>
    )
  }
}
