/*jslint browser: true */

(function () {
    "use strict";

    var afterEach = window.afterEach,
        beforeEach = window.beforeEach,
        describe = window.describe,
        expect = window.expect,
        it = window.it,
        TikkunLineBreaker = window.TikkunLineBreaker;

    describe("Tikkun Line Breaker", function () {

        var verses = [
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",

            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        ],
            lineStart,
            nextLineStart,
            sut;

        beforeEach(function () {
            sut = new TikkunLineBreaker();
        });

        afterEach(function () {
            sut = null;
        });

        describe("when line starts at word 1 and next line starts at word 7", function () {
            describe("textFromVerses", function () {
                it("should be 1st 6 words", function () {
                    lineStart = {"b": 1, "c": 1, "v": 1, "w": 1};
                    nextLineStart = {"b": 1, "c": 1, "v": 1, "w": 7};

                    expect(sut.textFromVerses(verses, [lineStart, nextLineStart])).toBe("Lorem ipsum dolor sit amet, consectetur");
                });
            });
        });
        describe("when line starts at word 3 and next line starts at word 8", function () {
            describe("textFromVerses", function () {
                it("should be words 3 through 7", function () {
                    lineStart = {"b": 1, "c": 1, "v": 1, "w": 3};
                    nextLineStart = {"b": 1, "c": 1, "v": 1, "w": 8};

                    expect(sut.textFromVerses(verses, [lineStart, nextLineStart])).toBe("dolor sit amet, consectetur adipisicing");
                });
            });
        });

        describe("when line starts at word 15 and next line starts at next verse word 3", function () {
            describe("textFromVerses", function () {
                it("should be words 3 through end of first verse plus first two words of next verse", function () {
                    lineStart = {"b": 1, "c": 1, "v": 1, "w": 15};
                    nextLineStart = {"b": 1, "c": 1, "v": 2, "w": 3};

                    expect(sut.textFromVerses(verses, [lineStart, nextLineStart])).toBe("labore et dolore magna aliqua. Ut enim");
                });
            });
        });

        describe("when line starts at word 15 and next line starts at 3rd verse word 3", function () {
            describe("textFromVerses", function () {
                it("should be words 3 through end of first verse plus entire second verse plus first two words of 3rd verse", function () {
                    lineStart = {"b": 1, "c": 1, "v": 1, "w": 15};
                    nextLineStart = {"b": 1, "c": 1, "v": 3, "w": 3};

                    expect(sut.textFromVerses(verses, [lineStart, nextLineStart])).toBe("labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute");
                });
            });
        });
    });
}());
