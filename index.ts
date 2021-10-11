import * as bodyParser from 'body-parser'
import express from 'express'

import * as database from './database'

export enum TodoStatus {
  Unchecked,
  Done,
  Deleted,
}

export interface Todo {
  id: number
  text: string
  status: number
}

const app = express()

app.use(bodyParser.json())

app.post('/add-todo', async (req, res) => {
  const created = await database.insertTodo(req.body.text)
  res.json(created)
})

app.post('/check-todo', async (req, res) => {
  await database.checkTodo(req.body.id)
  res.end()
})

app.post('/delete-todo', async (req, res) => {
  await database.deleteTodo(req.body.id)
  res.end()
})

app.get('/todos', async (_req, res) => {
  const todos = await database.getTodos()
  res.json(todos)
})

async function main() {
  try {
    console.log('starting api...')
    await database.initialize()
    app.listen(3000, () => console.log('api started on port 3000'))
  } catch (err) {
    process.exit(1)
  }
}

main()
