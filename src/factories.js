/*jslint browser: true */

(function (spec) {
    "use strict";

    var angular = spec.angular,
        newLineBuilder = spec.Tikkun.LineBuilder,
        newPageBuilder = spec.Tikkun.PageBuilder,
        newPagesDataSource = spec.Tikkun.PagesDataSource,
        newParsha = spec.Tikkun.Parsha,
        newReference = spec.Tikkun.Reference,
        Notifications = spec.Tikkun.Notifications;

    angular.module("tikkun")
        .factory("wordBreaker", function () {
            return function (text) {
                var PASEQ_RE = / ׀/g,
                    PASEQ_REPLACE = "#׀",
                    MAQAF_RE = /־/g,
                    MAQAF_REPLACE = "־ ";

                return text.replace(PASEQ_RE, PASEQ_REPLACE).replace(MAQAF_RE, MAQAF_REPLACE).split(/\s/);
            };
        })
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
        .factory("aliyotDataSource", ["$rootScope", "$http", function ($rootScope, $http) {
            function newAliyotDataSource() {
                var aliyot = [];

                $http.get("/data/aliyot.json").success(function (aliyotStarts) {
                    aliyotStarts.forEach(function (sefer) {
                        aliyot.push(sefer);
                    });

                    $rootScope.$broadcast(Notifications.AliyotLoaded);
                });

                return Object.freeze({
                    aliyot: aliyot
                });
            }

            return newAliyotDataSource();
        }])
        .factory("torahDataSource", ["$http", function ($http) {
            function newTorahDataSource() {
                var torahText = [];

                $http.get("/data/tanach/genesis.json").success(function (data) {
                    data.text.forEach(function (chapter) {
                        torahText.push(chapter);
                    });
                });

                return Object.freeze({
                    torahText: torahText
                });
            }

            return newTorahDataSource();
        }])
        .factory("columnFetcher", ["wordBreaker", "arrangementDataSource", "aliyotDataSource", "torahDataSource", function (wordBreaker, arrangementDataSource, aliyotDataSource, torahDataSource) {

            function newColumnFetcher() {
                var pageBuilder = newPageBuilder({
                        arrangement: arrangementDataSource.arrangement,
                        lineBuilder: newLineBuilder({
                            aliyot: aliyotDataSource.aliyot,
                            wordBreaker: wordBreaker
                        }),
                        source: torahDataSource.torahText
                    }),
                    pageAtIndex = function (pageIndex, callback) {
                        // pageIndex = Math.min(Math.max(0, pageIndex), pages.length - 1);

                        callback(pageBuilder.pageAtIndex(pageIndex));
                    };

                return Object.freeze({
                    pageAtIndex: pageAtIndex
                });
            }

            return newColumnFetcher();
        }])
        .factory("pagesDataSource", [
            "$rootScope", "columnFetcher", "parshiyotDataSource", "arrangementDataSource",
            function ($rootScope, columnFetcher, parshiyotDataSource, arrangementDataSource) {

                var pagesDataSource = newPagesDataSource({
                    arrangementDataSource: arrangementDataSource,
                    columnFetcher: columnFetcher,
                    pages: [],
                    startColumn: 1
                });

                $rootScope.$on(Notifications.ParshiyotLoaded, function () {
                    pagesDataSource.goToParsha(parshiyotDataSource.parshiyot[0]);
                });

                return pagesDataSource;
            }])
        .factory("parshiyotDataSource", ["$rootScope", "$http", "aliyotDataSource", function ($rootScope, $http, aliyotDataSource) {
            function newParshiyotDataSource() {
                var parshiyot = [];

                $rootScope.$on(Notifications.AliyotLoaded, function () {
                    $http.get("/data/parshiyot.json").success(function (data) {
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

                        $rootScope.$broadcast(Notifications.ParshiyotLoaded);
                    });

                });

                return Object.freeze({
                    parshiyot: parshiyot
                });
            }

            return newParshiyotDataSource();
        }]);
}({
    angular: window.angular,
    Tikkun: window.Tikkun
}));
