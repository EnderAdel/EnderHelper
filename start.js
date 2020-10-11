/* EnderAdel */
const { start } = require("repl");

const readline = require("readline"), fs = require("fs"), spawn = require('child_process').spawn, execute = (content = null, exit_callback = function(){}, stdout_callback = function(){}, stderr_callback = function(){}) => {
  if(content == null || content === undefined){
    console.warn("The content is missing!");
  }else{
    const path_ = __dirname + "\\process\\executables\\", filePath_ = path_ + "executable-" + Math.round(Math.random()*10000000000000000000) + ".bat";
    fs.writeFile(filePath_, content, function(error){
      if(error){
        console.error(error);
      }else{
        var process_ = spawn('cmd.exe', ['/c', filePath_]);
        process_.stdout.on('data', function(data){
          stdout_callback(data);
        });
        process_.stderr.on('data', function(data){
          stderr_callback(data);
        });
        process_.on('exit', function(code){
          exit_callback(code);
        });
      }
    });
  }
}, rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
}), parse = data => {
  console.log("[EnderHelper] DEBUG: " + data);
  return data.replace(/\s/g, "").toLocaleLowerCase();
}, _parse = data => {
  var loop = function(){
    if(data.substring(0, 1) == " "){
      data = data.substring(1);
      loop();
    }
  };
  loop();
  loop = function(){
    if(data.substring(data.length - 1) == " "){
      data = data.substring(0, data.length - 1);
      loop();
    }
  };
  loop();
  if(data.substring(data.length - 1) !== "\\")
    data += "\\";
  console.log("[EnderHelper] DEBUG: " + data);
  return data;
};
var helpMessage = "[EnderHelper] MESSAGE: Here is a list of the avaliable commands to use:\n  - help\n  - close\n  - clear\n  - save\n  - build\n  - build-full", processPath;
rl.question("Enter your project's path: ", function(data){
  processPath = _parse(data);
  startFunction();
});
const d = data => {
  if(data.indexOf("help") == 0){
    console.log(helpMessage);
    startFunction();
  }else if(data.indexOf("close") == 0){
    process.exit(0);
  }else if(data.indexOf("clear") == 0){
    console.clear();
    startFunction();
  }else if(data.indexOf("build") == 0){
    build();
  }else if(data.indexOf("build-full") == 0){
    build(function(path){
      pack(path);
    });
  }else if(data.indexOf("save") == 0){
    save();
  }else{
    console.log("[EnderHelper] ERROR: There is no such command");
    console.log(helpMessage);
    startFunction();
  }
}, startFunction = () => {
  rl.question("EnderHelper ~ ", function(command){
    command = parse(command);
    d(command);
  });
}, save = () => {//Fix this!
  (function(){
    fs.access(processPath + ".git/", function(error){
      var done = function(){
        rl.question("EnderHelper [Save] ~ Enter a tag: ", function(data){
          rl.question("EnderHelper [Save] ~ Enter a comment: ", function(data2){
            execute("cd \"" + processPath + "\ngit tag \"" + data + "\"\n git commit -m \"" + data2 + "\"\ngit status\ngit pull origin master\ngit push -u origin master", function(code){
              console.log("[Git] exit code: " + code);
              if(code === 0){
                console.log("[EnderHelper] MESSAGE: Done!");
                startFunction();
              }else{
                console.log("[EnderHelper] ERROR: An error has occurred!");
                startFunction();
              }
            }, function(data){
              console.log(data.toString('utf8'));
            }, function(data){
              console.log(data.toString('utf8'));
            });
          });
        });
      };
      if(error){
        //It's the first time
        /*
        git init
        git add .
        git commit -m "first commit"
        git remote add origin [origin_link] ##https://github.com/EnderAdel/EnderFramework.git
        git tag v0.000.00-first
        git push -u origin master
        */
        rl.question("EnderHelper [Save] ~ Enter your origin link: ", function(data){
          //
          execute("cd \"" + processPath + "\"\ngit init\ngit add .\ngit commit -m \"first commit\"\ngit remote add origin " + data + "\ngit tag v0.000.00-first\n", function(code){
            console.log("[Git] exit code: " + code);
            if(code === 0){
              //done
              console.log("[EnderHelper] MESSAGE: this project is ready!");
              done();
            }else{
              console.log("[EnderHelper] ERROR: An error has occurred!");
              startFunction();
            }
            //done();
          }, function(data){
            console.log(data.toString('utf8'));
          }, function(data){
            console.log(data.toString('utf8'));
          });
        });
      }else{
        done();
      }
    });
  })();
}, build = (callback = null) => {
  rl.question("EnderHelper [Build] ~ Enter the output folder path: ", function(outputPath){
    outputPath = _parse(outputPath);
    rl.question("EnderHelper [Build] ~ Enter your project's name: ", function(name){
      rl.question("EnderHelper [Build] ~ Enter your icon path: ", function(icon){
        execute("cd \"" + processPath + "\"\nnpm outdated", function(code){
          if(code === 0){
            console.log("[EnderHelper] MESSAGE: all the modules are updated");
            execute("cd \"" + processPath + "\"\nelectron-packager . " + name + " --all --icon=" + icon + " no-junk no-prune", function(code){
              console.log("[Electron-Packager] exit code: " + code);
              if(code === 0){
                console.log("[EnderHelper] MESSAGE: this project is ready!");
                console.log("[EnderHelper] MESSAGE: moving the files...");
                //done();
                //
                //move example new
                fs.mkdir(outputPath + "builds\\", function(err){
                  if(err){
                    console.log(err);
                    console.log("[EnderHelper] ERROR: An error has occurred!");
                    startFunction();
                  }else{
                    execute("cd \"" + processPath + "\"\nmove \"" + name + "-linux-ia32\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-win32-ia32\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-darwin-x64\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-linux-x64\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-mas-x64\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-win32-x64\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-linux-armv7l\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-linux-arm64\" \"" + outputPath + "builds\\\"\nmove \"" + name + "-win32-arm64\" \"" + outputPath + "builds\\\"", function(code){
                      console.log("[EnderHelper-Child-Process] exit code: " + code);
                      if(code === 0){
                        console.log("[EnderHelper] MESSAGE: Done!");
                        if(callback == null){
                          startFunction();
                        }else{
                          callback(outputPath);
                        }
                      }else{
                        console.log("[EnderHelper] ERROR: An error has occurred!");
                        startFunction();
                      }
                    }, function(data){
                      console.log(data.toString('utf8'));
                    }, function(data){
                      console.log(data.toString('utf8'));
                    });
                  }
                });
              }else{
                console.log("[EnderHelper] ERROR: An error has occurred!");
                startFunction();
              }
            }, function(data){
              console.log(data.toString('utf8'));
            }, function(data){
              console.log(data.toString('utf8'));
            });
          }else{
            console.log("[EnderHelper] ERROR: You need to update all the outdated modules!");
            startFunction();
          }
        }, function(data){
          console.log(data.toString('utf8'));
        }, function(data){
          console.log(data.toString('utf8'));
        });
      });
    });
  });
};

