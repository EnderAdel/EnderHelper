var electronInstaller = require('electron-winstaller');
electronInstaller.createWindowsInstaller({
  appDirectory: './packed-versions/win32-x64',
  outputDirectory: './Installers',
  authors: 'EnderAdel Inc.',
  owners: 'EnderAdel Inc.',
  description: 'A framework for running EnderApps',
  exe: 'EnderServices.exe',
  loadingGif: 'C:\\Users\\win10\\Desktop\\EnderServices\\Build\\resources\\install-spinner.gif',
  iconUrl: 'C:\\Users\\win10\\Desktop\\EnderServices\\Build\\resources\\icon.ico',
  setupIcon: 'C:\\Users\\win10\\Desktop\\EnderServices\\Build\\resources\\sIcon.ico',
  setupExe: 'EnderFramework installer.exe',
  noMsi: true
}).then(() => {
  console.log("The installers of your application were succesfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});