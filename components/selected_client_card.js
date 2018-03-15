import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col, Loader } from '@nio/ui-kit';

class SelectedClientCard extends React.Component {
  constructor() {
    super();
    this.state = { client: false };
    const fns = ['initializeSelectedClientData', 'handleSelectedClientData'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    this.initializeSelectedClientData(this.props.selectedClient);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pkClient } = this.props;

    if (this.props.selectedClient.MAC !== nextProps.selectedClient.MAC) {
      if (this.patronTimeout) clearTimeout(this.patronTimeout);
      if (this.patron) pkClient.removePatron(this.patron);
      this.setState({ client: false });
      this.initializeSelectedClientData(nextProps.selectedClient);
      return true;
    }
    return (this.state.client !== nextState.client);
  }

  initializeSelectedClientData(selectedClient) {
    const { pkClient, updateClientResponseState } = this.props;

    this.patronTimeout = setTimeout(() => { updateClientResponseState(true, selectedClient); }, 3000);
    pkClient.addPatron(`dni.client_stats.${selectedClient.MAC}`, { autoRemoveListeners: true }, (patron) => {
      clearTimeout(this.patronTimeout);
      updateClientResponseState(false, selectedClient.MAC);
      patron.on('message', this.handleSelectedClientData);
      return () => { patron.off('message', this.handleSelectedClientData); };
    });
  }

  handleSelectedClientData(data) {
    const json = new TextDecoder().decode(data);
    const client = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    this.setState({ client });
  }

  render() {
    const { client } = this.state;
    const { selectedClient } = this.props;

    return (
      <div>
        <h6 className="mb-3">
          {client.name || <i className="fa fa-spinner fa-spin fa-fw" />}
          {client.project && (<a href={`http://${client.project}`} className="ml-3" target="_blank">{client.project}</a>)}
          <i className="fa fa-times pull-right" />
        </h6>
        <Card id="selectedCard">
          { client ? (
            <CardBody className="content-holder">
              <Row>
                <Col xs="4">
                  <div className={`icon-holder full-width ${selectedClient.tag[0].toLowerCase()}`}>
                    <div className="tier-icon" />
                  </div>
                </Col>
                <Col xs="4">
                  <div className={`icon-holder full-width ${selectedClient.tag[1].toLowerCase()}`}>
                    <div className="brand-icon" />
                  </div>
                </Col>
                <Col xs="4">
                  <div className={`icon-holder full-width ${selectedClient.tag[2].toLowerCase()}`}>
                    <div className="os-icon" />
                  </div>
                </Col>
                <Col xs="12">
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6 className="mb-1">CPU</h6>
                  <b>cores</b> {client.CPU.cores}<br />
                  <b>speed</b> {client.CPU.clock > 1000 ? `${client.CPU.clock / 1000}GHz` : `${client.CPU.clock}MHz`}<br />
                  <b>used</b> {client.CPU.used.toFixed(2)}%
                  <hr />
                  <h6 className="mb-1">RAM</h6>
                  <b>total</b> {client.RAM.total.toFixed(2)}GB<br />
                  <b>available</b> {client.RAM.available.toFixed(2)}GB<br />
                  <b>used</b> {((client.RAM.used / client.RAM.total) * 100).toFixed(2)}%
                  <hr />
                  <h6 className="mb-1">DISK</h6>
                  <b>total</b> {client.disk.total.toFixed(2)}GB<br />
                  <b>available</b> {client.disk.available.toFixed(2)}GB<br />
                  <b>used</b> {(client.disk.used).toFixed(2)}%
                  <hr />
                  <h6 className="mb-1">NETWORK</h6>
                  <b>up</b> {client.network.up.toFixed(2)}Mb/s<br />
                  <b>down</b> {client.network.down.toFixed(2)}Mb/s
                </Col>
              </Row>
            </CardBody>
          ) : (
            <CardBody className="content-holder">
              <Loader />
            </CardBody>
          )}
        </Card>
      </div>
    );
  }
}

SelectedClientCard.propTypes = {
  pkClient: PropTypes.object.isRequired,
  updateClientResponseState: PropTypes.func.isRequired,
  selectedClient: PropTypes.object.isRequired,
};

export default SelectedClientCard;
