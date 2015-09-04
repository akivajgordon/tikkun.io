/*jslint browser: true */

(function () {
    "use strict";

    var afterEach = window.afterEach,
        beforeEach = window.beforeEach,
        describe = window.describe,
        expect = window.expect,
        it = window.it,
        TikkunColumnRow = window.TikkunColumnRow;

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
}());
