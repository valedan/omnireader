import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'dan',
  password: '',
  database: 'omnireader_dev',
});

export const query = (text, params = undefined) => pool.query(text, params);
