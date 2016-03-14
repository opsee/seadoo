import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/analytics';

const Analytics = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      trackPageView: PropTypes.func.isRequired
    })
  },
  contextTypes: {
    history: React.PropTypes.object.isRequired
  },
  componentDidMount() {
    this.historyListener = this.context.history.listen((err, renderProps) => {
      if (err || !renderProps) {
        return;
      }

      this.runPageview(renderProps.location);
    });
  },
  shouldComponentUpdate() {
    return false;
  },
  componentWillUnmount() {
    if (!this.historyListener) {
      return;
    }
    this.historyListener();
    this.historyListener = null;
  },
  runPageview(location = {}) {
    const path = location.pathname + location.search;
    if (this.latestUrl === path) {
      return;
    }
    this.latestUrl = path;

    // wait for correct title
    const trackPageView = this.props.actions.trackPageView;
    setTimeout(function wait() {
      trackPageView(path, document.title);
    }, 0);
  },
  render() {
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Analytics);
