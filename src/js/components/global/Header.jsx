import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Login, Logout} from 'emissary/src/js/components/icons';
import {Grid, Row, Col} from 'emissary/src/js/modules/bootstrap';
import {
  user as actions
} from '../../actions';
import style from './header.css';

const Header = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    hide: PropTypes.bool,
    actions: PropTypes.shape({
      logout: PropTypes.func
    })
  },
  getInitialState(){
    return {
      ghosting: false
    };
  },
  getHeaderStyle(){
    let obj = {};
    if (this.props.user.get('ghosting')){
      obj.background = seed.color.danger;
    }
    return obj;
  },
  handleLogout(e){
    e.preventDefault();
    this.props.actions.logout();
  },
  renderLoginLink(){
    if (this.props.user.get('auth')){
      return (
        <a onClick={this.handleLogout} className={style.navbarLink}>
          <Logout inline/> Log Out
        </a>
      );
    }
    return (
      <Link to="/login" className={style.navbarLink}>
        <Login nav/>&nbsp;
        <span className={`${style.navbarTitle}`}>Login</span>
      </Link>
    );
  },
  renderNavItems(){
    return (
      <ul className="list-unstyled display-flex justify-content-around" style={{margin: 0}}>
        <li>
         <Link to="/" className={style.navbarLink} activeClassName="active">
           <span className={`${style.navbarTitle}`}>Customers</span>
         </Link>
       </li>
       <li>
        <Link to="/signups" className={style.navbarLink} activeClassName="active">
         <span className={`${style.navbarTitle}`}>Signups</span>
        </Link>
       </li>
       <li>
        <Link to="/graphql" className={style.navbarLink} activeClassName="active">
         <span className={`${style.navbarTitle}`}>GraphQL</span>
        </Link>
       </li>
       <li>
         {this.renderLoginLink()}
       </li>
      </ul>
      );
  },
  render(){
    return (
      <header id="header" className={this.props.hide ? style.headerHide : style.header} style={this.getHeaderStyle()}>
        <nav className={style.navbar} role="navigation">
          <Grid>
            <Row>
              <Col xs={12}>
                {this.renderNavItems()}
              </Col>
            </Row>
          </Grid>
        </nav>
      </header>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Header);