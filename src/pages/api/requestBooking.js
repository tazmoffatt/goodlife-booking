import axios from 'axios'
import FormData from 'form-data'

export default async (req, res) => {
  const { method, body, headers: { securelogintoken } } = req
  const { clubId, timeSlotId } = JSON.parse(body)
  switch (method) {
    case 'POST':
      console.log(`Requesting access for ${clubId} at ${timeSlotId}`)
      const data = new FormData()
      data.append('clubId', clubId)
      data.append('timeSlotId', timeSlotId)

      try {
        const resp = await axios({
          method: 'post',
          url: 'https://www.goodlifefitness.com/content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.CreateWorkoutBooking.json',
          headers: {
            ...data.getHeaders(),
            Cookie: `secureLoginToken=${securelogintoken}`
          },
          data: data
        })
        console.log(`Successfully request access for ${clubId} at ${timeSlotId} successfully`)
        return res.json(resp.data)
      } catch (err) {
        console.error(`Error - requesting access for ${clubId} at ${timeSlotId} unsuccessful. ${JSON.stringify(err.response.data)}`)
        return res.status(err.response.status).send(err.response.data)
      }
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
