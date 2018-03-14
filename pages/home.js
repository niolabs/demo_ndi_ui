import React from 'react';
import { Col, Row, Card, CardBody } from '@nio/ui-kit';

import { createPubkeeperClient } from '../util/pubkeeper';

import AdminHeader from '../components/admin_header';
import ClientCard from '../components/client_card';
import SelectedClientCard from '../components/selected_client_card';
import SelectedRouterCard from '../components/selected_router_card';
import SelectedPrimesTestCard from '../components/selected_primestest_card';

export default class DocsPage extends React.Component {
  constructor() {
    super();
    this.groupTags = ['cloud', 'office', 'gateway', 'laptop', 'edge'];
    this.state = {
      clients: [],
      routerClients: [],
      selectedClient: false,
      isTraining: false,
    };

    const fns = ['selectClient', 'handleClientStateData', 'updateClientResponseState', 'handleRouterStateData', 'forceClientUpdate', 'startPrimesTest', 'closeModal'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    createPubkeeperClient()
      .then((pkClient) => {
        this.pkClient = pkClient;
        pkClient.connect().then(() => {
          pkClient.addPatron('dni.client_state.*', patron => patron.on('message', this.handleClientStateData));
          pkClient.addPatron('dni.router_state', patron => patron.on('message', this.handleRouterStateData));
          pkClient.addBrewer('dni.newui', (brewer) => { this.brewer = brewer; setTimeout(() => { this.forceClientUpdate(); }, 1000); });
          pkClient.addBrewer('dni.primes.start', (brewer) => { this.primesbrewer = brewer; });
        });
      })
      .catch(() => console.log('unable to locate pubkeeper config details.')); // eslint-disable-line no-console
  }

  componentWillUnmount() {
    if (this.pkClient) this.pkClient.disconnect();
  }

  forceClientUpdate() {
    this.brewer.brewJSON([{ go: true }]);
  }

  handleClientStateData(data) {
    const { clients } = this.state;
    const json = new TextDecoder().decode(data);
    const clientData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const { violations, name, tag, MAC, os, project } = clientData;
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
      thisClient.name = thisClient.ap_name;
      thisClient.MAC = thisClient.name;
      thisClient.violations = { cpu: false, down: false, up: false };
      thisClient.os = 'meraki';
      thisClient.tag = ['gateway', 'meraki'];
      thisClient.visibleRouterClientList = thisClient.router_info
        .filter(c => c.name && (c.network_up / 1024 / 1024).toFixed(1) > 0 && (c.network_down / 1024 / 1024).toFixed(1) > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
      delete thisClient.router_info;
      delete thisClient.ap_name;
    }
    this.setState({ routerClients });
  }

  closeModal() {
    this.setState({ selectedClient: false, isTraining: false });
  }

  selectClient(MAC) {
    this.closeModal();
    setTimeout(() => { this.setState({ selectedClient: MAC }); }, 250);
  }

  startPrimesTest(value) {
    this.closeModal();
    this.primesbrewer.brewJSON([{ state: true, length: value, number: 2, time: new Date().toISOString() }]);
    setTimeout(() => { this.setState({ isTraining: true }); }, 250);
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
      <div id="app-content">
        <Card id="adminHeader">
          <CardBody className="p-3">
            {this.pkClient && <AdminHeader pkClient={this.pkClient} forceClientUpdate={this.forceClientUpdate} isTraining={isTraining} startPrimesTest={this.startPrimesTest} />}
          </CardBody>
        </Card>
        <div id="clientCards">
          {this.groupTags.map((gt) => {
            const tagClients = allClients && allClients.filter(c => c.tag[0] === gt);
            return (
              <Row className="mt-3" key={gt}>
                <Col xs="6">
                  <h6>{gt}</h6>
                </Col>
                <Col xs="6" className="text-muted text-right">
                  <h6>{tagClients.length} client{tagClients.length !== 1 && 's'}</h6>
                </Col>
                <Col xs="12">
                  <hr className="mt-0 mb-2" />
                </Col>
                {tagClients.length ? tagClients.map(c => (
                  <ClientCard key={c.MAC} client={c} selectClient={this.selectClient} />
                )) : (
                  <Col xs="12" className="text-center p-1 text-muted"><small>no nodes currently registered</small></Col>
                )}
              </Row>
            );
          })}
        </div>
        <div id="selectedCardHolder" className={(selectedClient || isTraining) ? 'd-block' : 'd-none'} onClick={() => this.closeModal()}>
          { selectedClient && selectedClient.includes('meraki') ? (
            <SelectedRouterCard client={routerClients.find(r => r.name === selectedClient)} />
          ) : selectedClient && this.pkClient ? (
            <SelectedClientCard pkClient={this.pkClient} selectedClient={selectedClient} updateClientResponseState={this.updateClientResponseState} />
          ) : isTraining && this.pkClient ? (
            <SelectedPrimesTestCard pkClient={this.pkClient} />
          ) : null}
        </div>
      </div>
    );
  }
}
