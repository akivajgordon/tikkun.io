/*jslint browser: true */
/*jslint nomen: true */

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

    window.Tikkun.TikkunColumnRow = TikkunColumnRow;
}());
