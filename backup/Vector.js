"use strict";
var Vector = {
    Add: function (vec1, vec2) {
        return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
    },
    Subtract: function (vec1, vec2) {
        return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
    },
    Normalize: function (vec) {
        return { x: vec.x == 0 ? 0 : (vec.x > 0 ? 1 : -1), y: vec.y == 0 ? 0 : (vec.y > 0 ? 1 : -1) };
    },
    Equal: function (vec1, vec2) {
        return vec1.x == vec2.x && vec1.y == vec2.y;
    },
    Contains: function (list, vec) {
        var _this = this;
        var contains = false;
        list.forEach(function (pos) {
            if (_this.Equal(pos, vec)) {
                contains = true;
            }
        });
        return contains;
    },
    New: function (x, y) {
        var newvector = {
            x: x, y: y
        };
        return newvector;
    }
};
