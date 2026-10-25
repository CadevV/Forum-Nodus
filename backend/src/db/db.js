import { Pool } from 'pg'
import "dotenv/config"

const pool = new Pool()

export { pool }