// 默认走直连, 列表里的IP和域名走代理
var proxy = 'PROXY 127.0.0.1:1080; DIRECT;';

var viaProxyHosts = [
  ["192.168.0.0", "255.255.255.0"],
  ["192.168.1.0", "255.255.255.0"],
  ["10.0.1.0", "255.255.255.0"],
  ["172.16.0.0", "255.255.0.0"]
];

function FindProxyForURL(url, host) {
  for (var i = 0; i < viaProxyHosts.length; i++) {
    var addr = viaProxyHosts[i]
    if (isInNet(host, addr[i][0], addr[i][1])) {
      return proxy;
    }
  }
  return DIRECT;
}