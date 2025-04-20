//function to get users ip address from their laptop to use as a host!!

const os = require('os');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // ip address here!! 
      }
    }
  }

  return '10.136.107.113'; //automatic UF IP address!!, makes the setback work for uf students
}