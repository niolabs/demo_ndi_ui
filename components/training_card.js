import React from 'react';
import { Card, CardBody, Table } from '@nio/ui-kit';

import pubkeeper_client from '../util/pubkeeper_client';

export default class TrainingCard extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: []
    };
    const fns = ['initializeTrainingData', 'handleTrainingData'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    this.initializeTrainingData();
  }

  componentWillUnmount() {
    pubkeeper_client.removePatron(this.patron);
  }

  initializeTrainingData() {
    const app = this;
    this.patron = pubkeeper_client.addPatron(`dni.primes.complete`, { autoRemoveListeners: true }, (patron) => {
      patron.on('message', this.handleTrainingData);
    });
  }

  handleTrainingData(data) {
    const json = new TextDecoder().decode(data);
    const { client, delta } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    console.log(client)
    console.log(delta)
    this.clients.push({ 'client': client, 'delta': delta});
    console.log(clients)
  }

  render() {
    const { clients } = this.state;
    const clientList = clients.map((d) => <td key={d.client}>{d.client}</td>);
    const deltaList = clients.map((d) => <td key={d.delta}>{d.delta}</td>);

    return (
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
    )
  }
};
