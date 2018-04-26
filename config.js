export default {
  pubkeeper: {
    staticPubkeeper: true,
    pkConfig: {
      PK_HOST: 'pk.demo.niolabs.com',
      PK_PORT: 443,
      PK_SECURE: true,
      PK_JWT: 'supersecretdemotokenzforthetokendemoz',
      WS_HOST: 'ws.demo.niolabs.com',
      WS_PORT: 443,
      WS_SECURE: true,
    },
  },
  auth0: {
    loginRequired: true,
    webAuth: {
      domain: 'nio.auth0.com',
      clientID: 'quLReF2fOEnrBFtLA5yuh0pnuRUEuCVd',
      audience: 'https://api.n.io/v1',
      responseType: 'token',
      redirectUri: `${window.location.origin}?authorize=true`,
      leeway: 60,
      __disableExpirationCheck: true,
    },
  },
};
