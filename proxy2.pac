// Scenario: ova jumper
var proxy = 'PROXY 127.0.0.1:1080';

var viaProxySubnets = [
  "192.168.0.0/24",
  "192.168.1.0/24",
  "10.0.1.0/24",
  "172.16.0.0/16"
];

function FindProxyForURL(url, host) {
  for (var i = 0; i < viaProxySubnets.length; i++) {
    if (isInSubnet(host, viaProxySubnets[i])) {
      return proxy;
    }
  }
  return "DIRECT";
}

function isInSubnet(ip, subnet) {
  var ipParts = ip.split('.').map(Number);
  var subnetParts = subnet.split('/')[0].split('.').map(Number);
  var maskBits = parseInt(subnet.split('/')[1], 10);
  var mask = (0xFFFFFFFF << (32 - maskBits)) >>> 0;
  var ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  var subnetInt = (subnetParts[0] << 24) | (subnetParts[1] << 16) | (subnetParts[2] << 8) | subnetParts[3];
  return (ipInt & mask) === (subnetInt & mask);
}