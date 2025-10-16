module.exports = ({ env }) => ({
  connection: {
    client: 'mongo',
    connection: {
      uri: env('DATABASE_URI'),
      ssl: true,
    },
    useNullAsDefault: true,
  },
});
