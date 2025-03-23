//Scenario: proxy first, ip or domain in list connect direct
var proxy = 'PROXY 127.0.0.1:1080; DIRECT;';

var directIPs = [
  ["192.168.0.0", "255.255.255.0"],
  ["192.168.1.0", "255.255.255.0"],
  ["10.0.1.0", "255.255.255.0"],
  ["172.16.0.0", "255.255.0.0"]
];

var directDomains = [
  "baidu.com",
  "tencent.com",
  "sina.com",
  "126.com",
  "163.com"
];

function FindProxyForURL(url, host) {
  if (host == "localhost" || host == "127.0.0.1") {
    return "DIRECT";
  }
  for (var i = 0; i < directIPs.length; i++) {
    if (isInNet(host, directIPs[i][0], directIPs[i][1])) {
      return "DIRECT";
    }
  }
  // our local URLs from the domains below example.com don't need a proxy:
  for (var i = 0; i < directDomains.length; i++) {
    if (shExpMatch(host, "*." + directDomains[i])) {
      return "DIRECT";
    }
  }
  if (shExpMatch(host, "*.google.com")) {
    return "PROXY 127.0.0.1:1080";
  }
  // All other requests go through port 8080 of proxy.example.com.
  // should that fail to respond, go directly to the WWW:
  return proxy;
}