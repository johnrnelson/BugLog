/*
    Easy debug output to console in a readable manner. Make sure to report
    which script did it so you don't have to hunt that bad boy down...
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


exports.Output = function() {

    if (arguments.length == 0) {
        console.log('\r\nYou did not supply any arguments.');
        return;
    }
    var DateTimeDisplay = new Date().toLocaleTimeString();
    
    var argsDisplay = '';;
    var argCntr = 0;
    for (var i = 0; i < arguments.length; i++) {
        var ITEM = arguments[i];

        argsDisplay += '====\tARG#:' + argCntr + '\t====\r\n';
        if (typeof(ITEM) == 'string') {
            argsDisplay += ITEM + '\r\n';
        }
        else {
            argsDisplay += JSON.stringify(ITEM, null, "\t") + '\r\n';
        };
        argCntr++;

    };
    
    console.log(DateTimeDisplay + ': '+__line+'@' + __StringStack + ']\r\n'+argsDisplay+'\r\n');
};


//=====