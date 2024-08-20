import sql, { ConnectionPool } from "mssql";
// import bdConfig from './dbconfig.json'

const dbConfig = {
  user: "sa",
  password: "LosSitios3264.",
  server: "localhost",
  database: "las_plumas",
  port: 1433,
  options: {
    trustServerCertificate: true,
    encrypt: true,
    instance: "SQLEXPRESS",
  },
};

let instance: DbConnection | null = null;

export class DbConnection {
  public pool: ConnectionPool | null = null;
  constructor() {
    this.pool = null;
  }

  static getInstance() {
    if (!instance) {
      instance = new DbConnection();
    }
    return instance;
  }

  async getConnection() {
    try {
      if (this.pool) {
        await this.pool.close();
      }
      this.pool = await sql.connect(dbConfig);
      return this.pool;
    } catch (error) {
      console.error("Error de conexión", error);
    }
  }

  async closeConnection() {
    try {
      if (this.pool) {
        await this.pool.close();
      }
    } catch (error) {
      console.error("Error al cerrar la conexión", error);
    }
  }
}
