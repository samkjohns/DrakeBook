var React = require('react'),
    DrakeshipApiUtil = require('../util/DrakeshipApiUtil');

var DrakeshipRequestsIndexItem = module.exports = React.createClass({
  confirmRequest: function () {
    DrakeshipApiUtil.confirmRequest(
      this.props.potentialDrake,
      SessionStore.currentUser()
    );
  },

  deleteRequest: function () {
    DrakeshipApiUtil.deleteRequest(
      this.props.potentialDrake,
      SessionStore.currentUser()
    );
  },

  render: function () {
    return(
      <div className="drakeship-request-item group">
        <div className="drakeship-requester">
          <img src={window.drakeImages.default.profile} />
          <a onClick={this.goToProfile}>{this.props.potentialDrake.username}</a>
        </div>

        <div className="drakeship-buttons group">
          <button onClick={this.confirmRequest}>Confirm</button>
          <button onClick={this.deleteRequest}>Delete Request</button>
        </div>
      </div>
    )
  }
});
