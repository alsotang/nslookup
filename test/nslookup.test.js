var nslookup = require('..');
var should = require('should');
var validator = require('validator');

var fDomain = 'fxck.it';
var fIPs = ['66.6.44.4'];
var fMXIPs = [ 'mxdomain.qq.com' ];
var opendns = '208.67.222.222';
var dns114 = '114.114.114.114';

describe('test/nslookup.test.js', function () {
  it('should ok', function () {
    true.should.ok;
  });

  it('should work with callback', function (done) {
    nslookup(fDomain, function (err, addrs) {
      should.not.exists(err);
      addrs.should.eql(fIPs);
      done();
    });
  });

  it('should work with `end`', function (done) {
    nslookup(fDomain).end(function (err, addrs) {
      should.not.exists(err);
      addrs.should.eql(fIPs);
      done();
    });
  });

  it('should return more than one ip', function (done) {
    nslookup('baidu.com').end(function (err, addrs) {
      should.not.exists(err);
      addrs.length.should.above(1);
      addrs.forEach(function (addr) {
        validator.isIP(addr).should.ok;
      });
      done();
    });
  });

  it('should return mx record', function (done) {
    nslookup(fDomain).type('mx').end(function (err, addrs) {
      should.not.exists(err);
      addrs.should.eql(fMXIPs);
      done();
    });
  });

  it('should use other dns', function (done) {
    var lookup = nslookup(fDomain).server(dns114);
    lookup.serverAddr.should.eql(dns114);
    lookup.end(function (err, addrs) {
      addrs.should.eql(fIPs);
      done(err);
    });
  });

  it('should timeout', function (done) {
    nslookup(fDomain).timeout(3).end(function (err, addrs) {
      err.name.should.eql('NSLookupTimeoutError');
      err.message.should.eql('dns request exceed 3ms');
      done();
    });
  });
});