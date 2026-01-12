const https = require('https');
const fs = require('fs');

const sql = fs.readFileSync('update-menu-final.sql', 'utf8');

const data = JSON.stringify({ sql: sql });

const options = {
  hostname: 'sian-d-acqui.onrender.com',
  path: '/api/admin/execute-sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
