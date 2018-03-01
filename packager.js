const packager = require('electron-packager');
const path = require('path');

const argv = require('yargs').argv;

const supportedPlatforms = ['linux', 'darwin'];
const platfromIcons = {
  'linux': path.join(__dirname, 'icon.png'), 
  'darwin': path.join(__dirname, 'icon.icns')
};

if(supportedPlatforms.indexOf(argv.platform) >= 0 ){
  const options = {
    dir: __dirname,
    platform: argv.platform,
    overwrite: true,
    icon: platfromIcons[argv.platform]
  }  
  packager(options).then((appPaths) => {
    console.log(appPaths); 
  }).catch(error => () => console.error(error));
}else{
  console.log('Unsupported Platform');
}