let ipAddress = 'http://10.20.0.4:3000';  // default IP address

export const getIpAddress = () => ipAddress;

export const setIpAddress = (newIp) => {
  ipAddress = newIp;
};