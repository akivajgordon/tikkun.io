/*jslint browser: true */

(function (Tikkun) {
    "use strict";

    function newReferenceSet(spec) {
        var start = spec.start,
            end = spec.end,
            containsReference = function (reference) {
                return !reference.isBeforeReference(start) && reference.isBeforeReference(end);
            };

        return Object.freeze({
            containsReference: containsReference
        });
    }

    Tikkun.ReferenceSet = newReferenceSet;
}(window.Tikkun));
