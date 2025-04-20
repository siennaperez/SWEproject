//function to get users ip address from their laptop to use as a host!!

const os = require('os');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // this is your IP address (e.g., 10.136.107.113)
      }
    }
  }

  return '127.0.0.1'; // fallback
}