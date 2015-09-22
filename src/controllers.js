/*jslint browser: true */

(function (angular) {
    "use strict";

    angular.module("tikkun")
        .controller("PagesController", ["$scope", function ($scope) {
            $scope.pages = [
                [
                    {
                        aliyot: [1],
                        verses: [1],
                        text: "שלום עולם כולו על הרדי פרכת לימוד"
                    },
                    {
                        aliyot: [],
                        verses: [],
                        text: "מה קורה לך עם אני רוחץ בבסם שלי"
                    },
                    {
                        aliyot: [],
                        verses: [2, 3],
                        text: "שלום עולם כולו על הרדי פרכת לימוד"
                    }
                ],
                [
                    {
                        aliyot: [1],
                        verses: [1],
                        text: "שלום עולם כולו על הרדי פרכת לימוד"
                    },
                    {
                        aliyot: [],
                        verses: [],
                        text: "מה קורה לך עם אני רוחץ בבסם שלי"
                    },
                    {
                        aliyot: [],
                        verses: [2, 3],
                        text: "שלום עולם כולו על הרדי פרכת לימוד"
                    }
                ],
                [
                    {
                        aliyot: [1],
                        verses: [1],
                        text: "שלום עולם כולו על הרדי פרכת לימוד"
                    },
                    {
                        aliyot: [],
                        verses: [],
                        text: "מה קורה לך עם אני רוחץ בבסם שלי"
                    },
                    {
                        aliyot: [],
                        verses: [2, 3],
                        text: "שלום עולם כולו על הרדי פרכת לימוד"
                    }
                ]
            ];
        }])
        .controller("PageController", ["$scope", function ($scope) {
        }]);
}(window.angular || {}));
