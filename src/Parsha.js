/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    function newParsha(spec) {
        var startReference = spec.startReference,
            hebrewName = spec.hebrewName,
            positionInBook = spec.positionInBook;

        return {
            startReference: startReference,
            hebrewName: hebrewName,
            positionInBook: positionInBook
        };
    }

    Tikkun.Parsha = newParsha;
}(window.Tikkun));
