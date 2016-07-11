/*

    Quick test to make sure everything works. :-)
    
*/


var myconf = {
    RootFolder: __dirname,
    StackDepth: 3,
    ShowDebugInfo: true,
    OnLog: function(LogRecord) {
        return;
        console.log('================================================================================');
        console.log(LogRecord.Level);
        console.log('================================================================================');
    }
}

var buglog = require('./index');
var daLOG = buglog.Config(myconf, global);

// console.log(index)
function woot(argument) {
    // body...
    // daLOG.Info();

    daLOG.Info('INFO----Server using Node Version  ...');
    daLOG.Warn('Warn----');
    daLOG.Error('Error----');
    daLOG.Info(myconf);
    daLOG.Info('grrrr','wooot',myconf);


    // buglog.Level.Warn('Ver:', process.version);

    // function burp(argument) {
    //     // body...
    //     buglog.Level.Error('ERRRRRRRR');
    // }
  

};

woot()





process.exit(0);