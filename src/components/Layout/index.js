import React from 'react'
import { Outlet } from 'react-router-dom'
import './index.scss'

const Layout = () => {
  return (
    <div className='page'>
        <h1 title='unsecureChat' className='title'>unsecureChat</h1>
        <Outlet />
    </div>
  )
}

export default Layout