/*jslint browser: true */

(function () {
    "use strict";

    var describe = window.describe,
        beforeEach = window.beforeEach,
        afterEach = window.afterEach,
        it = window.it,
        expect = window.expect,
        BiblicalReference = window.BiblicalReference;

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
}());
