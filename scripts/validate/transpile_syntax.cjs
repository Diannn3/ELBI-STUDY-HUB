const fs=require('fs'),path=require('path');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
let errors=0,files=0;
for(const f of walk('src').filter(x=>/\.tsx?$/.test(x))){files++;const source=fs.readFileSync(f,'utf8');const out=ts.transpileModule(source,{fileName:f,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}});for(const d of out.diagnostics||[]){if(d.category===ts.DiagnosticCategory.Error){errors++;console.error(`${f}: ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`)}}}
console.log(`Transpile syntax checked: ${files} files, ${errors} errors`);process.exitCode=errors?1:0;
