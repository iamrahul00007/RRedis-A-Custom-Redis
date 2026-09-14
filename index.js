const net = require('net');
const Parser = require('redis-parser');
const store = {};

const server = net.createServer(connection => {
    console.log('Client connected:', connection.remoteAddress + ':' + connection.remotePort);

    connection.on('data', data => {
        const parser = new Parser({
            returnReply: (reply) => {
                console.log('Received:', reply);

                const command = reply[0];
                switch (command) {
                    case 'set': {
                        const key = reply[1];
                        const value = reply[2];
                        store[key] = value;
                        connection.write('+OK\r\n');
                    }
                    break;

                    case 'get': {
                        const key = reply[1];
                        const value = store[key];
                        if (!value) connection.write('$-1\r\n');
                        else connection.write(`$${value.length}\r\n${value}\r\n`);
                    }
                    break;

                    default:
                        connection.write('-ERR unknown command\r\n');
                }
            },
            returnError: (err) => {
                console.log('=>', err);
            }
        });

        parser.execute(data);
    });

    connection.on('close', () => {
        console.log('Client disconnected');
    });

    connection.on('error', (err) => {
        console.log('Connection error:', err);
    });

});

server.listen(6378, () => console.log('Custom Redis Server running on port 6378...'));