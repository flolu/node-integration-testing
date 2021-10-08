import express from 'express'

const app = express()

app.get('/', (req, res) => res.send('api is healthy'))

async function main() {
  app.listen(3000)
}

main()
