/*jslint browser: true */

(function (angular) {
    "use strict";

    var ParshaSelectionChangedNotification = "ParshaSelectionChangedNotification";

    angular.module("tikkun")
        .controller("MainController", ["$rootScope", "$scope", "parshiyotDataSource", function ($rootScope, $scope, parshiyotDataSource) {
            $scope.parshiyot = parshiyotDataSource.parshiyot;

            $scope.selectedParsha = parshiyotDataSource.parshiyot[0];

            $scope.shouldShowParshiyotOptions = false;
            $scope.toggleShowParshiyotOptions = function () {
                $scope.shouldShowParshiyotOptions = !$scope.shouldShowParshiyotOptions;
            };

            $scope.notifyJumpToParsha = function (parsha) {
                var selectedParsha = parshiyotDataSource.parshiyot[parsha];
                $scope.selectedParsha = selectedParsha;
                $rootScope.$broadcast(ParshaSelectionChangedNotification, selectedParsha);
            };
        }])
        .controller("PagesController", ["$rootScope", "$scope", "pagesDataSource", function ($rootScope, $scope, pagesDataSource) {

            $scope.appendPage = pagesDataSource.append;

            $scope.prependPage = pagesDataSource.prepend;

            $rootScope.$on(ParshaSelectionChangedNotification, function (event, parsha) {
                pagesDataSource.goToParsha(parsha);
            });

            $scope.pages = pagesDataSource.pages;
        }])
        .controller("PageController", ["$scope", function ($scope) {
        }]);
}(window.angular || {}));
