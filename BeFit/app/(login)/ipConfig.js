
let ipAddress = 'http://10.136.40.66:3000';  // default IP address


export const getIpAddress = () => ipAddress;

export const setIpAddress = (newIp) => {
  ipAddress = newIp;
};