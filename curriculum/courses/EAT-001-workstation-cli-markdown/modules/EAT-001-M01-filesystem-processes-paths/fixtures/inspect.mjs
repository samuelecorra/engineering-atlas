import fs from 'node:fs';
import path from 'node:path';
const target = process.argv[2];
if (!target) { console.error('Fornire un path relativo alla cwd.'); process.exitCode = 2; }
else {
  try { console.log(fs.readFileSync(path.resolve(target), 'utf8').trim()); }
  catch (error) { console.error(error.code + ': verificare cwd e path; nessun file modificato.'); process.exitCode = 2; }
}
