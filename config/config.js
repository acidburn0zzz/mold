let Database = {
  db: 'DB_NAME',
  admin: 'DB_ADMIN',
  pass: 'DB_PASSWORD',
}

let GoogleClient = {
  client_id: 'GOOGLE_CLIENT_ID',
  client_secret: 'GOOGLE_CLIENT_SECRET',
  callback_url: 'CALLBACK_URL',
}

let TLS = {
  key: 'ssl/localhost-key.pem',
  cert: 'ssl/localhost-cert.pem',
}

module.exports.TLS = TLS;
module.exports.Database = Database;
module.exports.GoogleClient = GoogleClient;
