import React from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';

export default class TrainingPrompt extends React.Component {
  constructor() {
    super();
    this.state = { clients: [] };

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
    const json = new TextDecoder().decode(data);
    const client = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const newClients = clients;
    newClients.push(client);
    this.setState({ clients: newClients });
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
            <Row>
              <Col xs="6">Client Name</Col>
              <Col xs="6">Time</Col>
              <Col xs="12"><hr /></Col>
            </Row>
            {clients && clients.map((d, i) => (
              <Row key={i}>
                <Col xs="6">{d.client}</Col>
                <Col xs="6">{d.delta}</Col>
                <Col xs="12"><hr /></Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      </div>
    );
  }
}
