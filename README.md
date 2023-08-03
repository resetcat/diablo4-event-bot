<p align="center">
  <a  target="blank"><img src="https://i.imgur.com/XcGHrGt.png" width="200" alt="logo" /></a>
</p>


  <p align="center">Diablo 4 discord bot that tracks events and can be controlled throught discord commands.</p>
    <p align="center">

## Description

This is simple discord bot that track three diablo 4 events and displays them on your selected channel. It has aoption to turn it off and on by calling command `!button`, it will display a button by pressing which toggles event tracking. Also there is automatic sleep timer that starts at 22:00 and ends at 10:00, but you can disable it by pressing toggle button.

## Requirements:
- [Node.js](https://nodejs.org/en/) (v14.17.0 or higher)
- [npm](https://www.npmjs.com/) (v7.16.0 or higher)
- [Docker](https://www.docker.com/) (optional)
- create your bot [token](https://discordgsm.com/guide/how-to-get-a-discord-bot-token) (optional)
- get a copy of your channel. You can find how to do this [here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)

## Installation

1. Copy this project
```bash
git clone https://github.com/resetcat/diablo4-event-bot.git
```

2. Navigate to this project folder and install dependencies
```bash
npm install
```

3. Set enviromental variables. Ether in main folder in .env file or run these commands:
```bash
set DISCORD_TOKEN=your_token_here
set DISCORD_CHANNEL_ID=your_channel_id_here
```

## Running the app
a) Just type this command in your console
```bash
$ npm run start
```
b) alternativly you can launch it using `docker`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
