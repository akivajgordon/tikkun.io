/*jslint browser: true */

(function (angular) {
    "use strict";

    angular.module("tikkun")
        .filter("aliyotNames", function () {

            var aliyotStrings = [
                "ראשון",
                "שני",
                "שלישי",
                "רביעי",
                "חמישי",
                "ששי",
                "שביעי",
                "מפטיר"
            ];

            return function (aliyot) {
                return aliyot.filter(function (aliyah) {
                    return aliyah > 0 && aliyah <= aliyotStrings.length;
                }).map(function (aliyah) {
                    return aliyotStrings[aliyah - 1];
                });
            };
        })
        .filter("hebrewNumerals", function () {
            return function (verses) {
                function hebrewNumeralFromInteger(integer) {
                    var str = "",
                        letters = [
                            {"glyph": "א", "value": 1},
                            {"glyph": "ב", "value": 2},
                            {"glyph": "ג", "value": 3},
                            {"glyph": "ד", "value": 4},
                            {"glyph": "ה", "value": 5},
                            {"glyph": "ו", "value": 6},
                            {"glyph": "ז", "value": 7},
                            {"glyph": "ח", "value": 8},
                            {"glyph": "ט", "value": 9},
                            {"glyph": "י", "value": 10},
                            {"glyph": "כ", "value": 20},
                            {"glyph": "ל", "value": 30},
                            {"glyph": "מ", "value": 40},
                            {"glyph": "נ", "value": 50},
                            {"glyph": "ס", "value": 60},
                            {"glyph": "ע", "value": 70},
                            {"glyph": "פ", "value": 80},
                            {"glyph": "צ", "value": 90},
                            {"glyph": "ק", "value": 100},
                            {"glyph": "ר", "value": 200},
                            {"glyph": "ש", "value": 300},
                            {"glyph": "ת", "value": 400}
                        ];

                    integer %= 1000;

                    letters.reverse().forEach(function (letter) {
                        var letterValue = letter.value;
                        while (integer >= letterValue) {
                            if (integer === 15) {
                                str += "טו";
                                integer -= 15;
                            } else if (integer === 16) {
                                str += "טז";
                                integer -= 16;
                            } else {
                                str += letter.glyph;
                                integer -= letterValue;
                            }
                        }
                    });

                    return str;
                }

                return verses.map(hebrewNumeralFromInteger);
            };
        })
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
        })
        .filter("practiceMode", function () {

            function torahSideText(text) {
                return text.replace(/־/g, " ").replace(/\(פ\)/g, "").match(/[א-ת]|\s/g).join("").trim();
            }

            return function (text, shouldShowAnnotations) {
                return shouldShowAnnotations ? text : torahSideText(text);
            };
        });
}(window.angular || {}));
