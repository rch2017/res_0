//Scenario: proxy first, ip or domain in list connect direct
var proxy = 'PROXY 127.0.0.1:1080; DIRECT;';

var directSubnets = [
  "192.168.0.0/24",
  "192.168.1.0/24",
  "10.0.1.0/24",
  "172.16.0.0/16"
];

var directHosts = [
  "127.0.0.1",
  "localhost",
  "baidu.com",
  "tencent.com",
  "sina.com",
  "126.com",
  "163.com"
];

function FindProxyForURL(url, host) {
  for (var i = 0; i < directSubnets.length; i++) {
    if (isInSubnet(host, directSubnets[i])) {
      return "DIRECT";
    }
  }
  // our local URLs from the domains below example.com don't need a proxy:
  for (var i = 0; i < directHosts.length; i++) {
    if (host == directHosts[i] || shExpMatch(host, "*." + directHosts[i])) {
      return "DIRECT";
    }
  }
  // All other requests go through port 8080 of proxy.example.com.
  // should that fail to respond, go directly to the WWW:
  return proxy;
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