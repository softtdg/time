const config = {
  MODE: process.env.SERVER,
  PORT: process.env.PORT || 5000,
  baseURL: process.env.baseURL,
  prefix: '/api',
  mongoUri: process.env.mongoUri,
  mongoDbName: process.env.mongoDbName,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  SECRET: process.env.secret,
  JWTEXPIRY: process.env.jwtexpiry,

  // Base SQL Server configuration
  sqlBaseConfig: {
    server: process.env.sqlServer,
    port: parseInt(process.env.sqlPort, 10),
    user: process.env.sqlUser,
    password: process.env.sqlPassword,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 300000,
      connectionTimeout: 60000,
      cancelTimeout: 30000,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 60000,
        createTimeoutMillis: 60000,
        destroyTimeoutMillis: 5000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    },
  },

  // Database names mapping
  databases: {
    sop: process.env.sop_database,
    qa: process.env.qa_database,
    design: process.env.design_database,
    electrical: process.env.electrical_database,
    overview: process.env.overview_database,
    purchasing: process.env.purchasing_database,
  },

  // Generate database configurations dynamically
  getDatabaseConfig: function (dbName) {
    const database = this.databases[dbName];
    if (!database) {
      throw new Error(`Database configuration for '${dbName}' not found`);
    }
    return {
      ...this.sqlBaseConfig,
      database: database,
    };
  },

  get sop_config() {
    return this.getDatabaseConfig('sop');
  },
  get qa_config() {
    return this.getDatabaseConfig('qa');
  },
  get design_config() {
    return this.getDatabaseConfig('design');
  },
  get electrical_config() {
    return this.getDatabaseConfig('electrical');
  },
  get overview_config() {
    return this.getDatabaseConfig('overview');
  },
  get purchasing_config() {
    return this.getDatabaseConfig('purchasing');
  },
};

module.exports = config;
