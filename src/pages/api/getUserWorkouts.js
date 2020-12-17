import axios from 'axios'

export default async (req, res) => {
  const { method, query: { date }, headers: { securelogintoken } } = req
  switch (method) {
    case 'GET':
      console.log('Getting user workout schedule with', securelogintoken)
      try {
        const resp = await axios({
          method: 'get',
          url: `https://www.goodlifefitness.com/content/goodlife/en/member-details/jcr:content/root/responsivegrid/myaccount/myclasses/myworkouts.GetMemberWorkoutBookings.${date}.json`,
          headers: {
            Cookie: `secureLoginToken=${securelogintoken}`
          }
        })
        console.log(`Got user workout schedule successfully`)
        if (resp.data.map.statusCode === 200) {
          const newResponse = {
            map: {
              statusCode: resp.data.map.statusCode,
              response: []
            }
          }
          Object.keys(resp.data.map.response).forEach((workout) => {
            newResponse.map.response.push({
              ...resp.data.map.response[workout],
              date: resp.data.map.response[workout].startAt.split('T')[0]
            })
          })
          return res.json(newResponse)
        } else {
          return res.json(resp.data)
        }
      } catch (err) {
        console.error(`Error - getting user workout schedule unsuccessful. ${JSON.stringify(err.response.data)}`)
        return res.status(err.response.status).send(err.response.data)
      }
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
