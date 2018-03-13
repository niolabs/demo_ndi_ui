import React from 'react';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Row, Table } from '@nio/ui-kit';

import pubkeeper_client from '../util/pubkeeper_client';

export default class TrainingPrompt extends React.Component {
  constructor() {
    super();
    this.state = {
      state: true,
      length: 0,
      number: 2,
      primes: 0,
      startTime: 0,
      clients: [],
      isTraining: false,
    };

    const fns = ['handleClick', 'handleTrainingData', ];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;
    pubkeeper_client.addBrewer('dni.primes.start', brewer => { app.brewer = brewer ;});
    pubkeeper_client.addPatron('dni.complete', (patron) => {
      patron.on('message', this.handleTrainingData);
    });
  }

  componentWillUnmount() {
    pubkeeper_client.disconnect();
  }

  handleTrainingData(data) {

    const { clients, isTraining } = this.state;
    const json = new TextDecoder().decode(data);
    const client = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);

    if (isTraining) {
      const newClients = clients;
      newClients.push(client);
      this.setState({ clients: newClients });
    }
  }

  handleClick(e) {
    const value = Number(document.getElementById('primeNumberCount').value);
    const curr = new  Date().toISOString();
    const clients = [];
    this.setState({ primes: value, startTime: curr, clients: [], isTraining: true });
    this.brewer.brewJSON([{state: true, length: value, number: this.state.number, time: curr}])
  }

  render() {
    const { primes, clients, isTraining } = this.state;

    return (
      <Row>
        <Col xs="12" sm="3" className="summary-label border-right">
          <Button color="primary" onClick={() => this.handleClick()}>Prime Training</Button>
        </Col>
        <Col xs="12" sm="3" className="summary-label border-right">
          <Form>
            <FormGroup>
              <Input
                placeholder="Enter total # of primes"
                id="primeNumberCount"
              />
            </FormGroup>
          </Form>
        </Col>
        {isTraining && (
          <Col xs="12" sm="6" className="report-table">
          <Card id="selectedCard">
            <CardBody className="content-holder">
              <Table>
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                    {clients.map((d, i) => <tr key={i}><td>{d.client}</td><td>{d.delta}</td></tr>)}
                </tbody>
              </Table>
              <hr />
            </CardBody>
          </Card>
        </Col>
        )}
      </Row>
    );
  }
}
