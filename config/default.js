export default {
  access_key: null,
  checkDefaultPath: null,
  checkDefaultPort: null,
  checkDefaultProtocol: 'http',
  checkDefaultVerb: 'GET',
  defaultBastionRegion: null,
  ghosting: false,
  googleAnalyticsID: 'UA-59205908-3',
  remoteDebugPort: null,
  secret_key: null,
  services: {
    analytics: 'https://myst.opsee.com',
    api: 'https://api.opsee.com',
    auth: 'https://auth.opsee.com',
    stream: 'wss://api.opsee.com/stream/',
    compost: 'https://compost.in.opsee.com'
  },
  //display vpc screen despite only having 1 vpc in environment
  showVpcScreen: false,
  //allow viewing parts of the application that need a bastion to function properly
  skipBastionRequirement: false
};