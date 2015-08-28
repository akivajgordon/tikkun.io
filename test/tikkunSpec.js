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
        TikkunColumn = window.TikkunColumn;

    describe("Biblical Reference", function () {

        var sut;

        afterEach(function () {
            sut = null;
        });

        describe("when creating a new Biblical Reference with Book 1, Chapter 1, Verse 1", function () {
            beforeEach(function () {
                sut = new BiblicalReference(1, 1, 1);
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
        });

        describe("when creating a new Biblical Reference with Book 2, Chapter 3, Verse 4", function () {
            beforeEach(function () {
                sut = new BiblicalReference(2, 3, 4);
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
}());
