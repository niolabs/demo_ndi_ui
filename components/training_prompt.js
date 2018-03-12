import React from 'react';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Row } from '@nio/ui-kit';

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
    };

    const fns = ['handleClick'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;
    pubkeeper_client.addBrewer('dni.primes.start', brewer => { app.brewer = brewer ;});
  }

  handleClick(e) {
    const value = Number(document.getElementById('primeNumberCount').value)
    const curr = new  Date().toISOString()
    this.setState({ primes: value, startTime: curr});
    this.brewer.brewJSON([{state: true, length: value, number: this.state.number, time: curr}])
  }

  render() {
    const { primes } = this.state

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

      </Row>
    );
  }
}
