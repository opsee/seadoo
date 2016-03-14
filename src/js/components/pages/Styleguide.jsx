import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Padding} from '../layout';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Loader, ProgressBar, Table, Toolbar} from '../global';

import {Add, Key} from '../icons';

import * as icons from '../icons';
import {Circle} from '../icons';
import {Button, BoundField, ToggleWithLabel} from '../forms';
import {GroupItemList} from '../groups';
import {Heading} from '../type';
import relationships from 'slate/src/relationships';
import {env as envActions, checks as checkActions, app as appActions} from '../../actions';

const opseeColors = ['primary', 'success', 'info', 'warning', 'danger', 'error', 'gray50', 'gray100', 'gray200', 'gray300', 'gray400', 'gray500', 'gray600', 'gray700', 'gray800', 'gray900', 'text', 'textSecondary', 'header'];

function getState(){
  return {
    toggles: [{on: true}, {on: false}, {on: true}],
    radios: _.range(3).map(i => {
      return {id: `radio-${i}`, on: false};
    }),
    buttonToggles: ['Cassandra', 'Consul', 'Docker Registry', 'Elasticsearch', 'Etcd', 'Influxdb', 'Memcached'].map((title, i) => {
      return {title: title, on: false, id: `button-toggle-${i}`};
    })
  };
}

const serviceChoices = ['Cassandra', 'Consul', 'Docker Registry', 'Elasticsearch', 'Etcd', 'Influxdb', 'Memcached', 'MongoDB', 'MySQL', 'Node', 'Postgres', 'RDS', 'Redis', 'Riak', 'Zookeeper'];

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    widgetAttrs: {
      placeholder: 'Name',
      autoComplete: 'off',
      title: 'foo'
    }
  }),
  password: forms.CharField({
    widgetAttrs: {
      placeholder: 'Password'
    }
  }),
  body: forms.CharField({
    widget: forms.Textarea,
    widgetAttrs: {
      placeholder: 'Body'
    }
  }),
  services: forms.MultipleChoiceField({
    choices: serviceChoices.slice(0, 6).map(s => [s, s]),
    widget: forms.CheckboxSelectMultiple(),
    widgetAttrs: {
      widgetType: 'MultiButtonToggle'
    },
    label: 'buttonToggle'
  }),
  radio: forms.ChoiceField({
    choices: serviceChoices.slice(0, 5).map(s => [s, s]),
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  }),
  relationship: forms.ChoiceField({
    widgetAttrs: {
      noLabel: true,
      widgetType: 'Dropdown'
    },
    choices: relationships.map(r => [r.id, r.name])
  }),
  validation: 'auto'
});

