// PM2 Configuration File
// Jalankan dengan: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: 'it-asset-api',
      script: 'index.js',
      cwd: __dirname,
      
      // Instances & Cluster
      instances: 'max', // Atau angka spesifik: 2, 4, dll
      exec_mode: 'cluster',
      
      // Environment
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto-restart
      watch: false, // Set true untuk development
      max_memory_restart: '500M',
      restart_delay: 4000,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Node.js options
      node_args: '--max-old-space-size=512'
    }
  ],
  
  // Deployment configuration (opsional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:VibeCoding3-JC/asst-mngmtjc.git',
      path: '/var/www/it-asset-api',
      'pre-deploy-local': '',
      'post-deploy': 'cd backend && npm install && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};
