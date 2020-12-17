import React, { useState } from 'react'
import {
  Button,
  Container
} from '@material-ui/core'

import { useUser } from '../context/userContext'
import Login from '../components/Login'
import TimeTable from '../components/TimeTable'

import config from '../config'
import initLocationsFile from '../utils/locations'

const index = ({ initLocations }) => {
  const { user, date, setDate, logout } = useUser()
  const [locations, setLocations] = useState(initLocations)
  const [loading, setLoading] = useState(false)

  const handleRefreshLocationTimes = async () => {
    setLoading(true)
    const newLocations = []
    let i = 0
    for (i; i < initLocationsFile.length; i += 1) {
      const locationTimes = await fetch(`/api/getTimes?clubId=${initLocationsFile[i].ClubId}&date=${date}`)
      const data = await locationTimes.json()
      newLocations.push({
        ...initLocationsFile[i],
        data
      })
    }
    setLocations(newLocations)
    setLoading(false)
  }

  const handlePreviousWeek = async () => {
    const currentDate = new Date(date)
    const newDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    setDate(newDate.toISOString().split('T')[0])
    handleRefreshLocationTimes()
  }

  const handleNextWeek = async () => {
    const currentDate = new Date(date)
    const newDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    setDate(newDate.toISOString().split('T')[0])
    handleRefreshLocationTimes()
  }

  return (
    <Container>
      {
        user
          ? (
            <section className='logged-in'>
              <p>Hello {user.FirstName}</p>
              <Button variant='contained' onClick={() => logout()}>
                Sign Out
              </Button>
            </section>
          )
          : <Login />
      }
      <Button disabled={loading} variant='contained' onClick={() => handlePreviousWeek()}>
        Previous Week
      </Button>
      <Button disabled={loading} variant='contained' onClick={() => handleRefreshLocationTimes()}>
        Refresh Table
      </Button>
      <Button disabled={loading} variant='contained' onClick={() => handleNextWeek()}>
        Next Week
      </Button>
      <TimeTable locations={locations} />
    </Container>
  )
}

export const getServerSideProps = async ({ req }) => {
  const date = new Date()
  const initLocations = []
  let i = 0
  for (i; i < initLocationsFile.length; i += 1) {
    const locationTimes = await fetch(config.host + `/api/getTimes?clubId=${initLocationsFile[i].ClubId}&date=${date.toISOString().split('T')[0]}`)
    const data = await locationTimes.json()
    initLocations.push({
      ...initLocationsFile[i],
      data
    })
  }

  return {
    props: {
      initLocations,
    }
  }
}

export default index
