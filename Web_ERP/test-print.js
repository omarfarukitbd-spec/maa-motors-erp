import { printStatement } from './src/statement-print.js';
console.log("Import successful!");
printStatement({}, 0, []).then(() => console.log("Execution successful")).catch(e => console.error("Error:", e));
