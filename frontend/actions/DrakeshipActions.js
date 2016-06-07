var React = require('react'),
    DrakeshipApiUtil = require('../util/DrakeshipApiUtil');

var DrakeshipActions = module.exports = {
  undrake: function (userId, drakeId) {
    DrakeshipApiUtil.undrake(userId, drakeId);
  },

  requestDrake: function (userId, drakeId) {
    DrakeshipApiUtil.requestDrake(userId, drakeId);
  }
};