/*jslint browser: true */
/*jslint nomen: true */

(function () {
    "use strict";

    function BiblicalReference(book, chapter, verse) {
        this._book = book;
        this._chapter = chapter;
        this._verse = verse;
    }

    BiblicalReference.prototype.book = function () {
        return this._book;
    };

    BiblicalReference.prototype.chapter = function () {
        return this._chapter;
    };

    BiblicalReference.prototype.verse = function () {
        return this._verse;
    };

    window.BiblicalReference = BiblicalReference;
}());

(function () {
    "use strict";

    function TikkunColumnRow(text, verses, aliyot) {
        this._text = text;
        this._verses = verses;
        this._aliyot = aliyot;
    }

    TikkunColumnRow.prototype.text = function () {
        return this._text;
    };

    TikkunColumnRow.prototype.verses = function () {
        return this._verses;
    };

    TikkunColumnRow.prototype.aliyot = function () {
        return this._aliyot;
    };

    window.TikkunColumnRow = TikkunColumnRow;
}());

(function () {
    "use strict";

    function TikkunColumn(rows) {
        this._rows = rows;
    }

    TikkunColumn.prototype.rows = function () {
        return this._rows;
    };

    window.TikkunColumn = TikkunColumn;
}());

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

    window.TikkunLineBreaker = TikkunLineBreaker;
}());
