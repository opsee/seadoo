import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {Settings, NewWindow} from '../icons';
import {Button} from '../forms';
import listItem from '../global/listItem.css';
import {Padding} from '../layout';
import cx from 'classnames';
import RadialGraph from './RadialGraph';
import {app as actions, analytics as analyticsActions} from '../../actions';

const ListItem = React.createClass({
  propTypes: {
    children: PropTypes.node,
    item: PropTypes.object,
    link: PropTypes.string,
    linkInsteadOfMenu: PropTypes.bool,
    menuTitle: PropTypes.string,
    onClick: PropTypes.func,
    params: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    onClose: PropTypes.func,
    noMenu: PropTypes.bool,
    actions: PropTypes.shape({
      openContextMenu: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    })
  },
  getDefaultProps(){
    return {
      menuTitle: 'Actions',
      type: 'GroupItem'
    };
  },
  runMenuOpen(){
    this.props.actions.openContextMenu(this.props.item.get('id'));
    this.props.analyticsActions.trackEvent(this.props.type, 'menu-open');
  },
  handleClick(e){
    if (typeof this.props.onClick === 'function'){
      if (e){
        e.preventDefault();
      }
      this.props.onClick.call(null, this.props.item);
    }
  },
  renderGraph(){
    const graph = (
      <RadialGraph state={this.props.item.get('state')} passing={this.props.item.get('passing')} total={this.props.item.get('total')} type={this.props.type}/>
    );
    if (this.props.onClick){
      return (
        <div className={listItem.link} onClick={this.handleClick}>
          {graph}
        </div>
      );
    }
    return (
      <Link to={this.props.link} params={this.props.params} className={listItem.link}>
       {graph}
      </Link>
    );
  },
  renderInfo(){
    if (this.props.onClick){
      return (
        <div className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])} onClick={this.handleClick}>
          <div>{_.find(this.props.children, {key: 'line1'})}</div>
          <div className="text-secondary">{_.find(this.props.children, {key: 'line2'})}</div>
        </div>
      );
    }
    return (
      <Link to={this.props.link} params={this.props.params} className={cx([listItem.link, 'display-flex', 'flex-1', 'flex-column'])} title={this.props.title}>
        <div>{_.find(this.props.children, {key: 'line1'})}</div>
        <div className="text-secondary">{_.find(this.props.children, {key: 'line2'})}</div>
      </Link>
    );
  },
  renderMenuButton(){
    const menu = _.find(this.props.children, {key: 'menu'});
    if (!menu){
      return null;
    }
    if (this.props.onClick){
      return (
        <Button icon flat to={this.props.link} target="_blank" title={`View this ${this.props.type} in a new window`}>
          <NewWindow btn fill="textSecondary"/>
        </Button>
      );
    }
    return (
      <Button icon flat secondary onClick={this.runMenuOpen} title="Menu">
        <Settings fill="textSecondary" btn/>
      </Button>
    );
  },
  renderMenu(){
    return _.find(this.props.children, {key: 'menu'}) || <div/>;
  },
  render(){
    return (
      <div className={listItem.item}>
        <Padding b={1}>
          {this.renderMenu()}
          <Grid fluid>
            <Row>
              <Col xs={2} sm={1}>
                {this.renderGraph()}
              </Col>
              <Col xs={8} sm={10} className="display-flex">
                {this.renderInfo()}
              </Col>
              <Col xs={2} sm={1}>
                <Row className="end-xs">
                  <Col>
                    {this.renderMenuButton()}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Padding>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);