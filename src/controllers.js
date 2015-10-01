/*jslint browser: true */

(function (angular) {
    "use strict";

    angular.module("tikkun")
        .controller("PagesController", ["$scope", "pagesDataSource", function ($scope, pagesDataSource) {

            $scope.appendPage = pagesDataSource.append;

            $scope.prependPage = pagesDataSource.prepend;

            $scope.pages = pagesDataSource.pages;
        }])
        .controller("PageController", ["$scope", function ($scope) {
        }]);
}(window.angular || {}));
