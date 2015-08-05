var dns = require('native-dns');

function makeError(name, msg) {
  var err = new Error(msg);
  err.name = 'NSLookup' + name + 'Error';
  return err;
}

function Lookup() {
  this.domainName = null;
  this.domainType = 'a';

  this.serverAddr = '8.8.8.8';
  this.serverPort = 53;
  this.serverType = 'udp';

  this._timeout = 3 * 1000;
}

Lookup.prototype.type = function (type) {
  type = type.toLowerCase();

  if (type === 'cname' || type === 'soa' || type === 'srv') {
    throw makeError('NotSupport', 'do not support type: ' + type);
  }

  this.domainType = type;
  return this;
};

Lookup.prototype.server = function (server) {
  if (typeof server === 'string') {
    this.serverAddr = server;
  }
  if (typeof server === 'object') {
    this.serverAddr = server.address;
    this.serverPort = server.port;
    this.serverType = server.type;
  }

  return this;
};

// ms
Lookup.prototype.timeout = function (timeout) {
  this._timeout = timeout;
  return this;
};

function extracterBuilder(type) {
  var prop = null;
  if ('a' === type) {
    prop = 'address';
  } else if ('mx' === type) {
    prop = 'exchange';
  } else if ('ns' === type || 'txt' === type) {
    prop = 'data';
  } else {
    prop = 'address';
  }
  return function (addr) {
    return addr[prop];
  };
}

Lookup.prototype.end = function (callback) {
  var self = this;
  var question = dns.Question({
    name: this.domainName,
    type: this.domainType,
  });
  var server = {
    address: this.serverAddr,
    port: this.serverPort,
    type: this.serverType,
  };
  var timeout = this._timeout;

  var req = dns.Request({
    question: question,
    server: server,
    timeout: timeout,
  });

  req.on('timeout', function () {
    callback(makeError('Timeout', 'dns request exceed ' + timeout + 'ms'));
  });

  req.on('message', function (err, answer) {
    if (err) {
      return callback(err);
    }
    var extracter = extracterBuilder(self.domainType);
    var addrs = answer.answer.map(function (a) {
      return extracter(a);
    });
    callback(null, addrs);
  });

  req.on('end', function () {
  });

  req.send();
};

exports = module.exports = function (name, callback) {
  var lookup = new Lookup();
  lookup.domainName = name;
  if (callback) {
    lookup.end(callback);
  }
  return lookup;
};


