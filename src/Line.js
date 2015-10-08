/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    var PETUCHA = "(פ)";

    function newLine(spec) {
        var text = spec.text,
            verses = spec.verses,
            aliyot = spec.aliyot,
            isPetucha = text.indexOf(PETUCHA) !== -1;

        return {
            text: text,
            verses: verses,
            aliyot: aliyot,
            isPetucha: isPetucha
        };
    }

    Tikkun.Line = newLine;
}(window.Tikkun));
