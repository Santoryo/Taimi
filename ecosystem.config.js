module.exports = {
  apps: [
    {
      name: 'taimi-server',
      script: 'npm',
      args: 'run start',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'taimi-worker',
      script: 'npm',
      args: 'run start:worker',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
