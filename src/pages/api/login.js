import axios from 'axios'
import FormData from 'form-data'

export default async (req, res) => {
  const { method, body } = req
  const { login, passwordParameter } = JSON.parse(body)
  switch (method) {
    case 'POST':
      console.log(`Logging in user ${login}`)
      const data = new FormData()
      data.append('login', login)
      data.append('passwordParameter', passwordParameter)

      try {
        const resp = await axios({
          method: 'post',
          url: 'https://www.goodlifefitness.com/content/experience-fragments/goodlife/header/master/jcr:content/root/responsivegrid/header.AuthenticateMember.json',
          headers: {
            ...data.getHeaders()
          },
          data: data
        })
        console.log(`Logged in user ${login} successfully`)
        const cookies = resp.headers['set-cookie']
        let secureLoginToken = null
        for (let i = 0; i < cookies.length; i += 1) {
          if (cookies[i].startsWith('secureLoginToken')) {
            secureLoginToken = cookies[i]
            secureLoginToken = secureLoginToken.split(';')[0]
            secureLoginToken = secureLoginToken.replace("secureLoginToken=", "");
            break
          }
        }
        return res.json({
          ...resp.data.map.response,
          secureLoginToken
        })
      } catch (err) {
        console.error(`Error - logging in user ${login} unsuccessful. ${JSON.stringify(err.response.data)}`)
        return res.status(err.response.status).send(err.response.data)
      }
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
