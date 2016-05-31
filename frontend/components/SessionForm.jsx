var React = require('react');
    SessionActions = require('../actions/SessionActions');

var SessionForm = module.exports = React.createClass({
  getInitialState: function () {
    return {
      username: "",
      password: "",
      confirm: ""
    };
  },

  componentDidMount: function () {

  },

  submit: function () {
    if (this.props.type === "login" || (this.state.password === this.state.confirm))
    {
      SessionActions.login({
        user: {
          username: this.state.username,
          password: this.state.password
        }
      });
    }

  },

  buttonElement: function () {
    return(
      <button onClick={this.submit}>
        {this.props.formType}
      </button>
    );
  },

  render: function () {
    // var submitText = this

    var form;
    if (this.props.formType === "login") {
      form = (
        <form>
          <input type="text" value={this.state.username} />
          <input type="password" value={this.state.password} />
          {this.buttonElement()}
        </form>
      );
    } else {
      form = (
        <form>
          <input type="text" value={this.state.username} />
          <input type="password" value={this.state.password} />
          <input type="password" value={this.state.confirm} />
          {this.buttonElement()}
        </form>
      );
    }

    return(
      <div className={this.props.formType + "-pane"}>
        {form}
      </div>
    );
  }
});
