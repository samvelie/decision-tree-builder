module.exports = {
  database: 'decisions',
  host: 'localhost',
  port: 5432,
  max: 100, //this is the "bandaid" fix for server troubles
  idleTimeoutMillis: 1500
};
