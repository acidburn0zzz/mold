let gulp = require('gulp');
let Site = require('./models/orm').Site;
let ORM = require('./models/orm').ORM;
let exec = require('child_process').execSync;

gulp.task('initial-setup', function() {
  ORM.sync({force: true}).then(function() {
    Site.create({
      name: 'Mold',
      favicon: null,
      initialized: false,
      open_registration: false,
    });
  });
});

gulp.task('gen-ssl', function() {
  exec('openssl genpkey -algorithm RSA -out ssl/localhost-key.pem -pkeyopt rsa_keygen_bits:4096',
    (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  exec('openssl req -key ssl/localhost-key.pem -x509 -new -days 3650 -out ssl/localhost-cert.pem -subj "/C=NA/ST=NA/L=NA/O=NA/OU=NA/CN=localhost"',
    (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
});
