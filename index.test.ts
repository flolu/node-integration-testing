import axios from 'axios'
import * as path from 'path'
import {GenericContainer, Network, StartedNetwork, StartedTestContainer} from 'testcontainers'

import {Todo, TodoStatus} from './index'

describe('application', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1 * 60 * 1000

  let mysqlContainer: StartedTestContainer
  let apiContainer: StartedTestContainer
  let network: StartedNetwork
  let apiUrl: string

  const text1 = 'Write unit tests'
  const text2 = 'Write integration tests'

  const todo1: Todo = {id: 1, text: text1, status: TodoStatus.Unchecked}
  const todo2: Todo = {id: 2, text: text2, status: TodoStatus.Unchecked}

  beforeAll(async () => {
    network = await new Network({name: 'test'}).start()

    mysqlContainer = await new GenericContainer('mysql:8')
      .withName('test_mysql')
      .withExposedPorts(3306)
      .withEnv('MYSQL_ROOT_PASSWORD', 'password')
      .withEnv('MYSQL_DATABASE', 'test')
      .withNetworkMode(network.getName())
      .start()

    apiContainer = await new GenericContainer('node:14')
      .withExposedPorts(3000)
      .withEnv('MYSQL_HOST', 'test_mysql')
      .withEnv('MYSQL_PORT', '3306')
      .withEnv('MYSQL_USER', 'root')
      .withEnv('MYSQL_DATABASE', 'test')
      .withEnv('MYSQL_PASSWORD', 'password')
      .withBindMount(path.join(__dirname, './node_modules'), '/node_modules')
      .withBindMount(path.join(__dirname, './tsconfig.json'), '/tsconfig.json')
      .withBindMount(path.join(__dirname, './package.json'), '/package.json')
      .withBindMount(path.join(__dirname, './database.ts'), '/database.ts')
      .withBindMount(path.join(__dirname, './index.ts'), '/index.ts')
      .withCmd(['yarn', 'run', 'ts-node-dev', 'index'])
      .withNetworkMode(network.getName())
      .start()

    const apiLogs = await apiContainer.logs()
    apiLogs.on('data', line => console.log(line))
    apiLogs.on('err', line => console.error(line))

    apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(3000)}`
  })

  it('adds new todos', async () => {
    const response1 = await axios.post(`${apiUrl}/add-todo`, {text: text1})
    expect(response1.data).toEqual(todo1)

    const response2 = await axios.post(`${apiUrl}/add-todo`, {text: text2})
    expect(response2.data).toEqual(todo2)
  })

  it('gets existing todos', async () => {
    const response = await axios.get(`${apiUrl}/todos`)
    expect(response.data).toEqual([todo1, todo2])
  })

  it('checks todos', async () => {
    await axios.post(`${apiUrl}/check-todo`, {id: todo1.id})
    const response = await axios.get(`${apiUrl}/todos`)
    expect(response.data).toEqual([{...todo1, status: TodoStatus.Done}, todo2])
  })

  it('deletes todos', async () => {
    await axios.post(`${apiUrl}/delete-todo`, {id: todo2.id})
    const response = await axios.get(`${apiUrl}/todos`)
    expect(response.data).toEqual([{...todo1, status: TodoStatus.Done}])
  })

  afterAll(async () => {
    await apiContainer.stop()
    await mysqlContainer.stop()
    await network.stop()
  })
})
