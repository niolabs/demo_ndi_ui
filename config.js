export default {
  pubkeeper: {
    staticPubkeeper: true,
    pkConfig: {
      PK_HOST: 'pks.demo.niolabs.com',
      PK_PORT: 443,
      PK_SECURE: true,
      PK_JWT: '7BB1F97195DE7CA6D0CF0D3AE821BB6916C7CD0053E8E4610EECD34AEEFDB4F0',
      WS_HOST: 'wss.demo.niolabs.com',
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
