import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;
const DB_FILE = path.join(__dirname, 'myslack-central-db.json');

// Default initial state for central database
const initialData = {
  users: [],
  workspaces: [],
  channels: [],
  messages: []
};

// Ensure database file exists on disk
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading central DB file:', err);
  }
  saveDb(initialData);
  return initialData;
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing central DB file:', err);
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers to allow any laptop or mobile phone on Wi-Fi or Internet
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        // Ignore non-json
      }
    }

    const db = loadDb();

    // 1. Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'online', usersCount: db.users.length }));
      return;
    }

    // 2. Register Account
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const { email, password, displayName, role, currentTask, devPasscode, clientIp } = parsedBody;

      if (!email || !email.includes('@')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email address format.' }));
        return;
      }

      const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email is already registered on central database.' }));
        return;
      }

      const isDevRequested = role === 'developer';
      const isApproved = !isDevRequested || (devPasscode === 'DEV-SECRET-2026');
      const assignedRole = isDevRequested && !isApproved ? 'employee' : (role || 'employee');

      const newUser = {
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        displayName: displayName || email.split('@')[0],
        email: email.toLowerCase(),
        password: password || '123456',
        role: assignedRole,
        status: 'active',
        customTask: currentTask || '🎉 Joined MySlack Workspace',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80`,
        isApproved: isApproved,
        createdAt: new Date().toISOString(),
        registeredIp: clientIp || '127.0.0.1'
      };

      db.users.push(newUser);
      saveDb(db);

      const token = `jwt-token-${newUser.id}-${Date.now()}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        token,
        user: newUser,
        pendingApproval: !isApproved
      }));
      return;
    }

    // 3. Login Account
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = parsedBody;
      const foundUser = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());

      if (!foundUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Account not found in central database. Please click "Create Account" to register.' }));
        return;
      }

      if (password && foundUser.password && foundUser.password !== password) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Incorrect password.' }));
        return;
      }

      if (!foundUser.isApproved) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Your account registration as ${foundUser.role.toUpperCase()} is pending Admin approval.` }));
        return;
      }

      foundUser.status = 'active';
      foundUser.onlineSince = new Date().toISOString();
      saveDb(db);

      const token = `jwt-token-${foundUser.id}-${Date.now()}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token, user: foundUser }));
      return;
    }

    // 4. Get all users for sync
    if (pathname === '/api/auth/users' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.users));
      return;
    }

    // 5. Update user status/approval
    if (pathname === '/api/auth/update-user' && req.method === 'POST') {
      const { userId, updates } = parsedBody;
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        db.users[userIndex] = { ...db.users[userIndex], ...updates };
        saveDb(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.users[userIndex]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
      return;
    }

    // Fallback 404 for unknown endpoints
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`🚀 MySlack Central Database Server Running on Port ${PORT}`);
  console.log(`🌐 Listening on 0.0.0.0:${PORT} for Laptops & Mobile Phones`);
  console.log(`📁 Central DB File: ${DB_FILE}`);
  console.log(`===================================================`);
});
