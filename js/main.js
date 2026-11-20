import { startTerminal } from './term.js';

startTerminal().catch((err) => {
  console.error(err);
  document.getElementById('term').textContent = 'Failed to start the terminal: ' + err.message;
});
