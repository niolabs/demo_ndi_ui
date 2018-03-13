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
    this.patron = pubkeeper_client.addPatron(`dni.primes.complete`, { autoRemoveListeners: true }, (patron) => {
      patron.on('message', this.handleTrainingData);
    });
  }

  componentWillUnmount() {
    pubkeeper_client.removePatron(this.patron);
  }

  handleTrainingData(data) {
    const clients = this.state.clients
    const json = new TextDecoder().decode(data);
    const train = this.state.isTraining;
    const client = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);

    train && clients.push({ 'client': client.client, 'delta': client.delta});
    this.setState({clients});
  }

  handleClick(e) {
    const value = Number(document.getElementById('primeNumberCount').value);
    const curr = new  Date().toISOString();
    const clients = [];
    this.setState({ primes: value, startTime: curr, clients: clients, isTraining: true });
    this.brewer.brewJSON([{state: true, length: value, number: this.state.number, time: curr}])
  }

  render() {
    const { primes, clients, isTraining } = this.state;
    const clientList = clients.map((d, i) => <td key={i}>{d.client}</td>);
    const deltaList = clients.map((d, i) => <td key={i}>{d.delta}</td>);

    return (
      <Row>
        <Col xs="12" sm="3" className="summary-label border-right">
          <Button color="primary" onClick={ this.handleClick }>Prime Training</Button>
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
                  <tr>
                    {clientList}
                    {deltaList}
                  </tr>
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
