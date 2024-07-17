/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'kenyaruralFrontend',
      script: 'npm run start',
      // script: 'npm run dev',
      watch: false,
      ignore_watch: ['node_modules', 'public', 'logs', 'lib'],
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      cron_restart: '0 0 0 * * *',
      autorestart: true,
      max_restarts: 5,
      timezone: 'Africa/Nairobi',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
