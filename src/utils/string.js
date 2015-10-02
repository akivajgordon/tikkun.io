(function () {
    "use strict";

    // http://stackoverflow.com/a/202627/2374361
    String.prototype.repeat = function (num) {
        return new Array(num + 1).join(this);
    };
}());
