import React from 'react';
import { Col, Row, Card, CardBody, RangeSlider } from '@nio/ui-kit';

import pubkeeper_client from '../util/pubkeeper_client';

export default class AdminHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      first_run: true,
      cpu_limit: 0,
      cpu_max: 100,
      cpu_changing: false,
      ram_limit: 0,
      ram_max: 100,
      ram_changing: false,
      down_limit: 0,
      down_max: 100,
      down_changing: false,
      up_limit: 0,
      up_max: 100,
      up_changing: false,
      stressed_clients: 0,
      total_clients: 0,
      total_cpu: 0,
      available_cpu: 0,
      total_ram: 0,
      available_ram: 0,
      total_disk: 0,
      available_disk: 0,
    };
    
    const fns = ['sendBrew', 'handleSystemStatsData'];
    fns.forEach((fn) => { this[fn] = this[fn].bind(this); });
  }

  componentDidMount() {
    const app = this;
    pubkeeper_client.addBrewer('dni.admin_limits', brewer => { app.brewer = brewer ;});
    pubkeeper_client.addPatron('dni.system_stats', { autoRemoveListeners: true }, patron => patron.on('message', app.handleSystemStatsData));
  }
  
  handleSystemStatsData(data) {
    const json = new TextDecoder().decode(data);
    const system = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    
    const { cpu_limit, up_limit, down_limit, ram_limit, total_cpu, available_cpu, total_ram, available_ram, total_disk, available_disk, total_clients, stressed_clients } = system;
    this.setState({ total_cpu, available_cpu, total_ram, available_ram, total_clients, stressed_clients, total_disk, available_disk });
    
    if (cpu_limit !== undefined && !this.state.cpu_changing) {
      this.setState({ cpu_limit });
    }
    if (up_limit !== undefined && !this.state.up_changing) {
      this.setState({ up_limit });
    }
    if (down_limit !== undefined && !this.state.down_changing) {
      this.setState({ down_limit });
    }
    if (ram_limit !== undefined && !this.state.ram_changing) {
      this.setState({ ram_limit });
    }
  }
  
  sendBrew(data) {
    this.brewer.brewJSON([data]);
    setTimeout(() => { this.props.forceClientUpdate(); this.setState({ cpu_changing: false, up_changing: false, down_changing: false, ram_changing: false }); }, 1500);
  }

  render() {
    const { cpu_limit, cpu_max, ram_limit, ram_max, down_limit, down_max, up_limit, up_max, total_clients, stressed_clients, total_cpu, available_cpu, total_ram, available_ram, total_disk, available_disk } = this.state;
    
    return (
      <Row>
        <Col xs="12" lg="8" className="summary">
          <h2 className="page-title">nio distributed <br />system intelligence</h2>
          <hr />
          <Row>
            <Col xs="6" sm="3" className="summary-label border-right">
              <h4 className="m-0">{stressed_clients}/{total_clients}</h4>stressed clients
            </Col>
            <Col xs="6" sm="3" className="summary-label border-right">
              <h4 className="m-0">{Math.round(available_cpu)}/{Math.round(total_cpu)}</h4>available vCPU
            </Col>
            <Col xs="6" sm="3" className="summary-label border-right">
              <h4 className="m-0">{Math.round(available_ram)}/{Math.round(total_ram)}</h4>GB available RAM
            </Col>
            <Col xs="6" sm="3" className="summary-label">
              <h4 className="m-0">{Math.round(available_disk)}/{Math.round(total_disk)}</h4>GB available DISK
            </Col>
          </Row>
        </Col>
        <Col xs="12" className="d-lg-none">
          <hr />
        </Col>
        <Col xs="12" lg="4">
          <Row className="mb-2">
            <Col xs="3" className="text-nowrap">
              <i className="fa fa-lg fa-dashboard mr-2" />
              <span className="hidden-md-down">CPU</span>
            </Col>
            <Col xs="6">
              <RangeSlider
                color="primary"
                min={0}
                max={cpu_max}
                step={1}
                value={cpu_limit}
                tooltip={false}
                onChangeStart={() => this.setState({ cpu_changing: true })}
                onChangeComplete={() => this.sendBrew({ cpu_limit })}
                onChange={v => this.setState({ cpu_limit: v })}
              />
            </Col>
            <Col xs="3" className="text-right text-nowrap">{cpu_limit}%</Col>
          </Row>
          <Row className="mb-2">
            <Col xs="3" className="text-nowrap">
              <i className="fa fa-lg fa-microchip mr-2" />
              <span className="hidden-md-down">RAM</span>
            </Col>
            <Col xs="6">
              <RangeSlider
                color="primary"
                min={0}
                max={ram_max}
                step={1}
                value={ram_limit}
                tooltip={false}
                onChangeStart={() => this.setState({ ram_changing: true })}
                onChangeComplete={() => this.sendBrew({ ram_limit })}
                onChange={v => this.setState({ ram_limit: v })}
              />
            </Col>
            <Col xs="3" className="text-right text-nowrap">{ram_limit}%</Col>
          </Row>
          <Row className="mb-2">
            <Col xs="3" className="text-nowrap">
              <i className="fa fa-lg fa-cloud-download mr-2" />
              <span className="hidden-md-down">Down</span>
            </Col>
            <Col xs="6">
              <RangeSlider
                color="primary"
                min={0}
                max={down_max}
                step={1}
                value={down_limit}
                tooltip={false}
                onChangeStart={() => this.setState({ down_changing: true })}
                onChangeComplete={() => this.sendBrew({ down_limit })}
                onChange={v => this.setState({ down_limit: v })}
              />
            </Col>
            <Col xs="3" className="text-right text-nowrap">{down_limit}Mb</Col>
          </Row>
          <Row className="mb-1">
            <Col xs="3" className="text-nowrap">
              <i className="fa fa-lg fa-cloud-upload mr-2" />
              <span className="hidden-md-down">Up</span>
            </Col>
            <Col xs="6">
              <RangeSlider
                color="primary"
                min={0}
                max={up_max}
                step={1}
                value={up_limit}
                tooltip={false}
                onChangeStart={() => this.setState({ up_changing: true })}
                onChangeComplete={() => this.sendBrew({ up_limit })}
                onChange={v => this.setState({ up_limit: v })}
              />
            </Col>
            <Col xs="3" className="text-right text-nowrap">{up_limit}Mb</Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
