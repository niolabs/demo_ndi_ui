import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';

const ClientCard = ({ client }) => (
  <Card>
    <CardBody className="content-holder">
      <div className="os-pane">
        <div className="os-icon" />
      </div>
      <div className="content-pane">
        <div className="client-name">
          <h6 className="mb-1">{client.tag && client.tag[0] === 'cloud' && `${client.tag[1]} - `} {client.name}</h6>
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
);

export default ClientCard;
