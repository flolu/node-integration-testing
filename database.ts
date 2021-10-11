import retry from 'async-retry'
import {createPool, RowDataPacket} from 'mysql2/promise'

import {Todo, TodoStatus} from './index'

const TABLE_NAME = 'todos'

enum TableColumn {
  Id = 'id',
  Text = 'text',
  Status = 'status',
}

const pool = createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

function getConnection() {
  return retry(async () => await pool.getConnection())
}

export function initialize() {
  return new Promise(async resolve => {
    const connection = await getConnection()
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        ${TableColumn.Id} INT NOT NULL UNIQUE AUTO_INCREMENT,
        ${TableColumn.Text} VARCHAR(255) NOT NULL,
        ${TableColumn.Status} INT NOT NULL,
        PRIMARY KEY (${TableColumn.Id})
        ) ENGINE=InnoDB;
        `)
    connection.release()
    resolve(null)
  })
}

export async function insertTodo(text: string): Promise<Todo> {
  const connection = await getConnection()
  const [row] = await connection.query(
    `
    INSERT INTO ${TABLE_NAME} (${TableColumn.Status}, ${TableColumn.Text})
    VALUES (?, ?);
    `,
    [TodoStatus.Unchecked, text]
  )
  await connection.release()

  return {
    id: (row as any).insertId,
    text,
    status: TodoStatus.Unchecked,
  }
}

export async function checkTodo(id: string) {
  const connection = await getConnection()
  await connection.query(
    `
    UPDATE ${TABLE_NAME}
    SET ${TableColumn.Status} = ${TodoStatus.Done}
    WHERE ${TableColumn.Id} = ?;
    `,
    [id]
  )
  await connection.release()
}

export async function deleteTodo(id: string) {
  const connection = await getConnection()
  await connection.query(
    `
    DELETE FROM ${TABLE_NAME}
    WHERE ${TableColumn.Id} = ?;
    `,
    [id]
  )
  await connection.release()
}

export async function getTodos(): Promise<Todo[]> {
  const connection = await getConnection()
  const [rows] = await connection.query(
    `
    SELECT * FROM ${TABLE_NAME}
    WHERE ${TableColumn.Status} != ${TodoStatus.Deleted};
    `
  )
  await connection.release()

  return (rows as RowDataPacket[]).map(row => {
    return {
      id: row[TableColumn.Id],
      text: row[TableColumn.Text],
      status: row[TableColumn.Status],
    }
  })
}
