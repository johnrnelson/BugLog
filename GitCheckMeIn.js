#!/usr/bin/env node

"use strict";


var exec = require('child_process').execFileSync;
var fs = require('fs');

function CommitFiles(proc, parms) {
   
    try {
        console.log(exec(proc, parms).toString())
    }
    catch (errComit) {
        //We can just ignore this stuff...
        console.log('Proc error:' + proc,parms);
        // console.log(errComit);
    }
}

function UpVersionNumber() {
    var flName = './package.json';
    var obj = JSON.parse(fs.readFileSync(flName, 'utf8'));
    console.log('Old Version:',obj.version);
    var ver = obj.version.split('.');
    var nextVer = parseInt(ver[2])+1;
    
    obj.version = ver[0]+'.'+ver[1]+'.'+nextVer;
    console.log('New Version:',obj.version);
    fs.writeFileSync(flName,JSON.stringify(obj))
}

UpVersionNumber();


CommitFiles('git', ['add', 'GitCheckMeIn.js']);
CommitFiles('git', ['add', 'README.md']);
CommitFiles('git', ['add', 'index.js']);
CommitFiles('git', ['add', 'package.json']);
CommitFiles('git', ['add', 'test.js']);


CommitFiles('git', ['commit', '-a', '-m', 'Normal Updates...']);
CommitFiles('git', ['push', '-u', 'origin', 'master']);;

console.log('All done!');
process.exit(0);