#!/usr/bin/env node

"use strict";


var exec = require('child_process').execFileSync;

function CommitFiles(proc, parms) {
    try {
        console.log(exec(proc, parms).toString())
    }
    catch (errComit) {
        //We can just ignore this stuff...
        // console.log('Proc error:' + proc,parms);
        // console.log(errComit);
    }
}


CommitFiles('git', ['add', 'GitCheckMeIn.js']);
CommitFiles('git', ['add', 'README.md']);
CommitFiles('git', ['add', 'index.js']);
CommitFiles('git', ['add', 'package.json']);
CommitFiles('git', ['add', 'test.js']);


CommitFiles('git', ['commit', '-a', '-m', 'Normal Updates...']);
CommitFiles('git', ['push', '-u', 'origin', 'master']);;

console.log('All done!');
process.exit(0);