/*
rl.question("What's the app's path? ", function(name){
  console.log(`Checking ${name}...`);
  execute("cd name", function(code){
    if(code == 0){
      rl.question("Set the app name: ", function(name_){
        rl.question("Set the app description: ", function(description){
          rl.question("Set the app icon: ", function(icon_){
            rl.question("Set the installer icon: ", function(iIcon_){
              rl.question("Set the installer's loading screen image: ", function(loading_){
                rl.question("The app's author: ", function(author_){
                  var electronInstaller = require('electron-winstaller');
                  electronInstaller.createWindowsInstaller({
                    appDirectory: './packed-versions/win32-x64',
                    outputDirectory: './output',
                    authors: author_,
                    description: description,
                    exe: name_ + '.exe',
                    loadingGif: loading_,
                    iconUrl: icon_,
                    setupIcon: iIcon_,
                    setupExe: name_ + ' installer.exe',
                    noMsi: true
                  }).then(() => {
                    console.log("The installers of your application were succesfully created!");
                  }, (e) => {
                    console.log(`An error has occurred: ${e.message}`)
                  });
                });
              });
            });
          });
        });
      });
    }else{
      console.log(`%cAn error has occured while tring to access this dircectory\nERROR_CODE: ${code}`, 'color: red');
    }
  });
});
rl.on("close", function(){
  console.log("\nClosing EnderBuilder");
  process.exit(0);
});
/*
var electronInstaller = require('electron-winstaller');
electronInstaller.createWindowsInstaller({
  appDirectory: './packed-versions/win32-x64',
  outputDirectory: './Installers',
  authors: 'EnderAdel Inc.',
  description: 'A framework for running EnderApps',
  exe: 'EnderServices.exe',
  //loadingGif: 'C:\\Users\\win10\\Desktop\\EnderServices\\EnderBuild\\resources\\install-spinner.gif',
  loadingGif: 'https://static.dribbble.com/users/1186261/screenshots/3718681/_______.gif',
  iconUrl: 'C:\\Users\\win10\\Desktop\\EnderServices\\EnderBuilder\\resources\\resources\\icon.ico',
  setupIcon: 'C:\\Users\\win10\\Desktop\\EnderServices\\EnderBuilder\\resources\\sIcon.ico',
  setupExe: 'EnderFramework installer.exe',
  noMsi: true
}).then(() => {
  console.log("The installers of your application were succesfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});
*\/*/