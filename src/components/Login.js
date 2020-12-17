import React, { useState } from 'react'
import {
  Button,
  TextField
} from '@material-ui/core'

import { useUser } from '../context/userContext'
import config from '../config'

const Login = () => {
  const { setUser, setUserWorkouts, date } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const loginResp = await fetch(`/api/login`, { method: 'POST', body: JSON.stringify({ login: email, passwordParameter: password }) })
      const loginRespJson = await loginResp.json()
      if (!loginResp.ok) {
        setError(loginRespJson.map.response.message)
        setLoading(false)
        return
      }
      setUser(loginRespJson)
      const userResp = await fetch(`/api/getUserWorkouts?date=${date}`, { headers: { secureLoginToken: loginRespJson.secureLoginToken } })
      const userRespJson = await userResp.json()
      setUserWorkouts(userRespJson)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <section className='login'>
      <form onSubmit={handleLogin}>
        <TextField fullWidth required label='Email' type='email' value={email} onChange={e => setEmail(e.target.value)} autoComplete='username' />
        <TextField fullWidth required label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} autoComplete='current-password' />
        {error && <p>{error}</p>}
        <Button variant='contained' disabled={loading} type='submit'>
          Sign In
        </Button>
      </form>
    </section>
  )
}

export default Login
