/*jslint browser: true */

(function () {
    "use strict";

    function TikkunLineBreaker() {
    }

    TikkunLineBreaker.prototype.textFromVerses = function (verses, lineStarts) {

        var thisLine = lineStarts[0],
            nextLine = lineStarts[1],
            includedVerses = verses.slice(thisLine.v - 1, nextLine.v),
            allWords = includedVerses.join(" ").split(" "),
            lastVerseWordCount = verses[nextLine.v - 1].split(" ").length,
            trimmedWords = allWords.slice(thisLine.w - 1, allWords.length - (lastVerseWordCount - nextLine.w + 1));

        return trimmedWords.join(" ");
    };

    window.Tikkun.TikkunLineBreaker = TikkunLineBreaker;
}());
