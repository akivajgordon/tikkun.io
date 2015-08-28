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
