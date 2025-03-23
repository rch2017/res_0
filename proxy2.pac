// Scenario: ova jumper（direct first, ip in list via proxy）
var proxy = 'PROXY 127.0.0.1:1080; DIRECT;';

var viaProxyHosts = [
  ["192.168.0.0", "255.255.255.0"],
  ["192.168.1.0", "255.255.255.0"],
  ["10.0.1.0", "255.255.255.0"],
  ["172.16.0.0", "255.255.0.0"]
];

function FindProxyForURL(url, host) {
  for (var i = 0; i < viaProxyHosts.length; i++) {
    var addr = viaProxyHosts[i];
    if (isInNet(host, addr[0], addr[1])) {
      return proxy;
    }
  }
  return "DIRECT";
}