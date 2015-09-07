/*jslint browser: true */

(function () {
    "use strict";

    var afterEach = window.afterEach,
        // beforeEach = window.beforeEach,
        describe = window.describe,
        expect = window.expect,
        it = window.it,
        ToolbarController = window.Tikkun.ToolbarController;

    describe("ToolbarController", function () {
        describe("new", function () {
            var sut;

            describe("parshiyot", function () {

                var parshiyot;

                afterEach(function () {
                    sut = null;
                });

                it("should be equal to input parshiyot", function () {
                    parshiyot = ["Bereshit", "Noach", "Lech Lecha"];
                    sut = new ToolbarController(parshiyot);

                    expect(sut.parshiyot()).toEqual(parshiyot);
                });

                it("should be equal to other input parshiyot", function () {
                    parshiyot = ["Bereshit", "Noach", "Lech Lecha", "Vayera"];
                    sut = new ToolbarController(parshiyot);

                    expect(sut.parshiyot()).toEqual(parshiyot);
                });
            });
            describe("isShowingAnnotations", function () {
                describe("when input as true", function () {
                    it("should be true", function () {
                        sut = new ToolbarController(null, true);

                        expect(sut.isShowingAnnotations()).toBe(true);
                    });
                });

                describe("when input as false", function () {
                    it("should be false", function () {
                        sut = new ToolbarController(null, false);

                        expect(sut.isShowingAnnotations()).toBe(false);
                    });
                });
            });
        });
    });
}());
