/*jslint browser: true */
/*global window*/

(function (spec) {
    "use strict";

    var angular = spec.angular,
        newPagesDataSource = spec.Tikkun.PagesDataSource,
        newParsha = spec.Tikkun.Parsha,
        newReference = spec.Tikkun.Reference,
        Promise = window.Promise;

    angular.module("tikkun")
        .factory("arrangementDataSource", ["$http", function ($http) {
            function newArrangementDataSource() {
                var arrangement = [];

                $http.get("/data/tikkun-simanim.json").success(function (columnLines) {
                    columnLines.forEach(function (column) {
                        arrangement.push(column);
                    });
                });

                return Object.freeze({
                    arrangement: arrangement
                });
            }

            return newArrangementDataSource();
        }])
        .factory("aliyotDataSource", ["$http", function ($http) {
            function newAliyotDataSource() {
                var aliyot = [],
                    fetch = function () {
                        return $http.get('/data/aliyot.json')
                            .then(function (response) {
                                var aliyotStarts = response.data;

                                Array.prototype.push
                                    .apply(aliyot, aliyotStarts);
                            });
                    };

                return Object.freeze({
                    aliyot: aliyot,
                    fetch: fetch
                });
            }

            return newAliyotDataSource();
        }])
        .factory("columnFetcher", ['$http', function ($http) {

            function newColumnFetcher() {
                var store = [],
                    pageAtIndex = function (pageIndex) {
                        // pageIndex = Math.min(Math.max(0, pageIndex), pages.length - 1);
                        var stored;

                        stored = store[pageIndex];
                        if (stored) {
                            return Promise.resolve(stored);
                        } else {
                            return $http.get('/pages/' + (pageIndex + 1) + '.json')
                                .then(function (response) {
                                    var page = {lines: response.data};
                                    store[pageIndex] = page;
                                    return page;
                                });
                        }
                    };

                return Object.freeze({
                    pageAtIndex: pageAtIndex
                });
            }

            return newColumnFetcher();
        }])
        .factory("pagesDataSource", [
            "columnFetcher", "parshiyotDataSource", "arrangementDataSource",
            function (columnFetcher, parshiyotDataSource, arrangementDataSource) {

                var pagesDataSource = newPagesDataSource({
                    arrangementDataSource: arrangementDataSource,
                    columnFetcher: columnFetcher,
                    pages: [],
                    startColumn: 1
                });

                parshiyotDataSource.fetch()
                    .then(function () {
                        pagesDataSource.goToParsha(parshiyotDataSource.parshiyot[0]);
                    });

                return pagesDataSource;
            }
        ])
        .factory("parshiyotDataSource", ["$http", "aliyotDataSource", function ($http, aliyotDataSource) {
            function newParshiyotDataSource() {
                var parshiyot = [],
                    fetch = function () {
                        return aliyotDataSource.fetch()
                            .then(function () {
                                return $http.get("/data/parshiyot.json");
                            })
                            .then(function (response) {
                                var data = response.data;

                                data.forEach(function (sefer, seferIndex) {
                                    sefer.forEach(function (parsha, parshaIndex) {

                                        var aliyahStart = aliyotDataSource.aliyot[seferIndex][parshaIndex][0];

                                        parshiyot.push(newParsha({
                                            positionInBook: parshaIndex,
                                            hebrewName: parsha.he,
                                            startReference: newReference({
                                                book: seferIndex + 1,
                                                chapter: aliyahStart.c,
                                                verse: aliyahStart.v,
                                                word: 1
                                            })
                                        }));
                                    });
                                });
                            });
                    };


                return Object.freeze({
                    parshiyot: parshiyot,
                    fetch: fetch
                });
            }

            return newParshiyotDataSource();
        }]);
}({
    angular: window.angular,
    Tikkun: window.Tikkun
}));
