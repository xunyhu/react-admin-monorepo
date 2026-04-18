import mysql, { Pool } from 'mysql2/promise';

const poolHost = process.env.DB_HOST || 'localhost';
const poolPort = Number(process.env.DB_PORT || 3306);
const poolUser = process.env.DB_USER || 'root';
const poolPassword = process.env.DB_PASSWORD || '123456';
const poolDatabase = process.env.DB_NAME || 'admin_system';

const pool: Pool = mysql.createPool({
  host: poolHost,
  port: poolPort,
  user: poolUser,
  password: poolPassword,
  database: poolDatabase,
  waitForConnections: true,
  connectionLimit: 10,
});

export const query = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T> => {
  const [rows] = await pool.query(sql, params);
  return rows as T;
};

export default pool as mysql.Pool;
