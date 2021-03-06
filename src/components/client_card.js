import React from 'react';
import PropTypes from 'prop-types';
import { Col, Card, CardBody } from '@nio/ui-kit';

const ClientCard = ({ client, selectClient }) => (
  <Col
    onClick={() => selectClient(client)}
    xs="12"
    md="6"
    lg="4"
    xl="3"
    className={`mb-3 client-card ${client.tag[1].toLowerCase()} ${client.os.toLowerCase()} ${client.nonResponsive && 'non-responsive'} ${(client.violations.cpu || client.violations.up || client.violations.ram || client.violations.down) && 'stressed'}`}
  >
    <Card>
      <CardBody className="content-holder">
        <div className="icon-holder">
          <div className="brand-icon" />
          <div className="divider" />
          <div className="os-icon" />
        </div>
        <div className="content-pane">
          <div className="client-name">
            <h6 className="mt-0 mb-1">{client.name}</h6>
            {client.tag[1].toLowerCase()} / {client.os.toLowerCase() === 'darwin' ? 'macos' : client.os.toLowerCase()}<br />
            {client.project && (<a href={`http://${client.project}`} target="_blank">{client.project}</a>)}
          </div>
        </div>
        <div className="icon-pane text-muted">
          <i className={`fa fa-lg fa-dashboard ${client.violations.cpu && 'text-danger'}`} />
          <div className="divider" />
          <i className={`fa fa-lg fa-cloud-download ${client.violations.down && 'text-danger'}`} />
        </div>
        <div className="icon-pane text-muted">
          <i className={`fa fa-lg fa-microchip ${client.violations.ram && 'text-danger'}`} />
          <div className="divider" />
          <i className={`fa fa-lg fa-cloud-upload ${client.violations.up && 'text-danger'}`} />
        </div>
      </CardBody>
    </Card>
  </Col>
);

ClientCard.propTypes = {
  client: PropTypes.object.isRequired,
  selectClient: PropTypes.func.isRequired,
};

export default ClientCard;
