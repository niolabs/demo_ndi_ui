import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

const SelectedRouterCard = ({ client: { name, up_total, down_total, visibleRouterClientList } }) => (
  <div>
    <h6 className="mb-3">
      {name || <i className="fa fa-spinner fa-spin fa-fw" />}
      <i className="fa fa-times pull-right" />
    </h6>
    <Card id="selectedCard">
      <CardBody className="content-holder">
        <Row>
          <Col xs="6"><b>network up</b></Col>
          <Col xs="6" className="text-right">{(up_total / 1024 / 1024).toFixed(2)}Mb/s</Col>
        </Row>
        <Row>
          <Col xs="6"><b>network down</b></Col>
          <Col xs="6" className="text-right">{(down_total / 1024 / 1024).toFixed(2)}Mb/s</Col>
        </Row>
        <hr className="mb-1" />
        <Row>
          <Col xs="6"><b>{visibleRouterClientList.length} Active Client{visibleRouterClientList.length !== 1 && 's'}</b></Col>
          <Col xs="3" className="text-right"><b>Up Mb/s</b></Col>
          <Col xs="3" className="text-right"><b>Down Mb/s</b></Col>
        </Row>
        <hr className="mt-1" />
        {visibleRouterClientList.map(c => (
          <Row key={c.name + c.network_up} className="text-muted mb-1">
            <Col xs="6">{c.name && c.name.toLowerCase()}</Col>
            <Col xs="3" className="text-right">{c.network_up && (c.network_up / 1024 / 1024).toFixed(1)}</Col>
            <Col xs="3" className="text-right">{c.network_down && (c.network_down / 1024 / 1024).toFixed(1)}</Col>
          </Row>
        ))}
        <br />
      </CardBody>
    </Card>
  </div>
);

SelectedRouterCard.propTypes = {
  client: PropTypes.object.isRequired,
};

export default SelectedRouterCard;
