// 情景模式: 科学上网
// 在直连列表里的走直连，其它的按规则走
// 由于 Proxy Switcher 的 PAC Script 不支持代码中包含中文，所以这个文件只用于代码结构说明，实际使用见 proxy_[0|1|2].pac

// PAC 提供的内置函数:
//   dnsResolve(host)            : 将主机名解析为 IP 地址。
//   myIpAddress()               : 返回当前客户端的 IP 地址。
//   isInNet(host, pattern, mask): 检查一个主机是否在指定的网络中。
//   shExpMatch(str, pattern)    : 检查一个字符串是否匹配给定模式。

var proxy = 'SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080; DIRECT;';

var directHosts = [
    "localhost",
    "127.0.0.1",
    "10.0.1.0/24",
    "192.168.0.0/24",
    "192.168.1.0/24",
    "172.16.0.0/16"
];

var rules = [
    [
        [
            "__domestic__almost_used",
            "baidu.com"
        ],
        [
            "__oversea__almost_used",
            "google.com"
        ]
    ],
    [
        [
            "__domestic__"
        ],
        [
            "__oversea__",
            "facebook.com",
            "yahoo.com"
        ]
    ]
];

function FindProxyForURL(url, host) {
  for (var i = 0; i < directHosts.length; i++) {
    if (host == directHosts[i] || isInSubnet(host, directHosts[i])) {
      return "DIRECT";
    }
  }
  for (var i = 0; i < rules.length; i++) {
    ret = testRules(host, i);
    if (ret != undefined)
      return ret;
  }
  return 'DIRECT';
}

function testRules(host, index) {
  for (var i = 0; i < rules[index].length; i++) {
    for (var j = 0; j < rules[index][i].length; j++) {
      var lastRule = rules[index][i][j]
      if (host == lastRule || host.endsWith('.' + lastRule))
        return i % 2 == 0 ? 'DIRECT' : proxy;
    }
  }
}

function isInSubnet(ip, subnet) {
  var ipParts = ip.split('.').map(Number);
  var subnetParts = subnet.split('/')[0].split('.').map(Number);
  var maskBits = parseInt(subnet.split('/')[1], 10);
  // 计算子网掩码
  var mask = (0xFFFFFFFF << (32 - maskBits)) >>> 0;
  // 将 IP 地址和子网地址转换为整数
  var ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  var subnetInt = (subnetParts[0] << 24) | (subnetParts[1] << 16) | (subnetParts[2] << 8) | subnetParts[3];
  // 检查 IP 是否在子网内
  return (ipInt & mask) === (subnetInt & mask);
}

// REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}