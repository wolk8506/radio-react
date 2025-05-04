// export const BASE_URL = 'http://localhost:8080/api';
// export const BASE_URL = 'https://radioreactbackend-2pp3ilh0.b4a.run/api';
// export const BASE_URL = 'https://radio-react-backend-production.up.railway.app/api';

// --------------------------------------------------------------------------------------

export const version = 'version: 1.0.9';

export const info = `%c\n\n\n░██╗░░░░░░░██╗░█████╗░██╗░░░░░██╗░░██╗░█████╗░███████╗░█████╗░░█████╗░\n░██║░░██╗░░██║██╔══██╗██║░░░░░██║░██╔╝██╔══██╗██╔════╝██╔══██╗██╔═══╝░\n░╚██╗████╗██╔╝██║░░██║██║░░░░░█████═╝░╚█████╔╝██████╗░██║░░██║██████╗░\n░░████╔═████║░██║░░██║██║░░░░░██╔═██╗░██╔══██╗╚════██╗██║░░██║██╔══██╗\n░░╚██╔╝░╚██╔╝░╚█████╔╝███████╗██║░╚██╗╚█████╔╝██████╔╝╚█████╔╝╚█████╔╝\n░░░╚═╝░░░╚═╝░░░╚════╝░╚══════╝╚═╝░░╚═╝░╚════╝░╚═════╝░░╚════╝░░╚════╝░\n\n\n${version}`;

const config = {
  local: 'http://localhost:8080/api',
  staging: 'https://radio-react-backend-production.up.railway.app/api',
  production: 'https://radio-react-backend-production.up.railway.app/api',
};

export const BASE_URL = config[process.env.REACT_APP_API_URL || 'production'];
