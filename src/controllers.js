/*jslint browser: true */

(function (angular) {
    "use strict";

    angular.module("tikkun")
        .controller("MainController", ["$scope", "parshiyotDataSource", function ($scope, parshiyotDataSource) {
            $scope.parshiyot = parshiyotDataSource.parshiyot;

            $scope.selectedParsha = parshiyotDataSource.parshiyot[0];

            $scope.shouldShowParshiyotOptions = false;
            $scope.toggleShowParshiyotOptions = function () {
                $scope.shouldShowParshiyotOptions = !$scope.shouldShowParshiyotOptions;
            };

        }])
        .controller("PagesController", ["$scope", "pagesDataSource", function ($scope, pagesDataSource) {

            $scope.appendPage = pagesDataSource.append;

            $scope.prependPage = pagesDataSource.prepend;

            $scope.goToParsha = pagesDataSource.goToParsha;

            $scope.pages = pagesDataSource.pages;
        }])
        .controller("PageController", ["$scope", function ($scope) {
        }]);
}(window.angular || {}));
