/*
    Easy debug output to console in a readable manner. Make sure to report
    which script did it so you don't have to hunt that bad boy down...
*/

// const EOL = '\r\n<<______________________________________>>';
var os = require('os');
const LogLevels = {
    Info: 0,
    Warn: 1,
    Error: 2,
};
var buglogAPI = {
    //Color codes for the console...
    ColorCodes: {
        'bold': ['\x1B[1m', '\x1B[22m'],
        'italic': ['\x1B[3m', '\x1B[23m'], //never really works right...
        'underline': ['\x1B[4m', '\x1B[24m'],
        'inverse': ['\x1B[7m', '\x1B[27m'],
        'strikethrough': ['\x1B[9m', '\x1B[29m'],
        //grayscale
        'white': ['\x1B[37m', '\x1B[39m'],
        'grey': ['\x1B[90m', '\x1B[39m'],
        'black': ['\x1B[30m', '\x1B[39m'],
        //colors
        'blue': ['\x1B[34m', '\x1B[39m'],
        'cyan': ['\x1B[36m', '\x1B[39m'],
        'green': ['\x1B[32m', '\x1B[39m'],
        'magenta': ['\x1B[35m', '\x1B[39m'],
        'red': ['\x1B[31m', '\x1B[39m'],
        'yellow': ['\x1B[33m', '\x1B[39m'],
        _: {

            UserColor: function(TextColor, TextValue) {

                // return buglogAPI.ColorCodes[TextColor][0] + TextValue + buglogAPI.ColorCodes[TextColor][1];


                return TextColor[0] + TextValue + TextColor[1];
            },
        }
    },
    //Process and system info.....
    DebugInfo: function(LogRec) {

        var ccs = buglogAPI.ColorCodes;
        if (!ConfigManager.ClientConfig.ShowDebugInfo) {
            LogRec.DebugDisplay = '';
        }
        else {
            LogRec.MemUse = process.memoryUsage();
            LogRec.FreeMem = os.freemem();
            LogRec.Total = os.totalmem();
            LogRec.DebugDisplay = '\r\n\t\t' +
                ccs._.UserColor(ccs.yellow, '') +
                ccs._.UserColor(ccs.cyan, 'RSS:') +
                ccs._.UserColor(ccs.blue, '[') +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.white, LogRec.MemUse.rss)) +
                ccs._.UserColor(ccs.blue, ']') +

                ccs._.UserColor(ccs.cyan, '  HEAPTOTAL:') +
                ccs._.UserColor(ccs.blue, '[') +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.white, LogRec.MemUse.heapTotal)) +
                ccs._.UserColor(ccs.blue, ']') +
                ccs._.UserColor(ccs.cyan, '  HEAPUSED:') +
                ccs._.UserColor(ccs.blue, '[') +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.white, LogRec.MemUse.heapUsed)) +
                ccs._.UserColor(ccs.blue, ']') +
                ccs._.UserColor(ccs.yellow, '  Free:') +
                ccs._.UserColor(ccs.blue, '[') +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.white, LogRec.FreeMem)) +
                ccs._.UserColor(ccs.yellow, ']') +
                ccs._.UserColor(ccs.yellow, '  Total:') +
                ccs._.UserColor(ccs.blue, '[') +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.white, LogRec.Total)) +
                ccs._.UserColor(ccs.yellow, ']') +
                '';
        };
    },


    //Loop through the args and figure out what to display...
    InspectArgs: function(Args2Inspect, LogRec) {

        var argsDisplay = '';
        var argCntr = 0;
        var trueArgs = arguments[0];
        if (trueArgs.length == 0) {
            LogRec.TrueArgs = [];
            // argsDisplay = buglogAPI.DebugInfo();
        }
        else {
            //we actually only get the first one and go from there.. :-)
            var trueArgs = arguments[0];
            LogRec.TrueArgs = trueArgs;
            for (var i = 0; i < trueArgs.length; i++) {
                var ITEM = trueArgs[i];

                if (trueArgs.length > 1) {
                    argsDisplay += '\r\n\t\t====\tARG#:' + argCntr + '\t====\r\n';
                }
                if (typeof(ITEM) == 'string') {
                    argsDisplay += '\r\n\t\t' + ITEM;
                }
                else {
                    var jsSTR = '\t\t' + JSON.stringify(ITEM, null, "\t");
                    argsDisplay += jsSTR.replace(/[\n]/g, '\n\t\t');
                    // argsDisplay += '\r\n' + JSON.stringify(ITEM, null, "\t");
                };
                argCntr++;
            };
        }
        LogRec.ArgsDisplay = argsDisplay;
        // return argsDisplay;
    },
    InspectStack: function() {
        return {
            DT: new Date().toLocaleTimeString(),
            LN: '' + __line,
            FN: '' + __StringStack //make sure it's a good string...
        }
    },
    //make me pretty....
    Dressup: function(TypeOfDress, StackRecord) {
        var dressedOutput = '';
        var ccs = buglogAPI.ColorCodes;
        var dtDisplay = ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.magenta, StackRecord.DT)) + '\t';


        if (TypeOfDress == LogLevels.Info) {
            dressedOutput = dtDisplay +
                'LINE#:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.LN)) +
                '   OBJECT:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.FN)) + '' +
                StackRecord.DebugDisplay +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.cyan, StackRecord.ArgsDisplay));
        }

        if (TypeOfDress == LogLevels.Warn) {
            dressedOutput = dtDisplay +
                ':   LINE#:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.LN)) +
                '   OBJECT:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.FN)) + '' +
                StackRecord.DebugDisplay +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.green, StackRecord.ArgsDisplay));
        }

        if (TypeOfDress == LogLevels.Error) {
            dressedOutput = dtDisplay +
                ':   LINE#:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.LN)) +
                '   OBJECT:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.red, StackRecord.FN)) + '' +
                StackRecord.DebugDisplay +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.red, StackRecord.ArgsDisplay));
        };
        // return dressedOutput+'/t'+StackRecord.DebugDisplay;
        return dressedOutput;
    },
    WriteLog: function(LogEntry) {
        //If they want to persist it then this is their chance...
        // console.log(buglogAPI.DebugInfo()+'\r\n'+LogEntry.Display);
        console.log(LogEntry.Display);
        if (ConfigManager.ClientConfig.OnLog) {
            ConfigManager.ClientConfig.OnLog(LogEntry);
        }
    }
};


