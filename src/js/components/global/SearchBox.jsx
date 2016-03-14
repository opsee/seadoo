import React from 'react';
// import _ from 'lodash';
import Autosuggest from 'react-autosuggest';
import {History} from 'react-router';

const SearchBox = React.createClass({
  mixins: [History],
  getInitialState(){
    return {
      hidden: true
    };
  },
  // getData(input, cb){
  //   let routes = router.getAllRoutes();
  //   const data = _.chain(routes).filter(r => {
  //     return r.name && r.name.match(input);
  //   }).map(r => r.name).value();
  //   cb(null, data);
  // },
  // handleSelect(choice){
  //   this.history.pushState(null, choice);
  //   this.setState({hidden: true});
  // },
  render(){
    const self = this;
    document.onkeydown = (e) => {
      switch (e.which){
      //forward slash
      case 191:
        if (e.srcElement && (e.srcElement.nodeName === 'BODY' || e.srcElement.id === 'searchBoxInput')){
          const isHidden = !!self.state.hidden;
          self.setState({hidden: !isHidden});
          if (isHidden){
            const el = document.querySelector('#searchBox input');
            if (el){
              setTimeout(() => el.focus(), 100);
            }
          }
        }
        break;
      //escape key
      case 27:
        self.setState({hidden: true});
        break;
      default:
        break;
      }
    };
    if (!this.state.hidden){
      return (
        <div id="searchBox">
          <Autosuggest suggestions={this.getData} onSuggestionSelected={this.handleSelect} inputAttributes={{placeholder: 'Search for a Page Route', id: 'searchBoxInput'}}/>
        </div>
      );
    }
    return null;
  }
});

export default SearchBox;