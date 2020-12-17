import React, { useContext, useState } from 'react'

const UserContext = React.createContext()
const initDate = new Date()

const UserProvider = (props) => {
  const [user, setUser] = useState(null)
  const [userWorkouts, setUserWorkouts] = useState(null)
  const [date, setDate] = useState(initDate.toISOString().split('T')[0])

  const logout = () => {
    setUser(null)
    setUserWorkouts(null)
  }

  return (
    <UserContext.Provider value={{
      logout,
      user,
      setUser,
      userWorkouts,
      setUserWorkouts,
      date,
      setDate
    }}>
      {props.children}
    </UserContext.Provider>
  )
}

const useUser = () => {
  return useContext(UserContext)
}

export {
  UserProvider,
  UserContext,
  useUser
}
