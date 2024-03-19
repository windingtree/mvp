/* eslint-disable no-undef */
let env, address, port, id;

const args = process.argv.slice(2);

// Parse arguments
for (let i = 0; i < args.length; i += 2) {
  const name = args[i].replace(/-/g, '');
  const value = args[i + 1];

  switch (name) {
    case 'env':
      env = value;
      break;
    case 'address':
      address = value;
      break;
    case 'port':
      port = value;
      break;
    case 'id':
      id = value;
      break;
    default:
      throw new Error(`Unknown argument "${name}"`);
  }
}

if (env === 'local') {
  console.log(
    `/ip4/${address ?? '127.0.0.1'}/tcp/${port ?? 33333}/ws/p2p/${id}`,
  );
} else {
  console.log(`/dns4/${address}/tcp/443/wss/p2p/${id}`);
}
