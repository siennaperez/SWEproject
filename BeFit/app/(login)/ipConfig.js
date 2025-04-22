let ipAddress = 'http://10.138.10.93:3000';  // default IP address

export const getIpAddress = () => ipAddress;

export const setIpAddress = (newIp) => {
  ipAddress = newIp;
};