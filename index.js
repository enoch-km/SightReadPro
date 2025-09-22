import {AppRegistry} from 'react-native';
import App from './src/AppDirect';
import {name as appName} from './app.json';

console.log('🚀 Starting SightReadPro App...');
console.log('App name:', appName);

AppRegistry.registerComponent(appName, () => {
  console.log('📱 Registering component:', appName);
  return App;
});

console.log('✅ App registered successfully!');

