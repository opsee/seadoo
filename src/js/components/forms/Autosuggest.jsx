import React, {PropTypes} from 'react';
import Auto from 'react-autosuggest';

const Autosuggest = React.createClass({
  propTypes: {
    suggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired
  },
  getData(input, cb){
    let data = ['foo', 'fa', 'fee'];
    cb(null, data);
  },
  renderSuggestion(suggestion){
    return suggestion;
  },
  render(){
    return (
      <div>
        <Auto {...this.props} getData={this.getData} suggestionRenderer={this.renderSuggestion}/>
      </div>
    );
  }
});

export default Autosuggest;