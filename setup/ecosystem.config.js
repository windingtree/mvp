// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'coordinator',
      script: '/path/to/project/packages/server/dist/index.js',
      out_file: '/path/to/logs/server-out.log',
      error_file: '/path/to/logs/server-error.log',
      autorestart: true,
      watch: false,
    },
    {
      name: 'node',
      script: '/path/to/project/packages/node/dist/index.js',
      out_file: '/path/to/logs/node-out.log',
      error_file: '/path/to/logs/node-error.log',
      autorestart: true,
      watch: false,
    },
  ],
};
