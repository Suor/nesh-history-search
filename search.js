exports.postStart = function(context) {
    var repl = context.repl;
    var active = false;
    var phrase = '';
    var listeners;


    repl.inputStream.on("keypress", function onKeypress(char, key) {
        if (key && key.ctrl && !key.meta && !key.shift && key.name === "r") {
            if (!active) {
                active = true;
                phrase = '';
                // Unsubscribe other listeners
                listeners = repl.inputStream.listeners("keypress");
                listeners.forEach(function (func) {
                    if (func !== onKeypress) repl.inputStream.removeListener("keypress", func);
                });
            }
            if (phrase) search(true);
            display();
        } else if (active && key && key.name == "backspace") {
            if (phrase.length > 0) phrase = phrase.slice(0, -1);
            display();
        } else if (active && char && !/[\x00-\x1F]/.test(char)) {
            phrase += char;
            search();
            display();
        } else if (active) {
            active = false;
            repl.rli._refreshLine();
            listeners.forEach(function (func) {
                if (func !== onKeypress) {
                    repl.inputStream.on("keypress", func);
                    // Exit event should be processed by other listeners
                    func(char, key);
                }
            });
        }
    });


    function search(retry) {
        var hi = repl.rli.historyIndex;
        var start = hi === -1 ? 0: retry ? hi + 1 : hi;
        var found;

        for (var i = start; i < repl.rli.history.length; i++) {
            found = repl.rli.history[i].indexOf(phrase)
            if (found !== -1 && (!retry || repl.rli.history[i] !== repl.rli.line)) {
                repl.rli.historyIndex = i;
                repl.rli.cursor = found;
                break;
            }
        }
        if (repl.rli.historyIndex !== -1) {
            repl.rli.line = repl.rli.history[repl.rli.historyIndex];
        }
    }

    function display() {
        var invite = "(reverse-i-search)`" + phrase + "': ";

        repl.rli.output.clearLine();
        repl.rli.output.cursorTo(0);
        repl.rli.output.write(invite + repl.rli.line);
        repl.rli.output.cursorTo(invite.length + repl.rli.cursor);
    }
}
