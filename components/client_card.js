import React from 'react';
import { Col, Card, CardBody } from '@nio/ui-kit';

const ClientCard = ({ client, selectClient }) => (
  <Col
    onClick={() => selectClient(client.MAC)}
    xs="12"
    md="6"
    lg="4"
    xl="3"
    className={`mb-3 client-card ${client.tag[1].toLowerCase()} ${client.os.toLowerCase()} ${client.nonResponsive && 'non-responsive'} ${(client.violations.cpu || client.violations.up || client.violations.ram || client.violations.down) && 'stressed'}`}
  >
    <Card>
      <CardBody className="content-holder">
        <div className="left-pane">
          <div className="brand-icon" />
          <div className="divider" />
          <div className="os-icon" />
        </div>
        <div className="content-pane">
          <div className="client-name">
            <h6>{client.tag[1].toLowerCase()} / {client.os.toLowerCase() === 'darwin' ? 'macos' : client.os.toLowerCase()}</h6>
            {client.name}<br />
            {client.project && (<a href={`http://${client.project}`} target="_blank">{client.project}</a>)}
          </div>
        </div>
        <div className="icon-pane text-muted">
          <i className={`fa fa-dashboard ${client.violations.cpu && 'text-danger'}`} />
          <i className={`fa fa-microchip ${client.violations.ram && 'text-danger'}`} />
          <i className={`fa fa-cloud-download ${client.violations.down && 'text-danger'}`} />
          <i className={`fa fa-cloud-upload ${client.violations.up && 'text-danger'}`} />
        </div>
      </CardBody>
    </Card>
  </Col>
);

export default ClientCard;
