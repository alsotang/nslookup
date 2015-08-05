# nslookup

[![Build Status](https://travis-ci.org/alsotang/nslookup.svg?branch=master)](https://travis-ci.org/alsotang/nslookup)

## install

`npm install nslookup`

## quick example

```js
nslookup('fxck.it')
  .server('8.8.8.8') // default is 8.8.8.8
  .type('mx') // default is 'a'
  .timeout(10 * 1000) // default is 3 * 1000 ms
  .end(function (err, addrs) {
    console.log(addrs); // => ['66.6.44.4']
  });
```

## API

### nslookup

`nslookup(domain)` and chain with methods

`nslookup(domain, function (err, addrs))`. Simply query `a` type and use `8.8.8.8`.

### .server(server)

String or Object

String: `.server(8.8.8.8)`

Object: `.server({ address: '8.8.8.8', port: 53, type: 'udp' })`

### .type(type)

here can be `mx` or `a` or `ns`

e.g.: `.type('ns')`

### .timeout(timeout)

default is 3 * 1000 ms.

if timeout, then the `NSLookupTimeoutError` error would be callback.

`.timeout(3 * 1000)`

### .end(callback)

`callback = function (err, addrs)`

`addrs` is an Array

### TODO

