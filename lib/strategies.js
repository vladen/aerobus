"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var strategies = {
  cyclically: function cyclically() {
    var index = -1;
    return function (items) {
      return [items[++index % items.length]];
    };
  },
  randomly: function randomly() {
    return function (items) {
      return [items[Math.floor(items.length * Math.random())]];
    };
  },
  simultaneously: function simultaneously() {
    return function (items) {
      return items;
    };
  }
};

exports.default = strategies;
