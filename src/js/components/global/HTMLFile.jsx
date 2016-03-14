import React, {PropTypes} from 'react';
import request from '../../modules/request';
import {Alert} from '../../modules/bootstrap';

export default React.createClass({
  propTypes: {
    path: PropTypes.string.isRequired
  },
  getInitialState(){
    return {
      html: null,
      error: null
    };
  },
  componentWillMount(){
    request.get(this.props.path).then(res => {
      this.setState({html: res.text});
    }).catch(err => {
      const newErr = err.message || err;
      this.setState({error: newErr.toString()});
    });
  },
  render() {
    if (this.state.error){
      return (
        <Alert type="danger">
          HTML error: {this.state.error}
        </Alert>
      );
    } else if (this.state.html){
      return <div dangerouslySetInnerHTML={{__html: this.state.html}}/>;
    }
    return null;
  }
});