const Styleguide = React.createClass({
  propTypes: {
    appActions: PropTypes.shape({
      modalMessageOpen: PropTypes.func
    }),
    checkActions: PropTypes.shape({
      getChecks: PropTypes.func
    }),
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object
        })
      })
    })
  },
  getInitialState(){
    const self = this;
    return _.extend(getState(), {
      info: new InfoForm({
        onChange(){
          if (self.isMounted()){
            self.forceUpdate();
          }
        }
      }),
      showMenu: false
    });
  },
  componentWillMount(){
    this.props.checkActions.getChecks();
    this.props.envActions.getGroupsSecurity();
  },
  getDefaultProps() {
    return getState();
  },
  getColor(index){
    return opseeColors[index % opseeColors.length];
  },
  getChecks(){
    return false;
  },
  runTriggerToggle(index, bool){
    let toggles = this.state.toggles;
    toggles[index].on = bool;
    this.setState({toggles});
  },
  runTriggerRadio(id, bool){
    let radios = _.clone(this.state.radios);
    const index = _.findIndex(radios, {id});
    if (index > -1){
      radios = radios.map(r => {
        r.on = r.id === id ? bool : false;
        return r;
      });
      this.setState({radios});
    }
  },
  runTriggerButtonToggle(id, bool){
    let buttonToggles = _.clone(this.state.buttonToggles);
    const index = _.findIndex(buttonToggles, {id});
    if (index > -1){
      buttonToggles = buttonToggles.map(r => {
        r.on = r.id === id ? bool : r.on;
        return r;
      });
      this.setState({buttonToggles});
    }

    // let buttonToggles = this.state.buttonToggles
    // buttonToggles[index].on = bool;
    // this.setState({buttonToggles});
  },
  runNotify(color){
    console.log(`run notify ${color}`);
    this.props.appActions.modalMessageOpen({
      html: `This is a ${color} test of the notification system, <a href="http://google.com" target="_blank">even including html</a>`,
      color
    });
  },
  runToggleContextMenu(){
    this.setState({showMenu: !this.state.showMenu});
  },
  handlePressUp(){
    /*eslint-disable no-alert*/
    alert('you pressed it.');
    /*eslint-enable no-alert*/
  },
  render() {
    return (
      <div>
        <Toolbar title="Opsee Styleguide">
          <Button fab color="primary" title="Primary Action" tooltip="A Test Button" tooltip-placement="left">
            <Add btn/>
          </Button>
        </Toolbar>

        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <Heading level={3}>Fab button (at top right)</Heading>
                <p>To be used as the primary action on application pages that have CRUD functionality. For example, in a list of health checks to add a new check, or on a profile page to edit the user profile. On screens like the tutorial with Next as the primary action, a Fab should not be used.</p>
                <p>Additionally, color can be used to help communicate the purpose of the buton. Primary color for Add and Info color for Edit actions are standard across the app.</p>
              </Padding>

              <Padding b={1}>
                <Heading level={3}>Colors</Heading>
                {opseeColors.map(color => {
                  return (
                    <Row className="flex-vertical-align" key={`color-list-${color}`}>
                      <Col>
                        <Circle fill={color} style={{width: '40px', height: '40px'}}/>
                      </Col>
                      <Col style={{margin: '0 0 0 0.5rem'}}>
                        {color}
                      </Col>
                    </Row>
                  );
                })}
              </Padding>

              <hr/>

              <Padding b={1}>
                <Heading level={3}>Typography</Heading>

                <Heading>Header Level 1: Instance Passing, Started Three Hours</Heading>
                <Heading level={2}>Header Level 2: Resource Restarted, Checking Availability</Heading>
                <Heading level={3}>Header Level 3: Check Currently Unmonitored</Heading>

                <p>Paragraph. Wornall Homestead pork spare ribs maple mild BB's Lawnside smoked turkey Jack Stack mixed plate Crossroads hog heaven <span className="text-info">West Side strawberry soda</span> smoker drop. Entire loaf of white bread team Novel Restaurant chicken wings fun KC Strip chorizo Arthur Bryant's works ham River Market short end sandwiches baby back ribs rarely.</p>

                <Heading level={3}>Icons</Heading>
                <div>
                  {Object.keys(icons).map((key, i) => {
                    return React.createElement(icons[key], {fill: this.getColor(i), key: `icon-${i}`});
                  })}
                </div>
              <hr/>

              <Padding b={1}>

                  <Heading level={3}>Unordered List</Heading>
                  <ul>
                  {[1, 2, 3, 4].map(i => {
                    return (
                      <li key={`unordered-item-${i}`}>List Item {i}</li>
                    );
                  })}
                  </ul>

                  <Heading level={3}>Ordered List</Heading>
                  <ol>
                    {[1, 2, 3, 4].map(i => {
                      return (
                      <li key={`ordered-item-${i}`}>List Item {i}</li>
                      );
                    })}
                  </ol>
                </Padding>

                <Heading level={3}>Toggle List</Heading>
                <ul className="list-unstyled">
                {this.state.toggles.map((t, i) => {
                  return (
                    <li key={`toggle-${i}`}>
                      <ToggleWithLabel on={t.on} onChange={this.runTriggerToggle} id={i} label="Item"/>
                    </li>
                  );
                })}
                </ul>
              </Padding>

              <hr/>

              <Heading level={3}>Radio Select</Heading>
              <BoundField bf={this.state.info.boundField('radio')}/>
              <hr/>

          <Heading level={3}>Button Toggles</Heading>
          <BoundField bf={this.state.info.boundField('services')}/>
            <hr/>

            <Heading level={3}>Data Tables</Heading>

            <Table>
              <tr>
                <th>Head1</th>
                <th>Head1</th>
              </tr>
              <tr>
                <td>Col 1</td>
                <td>Col 2</td>
              </tr>
              <tr>
                <td>Col 1</td>
                <td>Col 2</td>
              </tr>
              <tr>
                <td>Col 1</td>
                <td>Col 2</td>
              </tr>
            </Table>

            <hr/>

            <Heading level={3}>Example Group Items</Heading>
            <GroupItemList groups={this.props.redux.env.groups.security} limit={4}/>
            <hr/>
            <Heading level={3}>Cards</Heading>
            <Row>
            {[1, 2, 3, 4].map(i => {
              return (
                <Col xs={12} sm={6} key={`card-${i}`}>
                  <Padding tb={1}>
                    <div className="bg-gray-900 md-shadow-bottom-z-1">
                      <div className="padding">
                        <Heading level={2} className="margin-none">A title goes here</Heading>
                        <div>
                          <div><a href="mailto:">test@opsee.co</a></div>
                          <span>#352346 - Created on 12/05/15</span>
                        </div>
                      </div>
                      <div>
                        <Button color="default" flat>Delete</Button>
                        <Button color="primary" flat className="pull-right">Activate</Button>
                      </div>
                    </div>
                  </Padding>
                </Col>
              );
            })}
            </Row>

            <hr/>

            <Heading level={3}>Forms</Heading>

            <form name="testform" id="testform">

              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('name')}/>
              </Padding>
              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('password')}>
                  <Key className="icon"/>
                </BoundField>
              </Padding>
              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('body')}/>
              </Padding>
              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('relationship')}/>
              </Padding>

              <Heading level={3}>Buttons</Heading>
              <Padding b={2}>
                <p><strong>Regular:</strong></p>
                <p>Regular button styles are used less often than Flat buttons. Regular buttons can be used for primary actions on pages where it is not appropriate to use a Fab (use block styling as well in this case), such as the tutorial, of for form submission</p>
                <p>Submitting a form uses the Success color.</p>
                <p>
                {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                  return (
                    <Button color={i} key={`btn-${i}`}>{i}</Button>
                  );
                })}
                </p>

                <p><strong>Disabled:</strong></p>
                <p>
                {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                  return (
                    <Button color={i} disabled key={`btn-${i}`}>{i}</Button>
                  );
                })}
                </p>
                <Padding t={2}>
                  <Button block>Block</Button>
                </Padding>

                <p><strong>Press and Hold:</strong></p>
                <Padding t={2}>
                  <Padding b={1}>
                    <Button block onPressUp={this.handlePressUp} color="primary">Block, Press and Hold</Button>
                  </Padding>
                  <Padding b={1}>
                    <Button block onPressUp={this.handlePressUp} color="success">Block, Press and Hold</Button>
                  </Padding>
                  <Padding b={1}>
                    <Button block onPressUp={this.handlePressUp} color="warning">Block, Press and Hold</Button>
                  </Padding>
                  <Padding b={1}>
                    <Button block onPressUp={this.handlePressUp} color="danger">Block, Press and Hold</Button>
                  </Padding>
                  <Padding b={1}>
                    <Button block onPressUp={this.handlePressUp} color="info">Block, Press and Hold</Button>
                  </Padding>
                </Padding>
              </Padding>

              <Heading level={3}>Flat Buttons</Heading>
              <p>Flat buttons are the workhorses of the app. They are the most common button style, used for secondary actions on any page, like Adding a check to an existing group on its detail page or Logging Out on the profile page.</p>
              <p>Flat buttons are also used in the context menu actions, and when combined with Block styling they lose their border.</p>
              <p>"Positive" actions such as creating a check will typically use the Primary color, while negative actions like deleting or logging out will use the Danger color.</p>
              <Padding b={2}>
                {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                  return (
                    <Padding className="pull-left" key={`btn-flat-${i}`}>
                      <Button flat color={i}>{i}</Button>
                    </Padding>
                  );
                })}
                <Padding t={1}>
                  <Button flat color="success" disabled>Disabled</Button>
                </Padding>
              </Padding>
              <Padding b={2}>
                <Padding className="pull-left">
                  <Button flat noPad primary>NO PAD</Button>
                </Padding>
                <Padding className="pull-left">
                  <Button flat color="danger" onPressUp={this.handlePressUp}>Flat, Press and Hold</Button>
                </Padding>
                <Padding t={1}>
                  <Button flat color="primary" block onPressUp={this.handlePressUp}>Flat, Press and Hold</Button>
                </Padding>
              </Padding>
            </form>

            <Heading level={3}>Alerts</Heading>
            <Padding b={2}>
              {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                return (
                  <Alert bsStyle={i} onDismiss={_.noop} key={`alert-${i}`}>A great alert goes here.</Alert>
                  );
              })}
            </Padding>

            <Heading level={3}>Progress Bars</Heading>
            <Padding b={2}>
              <ProgressBar percentage={70} steps={8}/>
              <ProgressBar percentage={100} steps={4}/>
            </Padding>

            <Heading level={3}>Loading State</Heading>
            <Loader/>
            <Heading level={3}>Context Menu</Heading>
            <Button onClick={this.runToggleContextMenu} color="primary">Toggle</Button>
            {
            // <Modal show={this.state.showMenu} onHide={this.runToggleContextMenu} className="context" style="default">
            //   <Grid fluid>
            //     <Row>
            //       <div className="flex-1">
            //         <Padding lr={1}>
            //           <Heading level={3}>Actions</Heading>
            //         </Padding>
            //         <Button text="left" color="primary" block flat>
            //           <Add inline fill="primary"/> Add Item
            //         </Button>
            //       </div>
            //     </Row>
            //   </Grid>
            // </Modal>
            }
            <Heading level={3}>Global Notifcations</Heading>
            <Padding b={1}>
              <Button color="danger" onClick={this.runNotify.bind(null, 'danger')}>Danger NOTIFICATION</Button>
            </Padding>
            <Padding b={1}>
              <Button color="success" onClick={this.runNotify.bind(null, 'success')}>Success NOTIFICATION</Button>
            </Padding>
          </Col>
        </Row>
      </Grid>
    </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  envActions: bindActionCreators(envActions, dispatch),
  checkActions: bindActionCreators(checkActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Styleguide);