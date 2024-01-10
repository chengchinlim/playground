import { configs } from './config'
import express, { type Request, type Response } from 'express'
import cors from 'cors'

const app = express()
app.use(
  express.json(),
  express.urlencoded({ extended: true }),
  cors({ origin: true })
)

app.get('*', (req: Request, res: Response) => {
  res.status(200).send('Playground Typescript Server is running')
})

app.listen(configs.port, () => {
  console.log(`⚡️Server is running at port ${configs.port}`)
})
