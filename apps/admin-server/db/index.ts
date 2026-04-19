import mysql, { Pool } from 'mysql2/promise';

const poolHost = process.env.DB_HOST!;
const poolPort = Number(process.env.DB_PORT!);
const poolUser = process.env.DB_USER!;
const poolPassword = process.env.DB_PASSWORD!;
const poolDatabase = process.env.DB_NAME!;

if (!poolHost || !poolPort || !poolUser || !poolDatabase) {
  throw new Error('❌ 数据库环境变量未配置完整');
}

const pool: Pool = mysql.createPool({
  host: poolHost,
  port: poolPort,
  user: poolUser,
  password: poolPassword,
  database: poolDatabase,
  waitForConnections: true,
  connectionLimit: 10,
});

pool
  .getConnection()
  .then((conn) => {
    console.log('✅ MySQL connected:', poolHost, poolDatabase);
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
  });

export const query = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T> => {
  const [rows] = await pool.query(sql, params);
  return rows as T;
};

export default pool as mysql.Pool;
