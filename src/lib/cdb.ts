export const config = {
  connectionString: process.env.COCKROACH_DB_URI,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.cert,
  },
};
