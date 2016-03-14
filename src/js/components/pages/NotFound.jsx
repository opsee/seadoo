import React from 'react';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="404"/>
        <Grid>
          <Row>
            <Col xs={12}>
              Whoa boy. Page not found.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
