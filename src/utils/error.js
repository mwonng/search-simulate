const chalk = require("chalk");

module.exports = (message, exit) => {
  console.error(chalk.red(`Error: ${message}`));
  exit && process.exit(1);
};