# Logging plugin for Debut/Community Edition

Simple plugin shows executed orders in console.

## Install
```batch
npm install debut-plugin-log
```

## Usage
meta.ts
```javascript
import { logPlugin } from 'debut-plugin-log';

// ...

if (env === WorkingEnv.genetic) {
    bot.registerPlugins([geneticShutdownPlugin(cfg.interval)]);
} else if (env === WorkingEnv.tester) {
    bot.registerPlugins([reportPlugin()]);
    bot.plugins.report.addIndicators(bot.getIndicators());
} else if (env === WorkingEnv.production) {
    // Log in production
    bot.registerPlugins([debugPlugin(), logPlugin()]);
}

// ...
```
