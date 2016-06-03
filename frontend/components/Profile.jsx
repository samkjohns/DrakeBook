var React = require('react'),
    ProfileApiUtil = require('../util/ProfileApiUtil'),
    ProfileStore = require("../stores/ProfileStore"),
    Search = require('./Search');

var Profile = module.exports = React.createClass({
  getInitialState: function () {
    return {
      profile: {}
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

  // setSelectedSubroute: function (route) {
  //   var nonIndexRoutes = [
  //     "about", "drakes", "photos"
  //   ];
  //
  //   var isNonIndex = false;
  //   nonIndexRoutes.forEach(function (nonIndex) {
  //     if (route.endsWith(nonIndex)) {
  //       this.setState({ selected: route });
  //       isNonIndex = true;
  //       return;
  //     }
  //   }.bind(this));
  //
  //   if (!isNonIndex) {
  //     this.setState({ selected: "timeline "});
  //   }
  // },

  componentDidMount: function () {
    this.profileListener = ProfileStore.addListener(
      this.getStateFromStore
    );

    var userId = this.getUserId(this.props);
    if (userId){
      ProfileApiUtil.fetchProfileInfo(this.getUserId(this.props));
    }
  },

  componentWillUnmount: function () {
    this.profileListener.remove();
  },

  componentWillReceiveProps: function (newProps) {
    oldUserId = this.getUserId(this.props);
    newUserId = this.getUserId(newProps);

    if (oldUserId !== newUserId) {
      ProfileApiUtil.fetchProfileInfo(newUserId);
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  linkTo: function (route) {
    this.context.router.push(route);
    // this.setSelectedSubroute(route);
  },

  render: function () {
    var profileRoute = "/users/" + this.getUserId(this.props);
    var photos, drakes, about, timeline;
    var selectedRoute = this.props.location.pathname;
    console.log(selectedRoute);

    photos = selectedRoute.endsWith('photos') ?
      <a onClick={this.linkTo.bind(this, profileRoute + "/photos")}
        className="selected">Photos</a> :
      <a onClick={this.linkTo.bind(this, profileRoute + "/photos")}
        className="">Photos</a>

    drakes = selectedRoute.endsWith('drakes') ?
      <a onClick={this.linkTo.bind(this, profileRoute + "/drakes")}
        className="selected">Drakes</a> :
      <a onClick={this.linkTo.bind(this, profileRoute + "/drakes")}
        className="">Drakes</a>

    about = selectedRoute.endsWith('about') ?
      <a onClick={this.linkTo.bind(this, profileRoute + "/about")}
        className="selected">About</a> :
      <a onClick={this.linkTo.bind(this, profileRoute + "/about")}
        className="">About</a>

    timeline = selectedRoute.endsWith('no') ?
      <a onClick={this.linkTo.bind(this, profileRoute)}
        className="selected">Timeline</a> :
      <a onClick={this.linkTo.bind(this, profileRoute )}
        className="">Timeline</a>

    return(
      <div className="profile-parent-container">
        < Search />
        <div className="profile-pane">
          <div className="cover-photo-pane" >
            <img src={window.drakeImages.default.cover} className="cover-photo" />
          </div>

          <div className="avatar-photo-pane">
            <img src={window.drakeImages.default.profile} className="avatar-photo" />
          </div>

          <h2 className="username">{this.state.profile.username}</h2>

          <nav className="profile-nav group">
            {photos}
            {drakes}
            {about}
            {timeline}
          </nav>
        </div>

        {this.props.children}
      </div>
    );
  }
});

// <a onClick={this.linkTo.bind(this, profileRoute + "/photos")}>Photos</a>
// <a onClick={this.linkTo.bind(this, profileRoute + "/drakes")}>Drakes</a>
// <a onClick={this.linkTo.bind(this, profileRoute + "/about")}>About</a>
// <a onClick={this.linkTo.bind(this, profileRoute)}>Timeline</a>