var Level = {
    Info: function() {
        var dINFO = buglogAPI.InspectStack();
        buglogAPI.DebugInfo(dINFO);
        buglogAPI.InspectArgs(arguments, dINFO);
        dINFO.Display = buglogAPI.Dressup(LogLevels.Info, dINFO);
        buglogAPI.WriteLog(dINFO);
    },
    Warn: function() {
        var dINFO = buglogAPI.InspectStack();
        buglogAPI.DebugInfo(dINFO);
        buglogAPI.InspectArgs(arguments, dINFO);
        dINFO.Display = buglogAPI.Dressup(LogLevels.Warn, dINFO);
        buglogAPI.WriteLog(dINFO);
    },
    Error: function() {
        var dINFO = buglogAPI.InspectStack();
        buglogAPI.DebugInfo(dINFO);
        buglogAPI.InspectArgs(arguments, dINFO);
        dINFO.Display = buglogAPI.Dressup(LogLevels.Error, dINFO);
        buglogAPI.WriteLog(dINFO);
    }
};

var ConfigManager = {
    ClientConfig: {}, //Set when you call this bad boy.. :-)

}

//If they give us a config then they can get our methods.. 
function Config(ConfigOptions, GLOBAL) {
    ConfigManager.ClientConfig = ConfigOptions;

    try {

        /*
            This is where the Magic Happens!!!!
        */
        var OurModDepthLevel = 3;
        
      
        
        Object.defineProperty(GLOBAL, '__stack', {
            get: function() {
                var orig = Error.prepareStackTrace;
                Error.prepareStackTrace = function(_, stack) {
                    return stack;
                };
                var err = new Error;
                Error.captureStackTrace(err, arguments.callee);
                var stack = err.stack;
                Error.prepareStackTrace = orig;
                return stack;
            }
        });

        Object.defineProperty(GLOBAL, '__line', {
            get: function() {
                //If you work on buglog this number may change depending on 
                //how you set it up...
                return __stack[OurModDepthLevel].getLineNumber();
            }
        });

        Object.defineProperty(GLOBAL, '__StringStack', {
            get: function() {
                var daStack = __stack[OurModDepthLevel];

                if (!daStack) {
                    return 'Stack Count:' + __stack.length;
                }
                else {
                    return daStack;
                };
            }
        });


    }
    catch (errUnableToDebug) {
        //This might happen when you first warm up!!!
        // console.log(errUnableToDebug)
    }


    return Level;
}


exports.Config = Config;

//=====
