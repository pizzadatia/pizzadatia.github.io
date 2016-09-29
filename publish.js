const { exec } = require('child_process');
const prompt = require('prompt-promise');


const execPromise = (command) => new Promise((resolve, reject) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    resolve();
  }).stdout.pipe(process.stdout);
});


execPromise('git add -A .')
  .then(() => prompt('Relatório de alterações:\n'))
  .then((answer) => execPromise(`git commit -a -m "${answer}"`))
  .then(() => execPromise('git push origin master'))
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
