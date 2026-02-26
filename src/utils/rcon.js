const net = require('net');

const SERVERDATA_AUTH = 3;
const SERVERDATA_EXECCOMMAND = 2;

let requestId = 1;

function buildPacket(id, type, body) {
  const bodyBuf = Buffer.from(body + '\0', 'utf8');
  const size = 4 + 4 + bodyBuf.length + 1;
  const buf = Buffer.alloc(4 + size);
  buf.writeInt32LE(size, 0);
  buf.writeInt32LE(id, 4);
  buf.writeInt32LE(type, 8);
  bodyBuf.copy(buf, 12);
  buf.writeUInt8(0, 12 + bodyBuf.length);
  return buf;
}

function parsePacket(buf) {
  if (buf.length < 14) return null;
  const size = buf.readInt32LE(0);
  if (buf.length < size + 4) return null;
  const id = buf.readInt32LE(4);
  const type = buf.readInt32LE(8);
  const body = buf.slice(12, size + 4 - 2).toString('utf8');
  return { size, id, type, body };
}

function sendRconCommand(command) {
  return new Promise((resolve, reject) => {
    const host = process.env.RCON_HOST || '127.0.0.1';
    const port = parseInt(process.env.RCON_PORT || '25575');
    const password = process.env.RCON_PASSWORD || '';

    if (!password) return reject(new Error('RCON_PASSWORD non configuré dans .env'));

    const socket = new net.Socket();
    let buffer = Buffer.alloc(0);
    let authenticated = false;
    const authId = requestId++;
    const cmdId = requestId++;

    socket.setTimeout(5000);

    socket.connect(port, host, () => {
      socket.write(buildPacket(authId, SERVERDATA_AUTH, password));
    });

    socket.on('data', (data) => {
      buffer = Buffer.concat([buffer, data]);
      while (buffer.length >= 14) {
        const packet = parsePacket(buffer);
        if (!packet) break;
        buffer = buffer.slice(packet.size + 4);
        if (!authenticated) {
          if (packet.id === -1) { socket.destroy(); return reject(new Error('RCON : Mot de passe incorrect')); }
          authenticated = true;
          socket.write(buildPacket(cmdId, SERVERDATA_EXECCOMMAND, command));
        } else {
          socket.destroy();
          resolve(packet.body);
        }
      }
    });

    socket.on('timeout', () => { socket.destroy(); reject(new Error('RCON : Timeout')); });
    socket.on('error', (err) => reject(new Error(`RCON : ${err.message}`)));
  });
}

module.exports = { sendRconCommand };