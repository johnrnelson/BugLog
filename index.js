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
        if (Args2Inspect.length == 0) {
            LogRec.TrueArgs = [];
            // argsDisplay = buglogAPI.DebugInfo();
        }
        else {
            //we actually only get the first one and go from there.. :-)
            var trueArgs = Args2Inspect[0];
            LogRec.TrueArgs = trueArgs;
            for (var i = 0; i < trueArgs.length; i++) {
                var ITEM = trueArgs[i];

                if (trueArgs.length > 1) {
                    argsDisplay += '\r\n\t\t====\tARG#:' + argCntr + '\t====\r\n\t\t';
                }
                else {
                    argsDisplay += '\r\n\t\t'
                }
                if (typeof(ITEM) == 'string') {
                    argsDisplay += ITEM;
                }
                else {
                    try {

                        var jsSTR = JSON.stringify(ITEM, null, "\t");
                        argsDisplay += jsSTR.replace(/[\n]/g, '\n\t\t');

                    }
                    catch (errSerialize) {
                        argsDisplay += '';
                    }
                };
                argCntr++;
            };
        }
        LogRec.ArgsDisplay = argsDisplay;
    },
    //make me pretty....
    Dressup: function(TypeOfDress, StackRecord) {
        var dressedOutput = '';
        var ccs = buglogAPI.ColorCodes;
        var dtDisplay = ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.magenta, StackRecord.Stack.DT)) + '\t';
        var filePath = ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.blue, StackRecord.Stack.FL));


        if (TypeOfDress == LogLevels.Info) {
            dressedOutput = dtDisplay +
                'LINE#:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.Stack.LN)) +
                '   OBJECT:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.Stack.FN)) + '' +
                filePath +
                StackRecord.DebugDisplay +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.cyan, StackRecord.ArgsDisplay));
        }

        if (TypeOfDress == LogLevels.Warn) {
            dressedOutput = dtDisplay +
                ':   LINE#:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.Stack.LN)) +
                '   OBJECT:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.Stack.FN)) + '' +
                filePath +
                StackRecord.DebugDisplay +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.green, StackRecord.ArgsDisplay));
        }

        if (TypeOfDress == LogLevels.Error) {
            dressedOutput = dtDisplay +
                ':   LINE#:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.yellow, StackRecord.Stack.LN)) +
                '   OBJECT:' +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.red, StackRecord.Stack.FN)) + '' +
                filePath +
                StackRecord.DebugDisplay +
                ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.red, StackRecord.ArgsDisplay));
        };
        // return dressedOutput+'/t'+StackRecord.DebugDisplay;
        StackRecord.Display = dressedOutput;

    },
    WriteLog: function(LogEntry) {
        //If they want to persist it then this is their chance...
        // console.log(buglogAPI.DebugInfo()+'\r\n'+LogEntry.Display);
        console.log(LogEntry.Display);
        if (ConfigManager.ClientConfig.OnLog) {
            ConfigManager.ClientConfig.OnLog(LogEntry);
        }
    },
    InspectStack_OLD: function() {

        var st = {

        };
        try {
            st.DT = new Date().toLocaleTimeString();
            st.LN = '' + __line;
            st.FN = '' + __StringStack //make sure it's a good string..;
        }
        catch (errInspectStack) {
            st.err = errInspectStack;
        }
        return st;

    },
    GetStack: function(LogEntry) {
        try {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function(_, stack) {
                return stack;
            };
            var err = new Error;
            Error.captureStackTrace(err, arguments.callee);
            var stack = err.stack;
            Error.prepareStackTrace = orig;

            //Find where I am in the stack so I know what to report on...
            function findMe() {
                var fndStack = {};
                for (var s = 0; s < stack.length; s++) {
                    var st = stack[s];
                    var stLoc = stack[s] + ''; //quick cast...
                    var FunctionFileSep = stLoc.search(' ');
                    var fnName = stLoc.substr(0, FunctionFileSep);

                    var fileLoc = stLoc.substr(FunctionFileSep + 2, (stLoc.length + 1) - (FunctionFileSep + 2));

                    var filePathEOF = fileLoc.search(':');
                    var filePath = fileLoc.substr(0, filePathEOF);
                    
                    // console.log(__filename, filePath);
                    
                    
                    if (__filename == filePath) {
                        continue;
                    }
                    else {
                        fndStack = {
                            DT: new Date().toLocaleTimeString(),
                            LN: st.getLineNumber(),
                            FN: fnName,
                            FL: filePath.replace(ConfigManager.ClientConfig.RootFolder,'>')
                        };
                        break;
                    }; 
                    
                    
                };
                return fndStack;
            };
            LogEntry.Stack = findMe();
        }
        catch (errInspectStack) {
            LogEntry.err = errInspectStack;
        };
    },
    NewLog: function(LogArgs) {
        var dINFO = {};

        buglogAPI.GetStack(dINFO);
        buglogAPI.DebugInfo(dINFO);
        buglogAPI.InspectArgs(arguments, dINFO);
        return dINFO;
    }
};


var Level = {
    Info: function() {
        var dINFO = buglogAPI.NewLog(arguments);
        dINFO.Level = LogLevels.Info;

        buglogAPI.Dressup(LogLevels.Info, dINFO);
        buglogAPI.WriteLog(dINFO);
    },
    Warn: function() {
        var dINFO = buglogAPI.NewLog(arguments);
        dINFO.Level = LogLevels.Warn;
        buglogAPI.Dressup(LogLevels.Warn, dINFO);
        buglogAPI.WriteLog(dINFO);
    },
    Error: function() {
        var dINFO = buglogAPI.NewLog(arguments);
        dINFO.Level = LogLevels.Error;
        buglogAPI.Dressup(LogLevels.Error, dINFO);
        buglogAPI.WriteLog(dINFO);
    }
};

var ConfigManager = {
    ClientConfig: {}, //Set when you call this bad boy.. :-)

};
// console.log('****************************************************');

//If they give us a config then they can get our methods.. 
function Config(ConfigOptions, GLOBAL) {
    ConfigManager.ClientConfig = ConfigOptions;

    try {

    }
    catch (errUnableToDebug) {
        //This might happen when you first warm up!!!
        // console.log(errUnableToDebug)
    }


    return Level;
}


exports.Config = Config;

//=====
// var OurModDepthLevel = ConfigOptions.StackDepth;
var OurModDepthLevel = 3;
