import React, {PropTypes} from 'react';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BoundField} from '../forms';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Search} from '../icons';
import {search as actions} from '../../actions';
import style from './bar.css';

const SearchForm = forms.Form.extend({
  string: forms.CharField({
    label: ' ',
    widgetAttrs: {
      placeholder: 'What are you looking for?',
      // id: 'search-bar',
      labelInside: true
    },
    required: false
  })
});

const SearchBar = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setString: PropTypes.func
    }),
    string: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
    noRedirect: PropTypes.bool,
    id: PropTypes.string
  },
  getDefaultProps(){
    return {
      id: 'universal-search'
    };
  },
  getInitialState() {
    const self = this;
    return {
      form: new SearchForm({
        onChange(){
          self.forceUpdate();
          const {form} = self.state;
          /*eslint-disable eqeqeq*/
          // I want (cleanedData.string = undefined) to equal (data.string = '') here
          if (form.cleanedData.string == form.data.string){
            self.handleSearch(form.cleanedData.string);
          } else if (form.cleanedData.string && !form.data.string){
            self.handleSearch('');
          }
          /*eslint-enable eqeqeq*/
        },
        labelSuffix: '',
        autoId: this.props.id ? `${this.props.id}_{name}` : undefined,
        controlled: true,
        emptyPermitted: true,
        validation: {
          on: 'blur change',
          onChangeDelay: 450
        },
        initial: {string: this.props.string || ''},
        data: {string: this.props.string || ''}
      })
    };
  },
  componentWillReceiveProps(nextProps) {
    const {form} = this.state;
    if (nextProps.string !== form.data.string && nextProps.string !== this.props.string){
      //the search string changed (prob clicked a filter button) and it is not equal to the input
      form.updateData({
        string: nextProps.string || ''
      }, {validate: false});
    } else if (nextProps.location.pathname !== '/search' && this.props.location.pathname === '/search'){
      //we have navigated away from the search page
      this.props.actions.setString('', this.props.noRedirect);
      form.updateData({
        string: ''
      }, {validate: false});
    }
  },
  componentWillUnmount(){
    this.props.actions.setString('', true);
  },
  getFor(){
    return this.props.id ? `${this.props.id}_string` : 'id_string';
  },
  handleSearch(string){
    if (this.props.string !== string){
      this.props.actions.setString(string, this.props.noRedirect);
    }
  },
  handleSubmit(e){
    e.preventDefault();
    if (this.state.form.data.string){
      this.props.actions.setString(this.state.form.data.string, this.props.noRedirect);
    }
  },
  render(){
    return (
      <form name="envWithFilterForm" className={style.form} onSubmit={this.handleSubmit}>
        <Grid>
          <Row>
            <Col xs={12}>
              <BoundField bf={this.state.form.boundField('string')}>
                <label htmlFor={this.getFor()} className={style.iconLabel}>
                  <Search className="icon"/>
                </label>
              </BoundField>
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
});

const mapStateToProps = (state) => ({
  location: state.router.location,
  string: state.search.string
  // string: state.router.location.query.s
  // query: state.router.location.query
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);