# BugLog
My replacement for console.log
 

## Index
- [What is this?](#what-is-this)
- [Installation](#installing)
- [Using](#using)
- [Helpful Links](#helpful-links)


## What is this?
Easy debug code. :-)



 
## Installing
Good old NPM to the resuce! 

    npm install git+https://git@github.com/johnrnelson/BugLog.git --save
 
 
 
## Using
This is the easy way to test it out once you install it. 

    var buglog = require("buglog");

    var myconf= { 
        ShowDebugInfo:true,
        OnLog:function(LogRecord){
            // save LogRecord any way you want...
        }
    };
    var daLOG = buglog.Config(myconf);
    daLOG.Info('Ver:'+ process.version);


## Helpful Links
http://invisible-island.net/xterm/ctlseqs/ctlseqs.html

   