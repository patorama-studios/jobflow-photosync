import mysql from 'mysql2/promise';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

class MySQLClient {
  private pool: mysql.Pool;
  private static instance: MySQLClient;

  private constructor() {
    this.pool = mysql.createPool({
      host: import.meta.env.VITE_DB_HOST || 'localhost',
      port: parseInt(import.meta.env.VITE_DB_PORT || '3306'),
      user: import.meta.env.VITE_DB_USER || 'root',
      password: import.meta.env.VITE_DB_PASSWORD || '',
      database: import.meta.env.VITE_DB_NAME || 'jobflow_photosync',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
    });
  }

  static getInstance(): MySQLClient {
    if (!MySQLClient.instance) {
      MySQLClient.instance = new MySQLClient();
    }
    return MySQLClient.instance;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
      const results = await this.query<T>(sql, params);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Database queryOne error:', error);
      throw error;
    }
  }

  async insert(table: string, data: Record<string, any>): Promise<{ insertId: number }> {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);
      const placeholders = fields.map(() => '?').join(', ');
      
      const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
      const [result] = await this.pool.execute(sql, values);
      
      return { insertId: (result as any).insertId };
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  }

  async update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<{ affectedRows: number }> {
    try {
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
      
      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
      const params = [...Object.values(data), ...Object.values(where)];
      
      const [result] = await this.pool.execute(sql, params);
      return { affectedRows: (result as any).affectedRows };
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  async delete(table: string, where: Record<string, any>): Promise<{ affectedRows: number }> {
    try {
      const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
      const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
      
      const [result] = await this.pool.execute(sql, Object.values(where));
      return { affectedRows: (result as any).affectedRows };
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  }

  async select<T = any>(
    table: string, 
    options: {
      where?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
      columns?: string[];
    } = {}
  ): Promise<T[]> {
    try {
      const columns = options.columns ? options.columns.join(', ') : '*';
      let sql = `SELECT ${columns} FROM ${table}`;
      const params: any[] = [];

      if (options.where && Object.keys(options.where).length > 0) {
        const whereClause = Object.keys(options.where).map(key => `${key} = ?`).join(' AND ');
        sql += ` WHERE ${whereClause}`;
        params.push(...Object.values(options.where));
      }

      if (options.orderBy) {
        sql += ` ORDER BY ${options.orderBy}`;
      }

      if (options.limit) {
        sql += ` LIMIT ${options.limit}`;
        if (options.offset) {
          sql += ` OFFSET ${options.offset}`;
        }
      }

      return await this.query<T>(sql, params);
    } catch (error) {
      console.error('Database select error:', error);
      throw error;
    }
  }

  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export const db = MySQLClient.getInstance();
export default db;