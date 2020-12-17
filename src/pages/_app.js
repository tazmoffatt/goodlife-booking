import React from 'react'

import '../styles/globals.css'

import { UserProvider } from '../context/userContext'

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </React.Fragment>
  )
}

export default MyApp
