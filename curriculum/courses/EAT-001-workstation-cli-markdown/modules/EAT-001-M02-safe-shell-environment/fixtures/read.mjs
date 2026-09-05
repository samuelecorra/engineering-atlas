import fs from 'node:fs';
if (process.argv.length !== 3) { console.error('Atteso esattamente un argomento path.'); process.exitCode = 2; }
else { try { console.log(fs.readFileSync(process.argv[2], 'utf8').trim()); } catch (e) { console.error(e.code); process.exitCode = 2; } }
