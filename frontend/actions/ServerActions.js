var AppDispatcher = require('../dispatcher/Dispatcher'),
    SearchConstants = require('../constants/SearchConstants'),
    PostConstants = require('../constants/PostConstants'),
    ProfileConstants = require('../constants/ProfileConstants');

var ServerActions = module.exports = {
  undrake: function (fullDrakeship) {
    AppDispatcher.dispatch({
      actionType: 'UNDRAKE',
      fullDrakeship: fullDrakeship
    });
  },

  addDrake: function (fullDrakeship) {
    AppDispatcher.dispatch({
      actionType: "ADD_DRAKE",
      fullDrakeship: fullDrakeship
    });
  },

  receiveProfile: function (userProfile) {
    AppDispatcher.dispatch({
      actionType: ProfileConstants.USER_RECEIVED,
      profile: userProfile
    });
  },

  receivePosts: function (index) {
    AppDispatcher.dispatch({
      actionType: PostConstants.POSTS_RECEIVED,
      index: index
    });
  },

  receiveSinglePost: function (post) {
    AppDispatcher.dispatch({
      actionType: PostConstants.ADD_POST,
      post: post
    });
  },

  removeSinglePost: function (post) {
    AppDispatcher.dispatch({
      actionType: PostConstants.REMOVE_POST,
      post: post
    });
  },

  receiveSearchResults: function (results) {
    AppDispatcher.dispatch({
      actionType: SearchConstants.RESULTS_RECEIVED,
      results: results
    });
  },
};
