/*
    Easy debug output to console in a readable manner. Make sure to report
    which script did it so you don't have to hunt that bad boy down...
*/

const EOL = '\r\n_______________________________________________________';


var buglogAPI = {
    //Color codes for the console...
    ColorCodes: {
        'bold': ['\x1B[1m', '\x1B[22m'],
        'italic': ['\x1B[3m', '\x1B[23m'],
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
        'yellow': ['\x1B[33m', '\x1B[39m']
    },
    ColorCode: function(TextColor, TextValue) {
        return buglogAPI.ColorCodes[TextColor][0] + TextValue + buglogAPI.ColorCodes[TextColor][1];
    },
    //Process and system info.....
    DebugInfo: function() {
        return '\r\nSystem Info.';
    },
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
                argsDisplay += '\r\n====\tARG#:' + argCntr + '\t====';
                if (typeof(ITEM) == 'string') {
                    argsDisplay += '\r\n' + ITEM;
                }
                else {
                    // var doh = ITEM.Arguments;
                    argsDisplay += '\r\n' + JSON.stringify(ITEM, null, "\t");
                };
                argCntr++;
            };
        }
        return argsDisplay;
    },
    Dressup: function(TypeOfDress, OutputValue) {
        var dressedOutput = '';

        if (TypeOfDress == 0) {
            dressedOutput = buglogAPI.ColorCode('white', new Date().toLocaleTimeString()) +
                ': ' + __line + '@' + __StringStack + ']' + OutputValue + EOL;

        }
        if (TypeOfDress == 1) {
            dressedOutput = buglogAPI.ColorCode('blue', new Date().toLocaleTimeString()) +
                ': ' + __line + '@' + __StringStack + ']' + OutputValue + EOL;

        };
        console.log(dressedOutput);
    }
};




 
var Level = {
    Info: function() {
        var argsDisplay = buglogAPI.InspectArgs(arguments);
        buglogAPI.Dressup(0, argsDisplay);
    },
    Warn: function() {
        var argsDisplay = buglogAPI.InspectArgs(arguments);
        buglogAPI.Dressup(1, argsDisplay);
    },
    Error: function() {
        var argsDisplay = buglogAPI.InspectArgs(arguments);
        buglogAPI.Dressup(2, argsDisplay);
    }
};

exports.Level = Level;


//=====

/*
    This is where the Magic Happens!!!!
*/
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
        return __stack[2].getLineNumber();
    }
});

Object.defineProperty(global, '__StringStack', {
    get: function(wtf) {
        var daStack = __stack[2];

        if (!daStack) {
            return 'Stack Count:' + __stack.length;
        }
        else {
            return daStack;
        };
    }
});