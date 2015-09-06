/*jslint browser: true */
/*jslint nomen: true */

(function () {
    "use strict";

    function BiblicalReference(book, chapter, verse, word) {
        this._book = book;
        this._chapter = chapter;
        this._verse = verse;
        this._word = word || 1;
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

    BiblicalReference.prototype.word = function () {
        return this._word;
    };

    BiblicalReference.prototype.isBeforeReference = function (other) {

        if (this.book() < other.book()) {
            return true;
        }

        if (this.book() === other.book()) {

            if (this.chapter() < other.chapter()) {
                return true;
            }

            if (this.chapter() === other.chapter()) {

                if (this.verse() < other.verse()) {
                    return true;
                }

                if (this.verse() === other.verse()) {
                    return this.word() < other.word();
                }
            }
        }

        return false;
    };

    window.Tikkun.BiblicalReference = BiblicalReference;
}());
