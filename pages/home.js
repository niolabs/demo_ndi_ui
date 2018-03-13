import React from 'react';
import { Button, Col, Row, Card, CardBody } from '@nio/ui-kit';

import pubkeeper_client from '../util/pubkeeper_client';
import AdminHeader from '../components/admin_header';
import ClientCard from '../components/client_card';
import SelectedClientCard from '../components/selected_client_card';
import SelectedRouterCard from '../components/selected_router_card';
import TrainingPrompt from '../components/training_prompt';

export default class DocsPage extends React.Component {
  constructor() {
    super();
    this.groupTags = ['cloud', 'server', 'gateway', 'laptop', 'client'];
    this.state = {
      clients: [],
      routerClients: [],
      selectedClient: false,
      isTraining: false,
    };

    const fns = ['selectClient', 'handleClientStateData', 'updateClientResponseState', 'handleRouterStateData', 'forceClientUpdate'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;
    pubkeeper_client.connect().then((client) => {
      app.client = client;
      client.addPatron('dni.client_state.*', { autoRemoveListeners: true }, patron => patron.on('message', app.handleClientStateData));
      client.addPatron('dni.router_state', { autoRemoveListeners: true }, patron => patron.on('message', app.handleRouterStateData));
      client.addBrewer('dni.newui', brewer => { app.brewer = brewer; setTimeout(() => { app.forceClientUpdate(); }, 1000); });
    }).catch(e => console.error(e)); // eslint-disable-line no-console
  }

  componentWillUnmount() {
    pubkeeper_client.disconnect();
  }

  forceClientUpdate() {
    this.brewer.brewJSON([{ go: true }]);
  }

  handleClientStateData(data) {
    const { clients } = this.state;
    const json = new TextDecoder().decode(data);
    const { violations, name, tag, MAC, os, project } = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const clientIndexInClientArray = clients.findIndex(c => c.MAC === MAC);
    if (clientIndexInClientArray !== -1) {
      clients[clientIndexInClientArray] = { violations, name, tag, MAC, os, project };
    } else {
      clients.push({ violations, name, tag, MAC, os, project })
    }
    this.setState({ clients });
  }

  handleRouterStateData(data) {
    const json = new TextDecoder().decode(data);
    const newVars = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const routerClients = newVars.network;
    for (let i = 0; i < routerClients.length; i += 1) {
      const thisClient = routerClients[i];
      thisClient.name = `meraki - ${thisClient.ap_name}`;
      thisClient.MAC = thisClient.name;
      thisClient.violations = { cpu: false, down: false, up: false };
      thisClient.os = 'meraki';
      thisClient.tag= 'gateway|router';
      thisClient.visibleRouterClientList = thisClient.router_info
        .filter(c => c.name && (c.network_up / 1024 / 1024).toFixed(1) > 0 && (c.network_down / 1024 / 1024).toFixed(1) > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
      delete thisClient.router_info;
      delete thisClient.ap_name;
    }
    this.setState({ routerClients });
  }

  selectClient(MAC = false) {
    this.setState({ selectedClient: MAC === this.state.selectedClient ? false : MAC });
  }

  updateClientResponseState(state, selectedClient) {
    const { clients } = this.state;
    clients[clients.findIndex(c => c.MAC === selectedClient )].nonResponsive = state;
    this.setState({ clients });
    if (selectedClient === this.state.selectedClient && state) this.selectClient();
  }


  render() {
    const { clients, routerClients, selectedClient, isTraining } = this.state;

    const allClients = clients.concat(routerClients);

    return (
      <div>
        <Card id="adminHeader">
          <CardBody className="p-3">
            {this.client && <AdminHeader forceClientUpdate={this.forceClientUpdate} />}
          </CardBody>
        </Card>
        <Card id="trainingPrompt">
          <CardBody className="p-2">
            <TrainingPrompt />
          </CardBody>
        </Card>
        <Row>
          <Col id="clientCards" xs="12" md={selectedClient ? '8': '12'}>
            {this.groupTags.map(gt => {
              const tagClients = allClients && allClients.filter(c => c.tag.includes(gt));
              return (
                <Row className="mt-3" key={gt}>
                  <Col xs="6">
                    <h6>{gt === 'client' ? 'edge' : gt === 'gateway' ? 'network' : gt}</h6>
                  </Col>
                  <Col xs="6" className="text-muted text-right">
                    <h6>{tagClients.length} client{tagClients.length !== 1 && 's'}</h6>
                  </Col>
                  <Col xs="12">
                    <hr className="mt-0 mb-2" />
                  </Col>
                  {tagClients.length ? tagClients.map(c => (
                    <Col
                      key={c.MAC}
                      onClick={() => this.selectClient(c.MAC)}
                      xs="12"
                      sm={selectedClient ? "12" : "6"}
                      md={selectedClient ? "6" : "4"}
                      lg={selectedClient ? "4" : "3"}
                      xl={selectedClient ? "3" : "2"}
                      className={`mb-3 client-card ${selectedClient === c.MAC && 'current-small'} ${c.os.toLowerCase()} ${c.nonResponsive && 'non-responsive'} ${(c.violations.cpu || c.violations.up || c.violations.ram || c.violations.down) && 'stressed'}`}>
                      <ClientCard client={c} />
                    </Col>
                  )) : (
                    <Col xs="12" className="text-center p-1 text-muted"><small>no nodes currently registered</small></Col>
                  )}
                </Row>
              );
            })}
          </Col>
          {selectedClient && (
            <Col id="selectedCardHolder" xs="12" md="4" className="mt-3" onClick={() => this.selectClient()}>
              <h6 className="text-right">node detail</h6>
              <hr className="mt-0 mb-2" />
              { selectedClient.includes('meraki') ? (
                <SelectedRouterCard client={routerClients.find(r => r.name === selectedClient)} />
              ) : (
                <SelectedClientCard selectedClient={selectedClient} updateClientResponseState={this.updateClientResponseState} />
              )}
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
