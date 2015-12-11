/*

    Quick test to make sure everything works. :-)
    
*/

var myconf= {
    ok:1,
    OnLog:function(LogRecord){
        return;
        console.log('================================================================================');
        console.log(LogRecord);
        console.log('================================================================================');
    }
}

var buglog = require('./index');
var daLOG = buglog.Config(myconf);

// console.log(index)
function woot(argument) {
    // body...
    daLOG.Info();

    daLOG.Info('Server using Node Version  ...');


    // buglog.Level.Warn('Ver:', process.version);
    
    // function burp(argument) {
    //     // body...
    //     buglog.Level.Error('ERRRRRRRR');
    // }
    // burp();
    
};

woot();

 




process.exit(0);