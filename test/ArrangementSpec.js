/*jslint browser: true */

(function () {
    "use strict";

    var afterEach = window.afterEach,
        Arrangement = window.Tikkun.Arrangement,
        beforeEach = window.beforeEach,
        BiblicalReference = window.Tikkun.BiblicalReference,
        describe = window.describe,
        expect = window.expect,
        it = window.it;

    describe("Arrangement", function () {

        describe("new Arrangement", function () {
            describe("lineStarts", function () {
                var lineStarts, sut;

                it("should equal input", function () {
                    lineStarts = [
                        [
                            {"b": 1, "c": 1, "v": 1, "w": 1},
                            {"b": 1, "c": 1, "v": 1, "w": 6},
                            {"b": 1, "c": 1, "v": 2, "w": 3}
                        ],
                        [
                            {"b": 1, "c": 1, "v": 3, "w": 3},
                            {"b": 1, "c": 2, "v": 1, "w": 2},
                            {"b": 1, "c": 2, "v": 2, "w": 1}
                        ],
                        [
                            {"b": 1, "c": 3, "v": 1, "w": 1},
                            {"b": 2, "c": 1, "v": 1, "w": 1},
                            {"b": 2, "c": 1, "v": 3, "w": 5}
                        ]
                    ];
                    sut = new Arrangement(lineStarts);

                    expect(sut.lineStarts()).toEqual(lineStarts);
                });

                it("should equal different input", function () {
                    lineStarts = [
                        [
                            {"b": 1, "c": 1, "v": 1, "w": 1},
                            {"b": 1, "c": 1, "v": 1, "w": 6},
                            {"b": 1, "c": 1, "v": 2, "w": 3}
                        ],
                        [
                            {"b": 1, "c": 1, "v": 3, "w": 3},
                            {"b": 1, "c": 2, "v": 1, "w": 2},
                            {"b": 1, "c": 2, "v": 2, "w": 1}
                        ],
                        [
                            {"b": 1, "c": 3, "v": 1, "w": 1},
                            {"b": 2, "c": 1, "v": 1, "w": 1},
                            {"b": 2, "c": 1, "v": 3, "w": 6}
                        ]
                    ];
                    sut = new Arrangement(lineStarts);

                    expect(sut.lineStarts()).toEqual(lineStarts);
                });
            });
        });

        describe("columnForBiblicalReference", function () {

            var sut,
                lineStarts = [
                    [
                        {"b": 1, "c": 1, "v": 1, "w": 1},
                        {"b": 1, "c": 1, "v": 1, "w": 6},
                        {"b": 1, "c": 1, "v": 2, "w": 3}
                    ],
                    [
                        {"b": 1, "c": 1, "v": 3, "w": 3},
                        {"b": 1, "c": 2, "v": 1, "w": 2},
                        {"b": 1, "c": 2, "v": 2, "w": 1}
                    ],
                    [
                        {"b": 1, "c": 3, "v": 1, "w": 1},
                        {"b": 2, "c": 1, "v": 1, "w": 1},
                        {"b": 2, "c": 1, "v": 3, "w": 6}
                    ]
                ];

            beforeEach(function () {
                sut = new Arrangement(lineStarts);
            });

            afterEach(function () {
                sut = null;
            });

            describe("when biblical reference is in 1st column", function () {
                it("should be 0", function () {
                    expect(sut.columnIndexForBiblicalReference(new BiblicalReference(1, 1, 1))).toBe(0);
                });
            });

            describe("when biblical reference is in 2nd column", function () {
                it("should be 1", function () {
                    expect(sut.columnIndexForBiblicalReference(new BiblicalReference(1, 2, 1))).toBe(1);
                });
            });

            describe("when other biblical reference is in 2nd column", function () {
                it("should be 1", function () {
                    expect(sut.columnIndexForBiblicalReference(new BiblicalReference(1, 1, 4))).toBe(1);
                });
            });
        });
    });
}());
