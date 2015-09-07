/*jslint browser: true */
/*jslint nomen: true */

(function () {
    "use strict";

    function ToolbarController(parshiyot, isShowingAnnotations) {
        this._parshiyot = parshiyot;
        this._isShowingAnnotations = isShowingAnnotations;
    }

    ToolbarController.prototype.parshiyot = function () {
        return this._parshiyot;
    };

    ToolbarController.prototype.isShowingAnnotations = function () {
        return this._isShowingAnnotations;
    };

    window.Tikkun.ToolbarController = ToolbarController;
}());
