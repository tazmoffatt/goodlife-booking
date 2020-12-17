import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

import { useUser } from '../context/userContext'
import config from '../config'

const TimeTable = ({ locations }) => {
  const { user, userWorkouts, setUserWorkouts, date: userDate } = useUser()
  const dateStrings = []
  for (let i = 0; i < locations[0].data.map.response.length; i += 1) {
    const date = new Date(locations[0].data.map.response[i].weekday)
    dateStrings.push(date.toDateString())
  }

  const handleBooking = async (event, info) => {
    event.preventDefault()
    if (!user) {
      alert('Sign in to book timeslot')
      return
    }

    try {
      const bookingResp = await fetch(`/api/requestBooking`, { method: 'POST', body: JSON.stringify({ clubId: info.clubId, timeSlotId: info.timeSlotId }), headers: { secureLoginToken: user.secureLoginToken } })
      const bookingRespJson = await bookingResp.json()
      if (!bookingResp.ok) {
        alert('ERROR - (not ok) ' + bookingRespJson.map.response.message)
        return
      }
      alert('SUCCESS - booked successfully')
      console.log('Booked successfully:', bookingRespJson)
      const userResp = await fetch(`/api/getUserWorkouts?date=${userDate}`, { headers: { secureLoginToken: user.secureLoginToken } })
      const userRespJson = await userResp.json()
      setUserWorkouts(userRespJson)
    } catch (err) {
      alert('ERROR - (catch) ' + err.message)
    }
  }

  const MultiTableCell = ({ available, booked }) => {
    let empty = true
    if (available.length || booked.length) empty = false
    return (
      <TableCell align="left">
        {empty && '-'}
        {
          available.map(element => <div key={element.timeString} className='available' onClick={e => handleBooking(e, element)}>{element.timeString}</div>)
        }
        {
          booked.map(element => <div key={element} className='booked'>{element}</div>)
        }
      </TableCell>
    )
  }

  return (
    <section className='timetable'>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Club Name</TableCell>
              <TableCell>Club Id</TableCell>
              <TableCell>{dateStrings[0]}</TableCell>
              <TableCell>{dateStrings[1]}</TableCell>
              <TableCell>{dateStrings[2]}</TableCell>
              <TableCell>{dateStrings[3]}</TableCell>
              <TableCell>{dateStrings[4]}</TableCell>
              <TableCell>{dateStrings[5]}</TableCell>
              <TableCell>{dateStrings[6]}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => {
              let workoutsAtClub = null
              if (userWorkouts) {
                workoutsAtClub = userWorkouts.map.response.filter(workout => workout.ClubId === location.ClubId)
              }

              const times = [{ available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }]
              if (Object.keys(location.data).length === 0) {
                return (
                  <TableRow key={location.ClubName} className='club-row'>
                  <TableCell align="left">{'204'}</TableCell>
                  <TableCell component="th" scope="row">
                    {location.ClubName}
                  </TableCell>
                  <TableCell align="left">{location.ClubId}</TableCell>
                  <MultiTableCell available={[]} booked={[]} />
                  <MultiTableCell available={[]} booked={[]} />
                  <MultiTableCell available={[]} booked={[]} />
                  <MultiTableCell available={[]} booked={[]} />
                  <MultiTableCell available={[]} booked={[]} />
                  <MultiTableCell available={[]} booked={[]} />
                  <MultiTableCell available={[]} booked={[]} />
                </TableRow>
                )
              }
              for (let i = 0; i < location.data.map.response.length; i += 1) {
                const locDate = location.data.map.response[i]
                const date = location.data.map.response[i].weekday.split('T')[0]

                if (userWorkouts) {
                  const found = workoutsAtClub.filter(workout => workout.date === date)
                  found.forEach(element => {
                    let timeString = element.startAt.split('T')[1]
                    const H = +timeString.substr(0, 2)
                    const h = H % 12 || 12
                    const ampm = (H < 12 || H === 24) ? "AM" : "PM"
                    timeString = h + timeString.substr(2, 3) + ampm
                    times[i].booked.push(timeString)
                  });
                }

                for (let j = 0; j < locDate.workouts.length; j += 1) {
                  if ((locDate.workouts[j].availableSlots > 0 && locDate.workouts[j].gymArea === 'Gym Floor' && location.ClubId !== 171)
                    || (locDate.workouts[j].availableSlots > 0 && locDate.workouts[j].gymArea === 'For Women' && location.ClubId === 171)) {
                    if (locDate.workouts[j].startAt.split('T')[1] === '00:00:00'
                      || locDate.workouts[j].startAt.split('T')[1] === '01:30:00') {
                      break;
                    }
                    let timeString = locDate.workouts[j].startAt.split('T')[1]
                    const H = +timeString.substr(0, 2)
                    const h = H % 12 || 12
                    const ampm = (H < 12 || H === 24) ? "AM" : "PM"
                    timeString = h + timeString.substr(2, 3) + ampm
                    times[i].available.push({
                      timeString,
                      timeSlotId: locDate.workouts[j].identifier,
                      clubId: locDate.workouts[j].clubId
                    })
                  }
                }
              }

              return (
                <TableRow key={location.ClubName} className='club-row'>
                  <TableCell align="left">{location.data ? location.data.map.statusCode : 'N/A'}</TableCell>
                  <TableCell component="th" scope="row">
                    {location.ClubName}
                  </TableCell>
                  <TableCell align="left">{location.ClubId}</TableCell>
                  <MultiTableCell available={times[0].available} booked={times[0].booked} />
                  <MultiTableCell available={times[1].available} booked={times[1].booked} />
                  <MultiTableCell available={times[2].available} booked={times[2].booked} />
                  <MultiTableCell available={times[3].available} booked={times[3].booked} />
                  <MultiTableCell available={times[4].available} booked={times[4].booked} />
                  <MultiTableCell available={times[5].available} booked={times[5].booked} />
                  <MultiTableCell available={times[6].available} booked={times[6].booked} />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  )
}

export default TimeTable
