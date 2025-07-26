import packageJson from '../package.json';
const versionJSON = packageJson.version;

export const version = `version: ${versionJSON}`;

export const info = `%c\n\n\n░██╗░░░░░░░██╗░█████╗░██╗░░░░░██╗░░██╗░█████╗░███████╗░█████╗░░█████╗░\n░██║░░██╗░░██║██╔══██╗██║░░░░░██║░██╔╝██╔══██╗██╔════╝██╔══██╗██╔═══╝░\n░╚██╗████╗██╔╝██║░░██║██║░░░░░█████═╝░╚█████╔╝██████╗░██║░░██║██████╗░\n░░████╔═████║░██║░░██║██║░░░░░██╔═██╗░██╔══██╗╚════██╗██║░░██║██╔══██╗\n░░╚██╔╝░╚██╔╝░╚█████╔╝███████╗██║░╚██╗╚█████╔╝██████╔╝╚█████╔╝╚█████╔╝\n░░░╚═╝░░░╚═╝░░░╚════╝░╚══════╝╚═╝░░╚═╝░╚════╝░╚═════╝░░╚════╝░░╚════╝░\n\n\n${version}`;

const config = {
  local: 'http://localhost:8080/api',
  staging: 'https://radio-react-backend-production.up.railway.app/api',
  production: 'https://radio-react-backend-production.up.railway.app/api',
};

export const BASE_URL = config[process.env.REACT_APP_API_URL || 'production'];
