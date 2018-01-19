import React from 'react';
import { Navbar, NavbarBrand, } from '@nio/ui-kit';

import Routes from './routes';
import '../assets/app.scss';

const App = () => (
  <div>
    <Navbar id="app-nav" color="inverse" fixed="top" dark>
      <NavbarBrand>
        <div id="logo" />
      </NavbarBrand>
    </Navbar>
    <div id="app-container">
      <Routes />
    </div>
  </div>
);

export default App;
