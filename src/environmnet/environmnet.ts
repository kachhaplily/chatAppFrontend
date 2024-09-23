// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const { production, domain, clientId, API_URL, redirectUrl } = {
  production: false,
  domain: 'dev-n1fu7rj2rzpwzbgy.us.auth0.com',
  clientId: 'CeoT1O6vekxHTRTpKmjQcJTv753no1OV',
  API_URL: 'https://localhost:44316',
  redirectUrl: 'http://localhost:4200',
};

export const environment = {
  production,
  API_URL,
  redirectUrl,
  auth: {
    domain,
    clientId,
    authorizationParams: {
      audience: 'https://dev-n1fu7rj2rzpwzbgy.us.auth0.com/api/v2/',
      redirect_uri: 'http://localhost:4200',
    },
    httpInterceptor: {
      allowedList: [`${API_URL}/*`],
    },
  },
};
