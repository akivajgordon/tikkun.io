/*jslint browser: true */

(function (angular) {
    "use strict";

    angular.module("tikkun")
        .filter("range", function () {
            return function (verses) {
                if (!verses.length) {
                    return "";
                }

                if (verses.length === 1) {
                    return verses[0];
                }

                return verses[0] + "-" + verses[verses.length - 1];
            };
        });
}(window.angular || {}));
