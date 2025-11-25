module.exports = {
  apps: [
    {
      name: 'passop-backend',
      script: 'server.js',
      cwd: '/var/www/backend',    // backend folder on the server
      instances: 1,               // one instance is fine for EC2
      exec_mode: 'fork',          // no clustering needed
      watch: false,               // do NOT watch files in production
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
