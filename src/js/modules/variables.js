import config from './config';

const variables = {
  integrations: {
    slack: {
      endpoints: {
        auth: 'https://slack.com/oauth/authorize',
        token: 'https://slack.com/api/oauth.access',
        test: 'https://slack.com/api/auth.test',
        postMessage: 'https://slack.com/api/chat.postMessage',
        userInfo: 'https://slack.com/api/users.info'
      },
      creds: {
        client_id: '3378465181.4743809532',
        client_secret: config.slackClientSecret
      }
    }
  }
};

export default variables;