const { stdin } = process;
const fs = require('fs');
const path = require('path');
const textFile = path.join(__dirname, 'text.txt');

console.log('Здаровеньки');
console.log('Чего изволишь записать?');

fs.writeFile(
  textFile,
  '',
  (err) => {
    if (err) throw err;
  }
);

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  fs.appendFile(
    textFile,
    data,
    (err) => {
      if (err) throw err;
    }
  );
});

process.on('exit', () => {
  console.log('Он улетел, но обещал вернутся!');
});

process.on('SIGINT', () => {
  process.exit();
});
