/*jslint browser: true */

(function () {
    "use strict";

    var describe = window.describe,
        expect = window.expect,
        it = window.it,
        TikkunColumn = window.TikkunColumn,
        TikkunColumnRow = window.Tikkun.TikkunColumnRow;

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
