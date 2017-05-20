let gulp = require('gulp');
let exec = require('child_process').execSync;

const output = { stdio: 'inherit' };
const envs = ['development', 'test', 'production'];

gulp.task('db:setup', function() {
  if (process.argv[3] === '--db') {
    console.log(`createdb mold_${process.argv[4]}`);
    exec(`dropdb --if-exists mold_${process.argv[4]}`, output);
    exec(`createdb mold_${process.argv[4]}`, output);
  } else {
    envs.map((env) => {
      console.log(`createdb mold_${env}`);
      exec(`dropdb --if-exists mold_${env}`, output);
      exec(`createdb mold_${env}`, output);
      console.log(`psql -d mold_${env} -c 'create extension "uuid-ossp"'`);
      exec(`psql -d mold_${env} -c 'create extension "uuid-ossp"'`, output);
    });
  }
});

gulp.task('db:drop', function() {
  if (process.argv[3] === '--db') {
    console.log(`dropdb --if-exists mold_${process.argv[4]}`);
    exec(`dropdb --if-exists mold_${process.argv[4]}`, output);
  } else {
    envs.map((env) => {
      console.log(`dropdb --if-exists mold_${env}`);
      exec(`dropdb --if-exists mold_${env}`, output);
    });
  }
});

gulp.task('reroll', function() {
  exec('sequelize db:migrate:undo:all', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});

gulp.task('reset', function() {
  if (process.argv[3] === '--db') {
    exec(`sequelize db:migrate:undo:all --env ${process.argv[4]} --migrations-path=./src/migrations --config=./src/config/config.json`, output);
    exec(`sequelize db:migrate --env ${process.argv[4]} --migrations-path=./src/migrations --config=./src/config/config.json`, output);
    exec(`sequelize db:seed:all --env ${process.argv[4]} --seeders-path=./src/seeders --config=./src/config/config.json`, output);
  } else {
    envs.forEach((env) => {
      exec(`sequelize db:migrate:undo:all --env ${env} --migrations-path=./src/migrations --config=./src/config/config.json`, output);
      exec(`sequelize db:migrate --env ${env} --migrations-path=./src/migrations --config=./src/config/config.json`, output);
      exec(`sequelize db:seed:all --env ${env} --seeders-path=./src/seeders --config=./src/config/config.json`, output);
    });
  }
});

gulp.task('initial-setup', function() {
  exec('sequelize db:migrate', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  exec('sequelize db:seed --seed seeders/20170310225649-initial-setup.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});
