/*jslint browser: true */

(function () {
    "use strict";

    var describe = window.describe,
        beforeEach = window.beforeEach,
        afterEach = window.afterEach,
        it = window.it,
        expect = window.expect,
        BiblicalReference = window.BiblicalReference,
        TikkunColumnRow = window.TikkunColumnRow,
        TikkunColumn = window.TikkunColumn,
        TikkunLineBreaker = window.TikkunLineBreaker;

    describe("Biblical Reference", function () {

        var sut;

        afterEach(function () {
            sut = null;
        });

        describe("when creating a new Biblical Reference with Book 1, Chapter 1, Verse 1, Word 1", function () {
            beforeEach(function () {
                sut = new BiblicalReference(1, 1, 1, 1);
            });

            describe("book", function () {
                it("should be 1", function () {
                    expect(sut.book()).toBe(1);
                });
            });

            describe("chapter", function () {
                it("should be 1", function () {
                    expect(sut.chapter()).toBe(1);
                });
            });

            describe("verse", function () {
                it("should be 1", function () {
                    expect(sut.verse()).toBe(1);
                });
            });

            describe("word", function () {
                it("should be 1", function () {
                    expect(sut.word()).toBe(1);
                });
            });
        });

        describe("when creating a new Biblical Reference with Book 2, Chapter 3, Verse 4, Word 2", function () {
            beforeEach(function () {
                sut = new BiblicalReference(2, 3, 4, 2);
            });

            describe("book", function () {
                it("should be 2", function () {
                    expect(sut.book()).toBe(2);
                });
            });

            describe("chapter", function () {
                it("should be 3", function () {
                    expect(sut.chapter()).toBe(3);
                });
            });

            describe("verse", function () {
                it("should be 4", function () {
                    expect(sut.verse()).toBe(4);
                });
            });

            describe("word", function () {
                it("should be 2", function () {
                    expect(sut.word()).toBe(2);
                });
            });
        });

        describe("when word is not provided", function () {
            describe("word", function () {
                it("should be 1", function () {
                    sut = new BiblicalReference(1, 1, 1);
                    expect(sut.word()).toBe(1);
                });
            });
        });

        describe("isBeforeReference", function () {

            var other;

            describe("reference in the next book", function () {
                it("should return true", function () {
                    sut = new BiblicalReference(1);
                    other = new BiblicalReference(2);

                    expect(sut.isBeforeReference(other)).toBe(true);
                });
            });

            describe("reference in the previous book", function () {
                it("should return true", function () {
                    sut = new BiblicalReference(2);
                    other = new BiblicalReference(1);

                    expect(sut.isBeforeReference(other)).toBe(false);
                });
            });

            describe("reference in same book", function () {
                describe("and next chapter", function () {
                    it("should return true", function () {
                        sut = new BiblicalReference(1, 1);
                        other = new BiblicalReference(1, 2);

                        expect(sut.isBeforeReference(other)).toBe(true);
                    });
                });

                describe("and previous chapter", function () {
                    it("should return false", function () {
                        sut = new BiblicalReference(1, 2);
                        other = new BiblicalReference(1, 1);

                        expect(sut.isBeforeReference(other)).toBe(false);
                    });
                });

                describe("and same chapter", function () {
                    describe("and next verse", function () {
                        it("should return true", function () {
                            sut = new BiblicalReference(1, 1, 1);
                            other = new BiblicalReference(1, 1, 2);

                            expect(sut.isBeforeReference(other)).toBe(true);
                        });
                    });
                    describe("and previous verse", function () {
                        it("should return false", function () {
                            sut = new BiblicalReference(1, 1, 2);
                            other = new BiblicalReference(1, 1, 1);

                            expect(sut.isBeforeReference(other)).toBe(false);
                        });
                    });

                    describe("and same verse", function () {
                        describe("and next word", function () {
                            it("should return true", function () {
                                sut = new BiblicalReference(1, 1, 1, 1);
                                other = new BiblicalReference(1, 1, 1, 2);

                                expect(sut.isBeforeReference(other)).toBe(true);
                            });
                        });

                        describe("and previous word", function () {
                            it("should return false", function () {
                                sut = new BiblicalReference(1, 1, 1, 2);
                                other = new BiblicalReference(1, 1, 1, 1);

                                expect(sut.isBeforeReference(other)).toBe(false);
                            });
                        });
                    });
                });
            });
        });
    });

    describe("Tikkun Column Row", function () {

        var sut;

        afterEach(function () {
            sut = null;
        });

        describe("when text is 'Lorem ipsum dolor', verses is [1], aliyot is [1]", function () {

            beforeEach(function () {
                sut = new TikkunColumnRow("Lorem ipsum dolor", [1], [1]);
            });

            describe("text", function () {
                it("should be 'Lorem ipsum dolor'", function () {
                    expect(sut.text()).toBe("Lorem ipsum dolor");
                });
            });

            describe("verses", function () {
                it("should equal [1]", function () {
                    expect(sut.verses()).toEqual([1]);
                });
            });

            describe("aliyot", function () {
                it("should equal [1]", function () {
                    expect(sut.aliyot()).toEqual([1]);
                });
            });
        });

        describe("when text is 'Sit amet adipiscing', verses is [2, 3], aliyot is [3, 2]", function () {

            beforeEach(function () {
                sut = new TikkunColumnRow("Sit amet adipiscing", [2, 3], [3, 2]);
            });

            describe("text", function () {
                it("should be 'Sit amet adipiscing'", function () {
                    expect(sut.text()).toBe("Sit amet adipiscing");
                });
            });

            describe("verses", function () {
                it("should equal [2, 3]", function () {
                    expect(sut.verses()).toEqual([2, 3]);
                });
            });

            describe("aliyot", function () {
                it("should equal [3, 2]", function () {
                    expect(sut.aliyot()).toEqual([3, 2]);
                });
            });
        });
    });

    describe("Tikkun Column", function () {
        describe("when creating a Tikkun Column with rows", function () {
            describe("rows", function () {
                it("should be identical to input rows", function () {
                    var rows = [new TikkunColumnRow(), new TikkunColumnRow(), new TikkunColumnRow()],
                        sut = new TikkunColumn(rows);

                    expect(sut.rows()).toEqual(rows);
                });
            });
        });
    });

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
