
/*
    Easy debug output to console in a readable manner. Make sure to report
    which script did it so you don't have to hunt that bad boy down...
*/

const EOL = '\r\n<<______________________________________>>';

const LogLevels = {
    Info:0,
    Warn:1,
    Error:2,
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
    DebugInfo: function() {
        return '\r\nSystem Info.';
    },
    //Loop through the args and figure out what to display...
    InspectArgs: function(Args2Inspect) {

        var argsDisplay = '';
        var argCntr = 0;
        var trueArgs = arguments[0];
        if (trueArgs.length == 0) {
            argsDisplay = buglogAPI.DebugInfo();
        }
        else {
            //we actually only get the first one and go from there.. :-)
            var trueArgs = arguments[0];
            for (var i = 0; i < trueArgs.length; i++) {
                var ITEM = trueArgs[i];
                if(trueArgs.length>1){
                    argsDisplay += '\r\n====\tARG#:' + argCntr + '\t====';
                }
                if (typeof(ITEM) == 'string') {
                    argsDisplay += '\r\n' + ITEM;
                }
                else {
                    argsDisplay += '\r\n' + JSON.stringify(ITEM, null, "\t");
                };
                argCntr++;
            };
        }
        return argsDisplay;
    },
    InspectStack:function () {
        return {
            DT:new Date().toLocaleTimeString(),
            LN:''+__line,
            FN:''+__StringStack //make sure it's a good string...
        }
    },
    //make me pretty....
    Dressup: function(TypeOfDress, StackRecord) {
        var dressedOutput = ''; 
        var ccs = buglogAPI.ColorCodes;

        
        if (TypeOfDress == LogLevels.Info) {
            dressedOutput = ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.magenta, StackRecord.DT)) +
                ':   LINE#:' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.yellow, StackRecord.LN)) + 
                 '   OBJECT:' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.yellow, StackRecord.FN))
                 + '' + 
                 ccs._.UserColor(ccs.grey,StackRecord.ARGS) + EOL;
        }
        
        if (TypeOfDress == LogLevels.Warn) {
            dressedOutput = ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.magenta, StackRecord.DT)) +
                ':   LINE#:' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.yellow, StackRecord.LN)) + 
                 '   OBJECT:' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.yellow, StackRecord.FN))
                 + '' + 
                 ccs._.UserColor(ccs.white,StackRecord.ARGS) + EOL;
        }

        if (TypeOfDress == LogLevels.Error) {
            dressedOutput = ccs._.UserColor(ccs.bold, ccs._.UserColor(ccs.magenta, StackRecord.DT)) +
                ':   LINE#:' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.yellow, StackRecord.LN)) + 
                 '   OBJECT:' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.red, StackRecord.FN))
                 + '' + 
                 ccs._.UserColor(ccs.bold,ccs._.UserColor(ccs.red,StackRecord.ARGS) + EOL);
        }; 
        return dressedOutput;
    },
    WriteLog:function (LogEntry) {
        // console.log(LogEntry);
        console.log(LogEntry.Display);
    }
};


var Level = {
    Info: function() {
        var dINFO = buglogAPI.InspectStack();
        dINFO.ARGS = buglogAPI.InspectArgs(arguments);
        dINFO.Display = buglogAPI.Dressup(LogLevels.Info, dINFO);
        buglogAPI.WriteLog(dINFO);
    },
    Warn: function() {
        var dINFO = buglogAPI.InspectStack();
        dINFO.ARGS = buglogAPI.InspectArgs(arguments);
        dINFO.Display = buglogAPI.Dressup(LogLevels.Warn, dINFO);
        buglogAPI.WriteLog(dINFO);
    },
    Error: function() {
        var dINFO = buglogAPI.InspectStack();
        dINFO.ARGS = buglogAPI.InspectArgs(arguments);
        dINFO.Display = buglogAPI.Dressup(LogLevels.Error, dINFO);
        buglogAPI.WriteLog(dINFO);
    }
};

exports.Level = Level;


//=====

/*
    This is where the Magic Happens!!!!
*/
var OurModDepthLevel = 3;
Object.defineProperty(global, '__stack', {
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

Object.defineProperty(global, '__line', {
    get: function() {
        //If you work on buglog this number may change depending on 
        //how you set it up...
        return __stack[OurModDepthLevel].getLineNumber();
    }
});

Object.defineProperty(global, '__StringStack', {
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