var React = require('react'),
    ProfileApiUtil = require('../util/ProfileApiUtil'),
    ProfileActions = require('../actions/ProfileActions'),
    ProfileStore = require("../stores/ProfileStore"),
    PostsActions = require('../actions/PostsActions'),
    Search = require('./Search'),
    DrakeToggle = require('./DrakeToggle'),
    ImageUploader = require('./ImageUploader');

var Profile = module.exports = React.createClass({
  getInitialState: function () {
    return {
      profile: {},
      searchDisplayed: false,
      modal: <div/>
    };
  },

  getStateFromStore: function () {
    this.setState({
      profile: ProfileStore.profile()
    });
  },

  getUserId: function (props) {
    return props.params ? props.params.userId : props.userId;
  },

  componentDidMount: function () {
    this.profileListener = ProfileStore.addListener(
      this.getStateFromStore
    );

    var userId = this.getUserId(this.props);
    if (userId) {
      ProfileActions.fetchProfileInfo(this.getUserId(this.props));
    }
  },

  componentWillUnmount: function () {
    this.profileListener.remove();
  },

  componentWillReceiveProps: function (newProps) {
    var oldUserId = this.getUserId(this.props);
    var newUserId = this.getUserId(newProps);

    if (oldUserId !== newUserId) {
      ProfileActions.fetchProfileInfo(newUserId);
      PostsActions.fetchPostsForUser(newUserId);
    } else if (this.isTimelineRoute(newProps.location.pathname)) {
      PostsActions.fetchPostsForUser(newUserId);
    }
  },

  isTimelineRoute: function (route) {
    var reg = /^\/users\/[0-9]+$/;
    return reg.test(route);
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  linkTo: function (route) {
    this.context.router.push(route);
  },

  handleClick: function (evnt) {
    if (
      evnt.target.id !== "search-input" &&
      !evnt.target.id.startsWith('search-results')
    ) {
      this.setState({ searchDisplayed: false });
    }
  },

  handleProfileUploadModal: function (evnt) {
    evnt.preventDefault();
    this.setState({
      modal: <
        ImageUploader
        className="upload-avatar-modal"
        type="profile"
        close={this.closeModal}
      />
    });
  },

  handleCoverUploadModal: function (evnt) {
    evnt.preventDefault();
    this.setState({
      modal: <
        ImageUploader
        className="upload-cover-modal"
        type="cover"
        close={this.closeModal}
      />
    });
  },

  display: function () {
    if (!this.state.searchDisplayed) {
      this.setState({ searchDisplayed: true });
    }
  },

  closeModal: function () {
    this.setState({ modal: <div/> });
  },

  render: function () {
    var profileRoute = "/users/" + this.getUserId(this.props);
    var photos, drakes, about, timeline;
    var selectedRoute = this.props.location.pathname;

    photos = selectedRoute.endsWith('photos') ?
      <a onClick={this.linkTo.bind(this, profileRoute + "/photos")}
        className="selected">Photos</a> :
      <a onClick={this.linkTo.bind(this, profileRoute + "/photos")}
        className="">Photos</a>


    // the tabs for subroutes
    var drakeCount = this.state.profile.drakeships ?
      this.state.profile.drakeships.length : 0;

    drakes = selectedRoute.endsWith('drakes') ?
      <a onClick={this.linkTo.bind(this, profileRoute + "/drakes")}
        className="selected">Drakes <span className="count">{drakeCount}</span></a> :
      <a onClick={this.linkTo.bind(this, profileRoute + "/drakes")}
        className="">Drakes <span className="count">{drakeCount}</span></a>

    about = selectedRoute.endsWith('about') ?
      <a onClick={this.linkTo.bind(this, profileRoute + "/about")}
        className="selected">About</a> :
      <a onClick={this.linkTo.bind(this, profileRoute + "/about")}
        className="">About</a>

    var timeRegxp = /^\/users\/[0-9]+$/;
    timeline = timeRegxp.test(selectedRoute) ?
      <a onClick={this.linkTo.bind(this, profileRoute)}
        className="selected">Timeline</a> :
      <a onClick={this.linkTo.bind(this, profileRoute)}
        className="">Timeline</a>

    var drakeToggle = <div/>;
    var profileUploadButton = <div/>;
    var coverUploadButton = <div/>;
    if (SessionStore.currentUser().id !== ProfileStore.profile().id) {
      drakeToggle = < DrakeToggle userId={this.props.userId} />;
    } else {
      profileUploadButton = (
        <button
          onClick={this.handleProfileUploadModal}
          className="upload-avatar-button upload-button"
        >
          <img src={window.drakeImages.iconCamera} />
        </button>
      );

      coverUploadButton = (
        <button
          onClick={this.handleCoverUploadModal}
          className="upload-cover-button upload-button"
        >
          <img src={window.drakeImages.iconCamera} />
        </button>
      );
    }

    return(
      <div className="profile-parent-container group" onClick={this.handleClick}>
        < Search displayed={this.state.searchDisplayed} display={this.display} />
        <div className="profile-pane group">
          <div className="cover-photo-pane group" >
            <img src={this.state.profile.cover_photo_url} className="cover-photo" />
            {coverUploadButton}
          </div>

          <div className="avatar-photo-pane group">
            <img src={this.state.profile.profile_photo_url} className="avatar-photo" />
            {profileUploadButton}
          </div>

          <h2 className="username">{this.state.profile.username}</h2>

          {drakeToggle}

          <nav className="profile-nav group">
            <ul className="profile-nav-links group">
              {drakes}
              {about}
              {timeline}
            </ul>
          </nav>
        </div>

        <div className="profile-children group">
          {this.props.children}
        </div>

        {this.state.modal}
      </div>
    );
  }
});
