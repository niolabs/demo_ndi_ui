import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';

import { withPubkeeper } from '../providers/pubkeeper';

class TrainingPrompt extends React.Component {
  constructor() {
    super();
    this.state = { clients: {} };

    const fns = ['handleTrainingData'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const { pkClient } = this.props;

    pkClient.addPatron('dni.complete', { autoRemoveListeners: true }, (patron) => {
      patron.on('message', this.handleTrainingData);
      return () => { patron.off('message', this.handleTrainingData); };
    });
  }

  handleTrainingData(data) {
    const { clients } = this.state;
    const { allClients } = this.props;

    const json = new TextDecoder().decode(data);
    const client = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const thisClientIndex = Object.keys(allClients).find((c, i) => allClients[i].name === client.client);

    if (thisClientIndex) {
      client.os = allClients[thisClientIndex].os.toLowerCase();
      client.meta = allClients[thisClientIndex].tag.join(' | ').toLowerCase();
    }
    if (client.delta.indexOf('day') !== -1) {
      client.delta = '0:00:00.545';
    }
    clients[client.client] = client;
    this.setState({ clients });
  }

  render() {
    const { clients } = this.state;

    return (
      <div>
        <h6 className="mb-3">
          test results
          <i className="fa fa-times pull-right" />
        </h6>
        <Card id="selectedCard">
          <CardBody className="content-holder">
            {Object.keys(clients).sort((a, b) => clients[a].delta.replace(/\D/g, '') - clients[b].delta.replace(/\D/g, '')).map(d => (
              <Row key={clients[d].client}>
                <Col xs="2" className="d-none d-sm-block">
                  <div className={`icon-holder ${clients[d].os}`}>
                    <div className="os-icon" />
                  </div>
                </Col>
                <Col xs="12" sm="6">
                  <div className="name-holder">
                    <b>{clients[d].client}</b><br />
                    <i>{clients[d].meta}</i>
                  </div>
                </Col>
                <Col xs="12" sm="4" className="pt-1 text-xs-center text-sm-right">{clients[d].delta}</Col>
                <Col xs="12"><hr /></Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      </div>
    );
  }
}

TrainingPrompt.propTypes = {
  pkClient: PropTypes.object.isRequired,
  allClients: PropTypes.array.isRequired,
};

export default withPubkeeper(TrainingPrompt);
