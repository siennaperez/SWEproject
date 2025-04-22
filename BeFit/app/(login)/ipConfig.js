let ipAddress = 'http://10.136.226.222:3000';  // default IP address

export const getIpAddress = () => ipAddress;

export const setIpAddress = (newIp) => {
  ipAddress = newIp;
};