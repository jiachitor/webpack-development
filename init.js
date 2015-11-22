var fs = require('fs'),
  path = require('path'),
  co = require('co'),
  replaceStream = require('replacestream');

var argv = process.argv.slice(2);

var files = ["app"];

for (var file of files) {
  if (file == argv[0]) {
    console.log("init the project of " + argv[0] + "!")
  } else {
    console.log("Without this project!")
    return;
  }
}

// 创造新的 'webpack.config.js' 文件
function initWebpackConfig(appName) {
  return new Promise(
    // The resolver function is called with the ability to resolve or
    // reject the promise
    function(resolve, reject) {

      var readStream_conf = fs.createReadStream(path.join(__dirname, 'webpack', 'webpack.config.init.js'))
        .pipe(replaceStream('config_appName', '"' + appName + '"'));
      var writeStream_conf = fs.createWriteStream(path.join(__dirname, 'webpack.config.js'));

      readStream_conf.on('data', function(chunk) { // 当有数据流出时，写入数据
        if (writeStream_conf.write(chunk) === false) { // 如果没有写完，暂停读取流
          readStream_conf.pause();
        }
      });

      writeStream_conf.on('drain', function() { // 写完后，继续读取
        readStream_conf.resume();
      });

      readStream_conf.on('end', function() { // 当没有数据时，关闭数据流
        writeStream_conf.end();
        resolve(true);
      });

    });
};


// 创造新的 'server.js' 文件
function initServer(appName) {
  return new Promise(
    // The resolver function is called with the ability to resolve or
    // reject the promise
    function(resolve, reject) {

      var readStream_server = fs.createReadStream(path.join(__dirname, 'webpack', 'webpack.server.init.js'))
        .pipe(replaceStream('config_appName', '"' + appName + '"'));
      var writeStream_server = fs.createWriteStream(path.join(__dirname, 'server.js'));

      readStream_server.on('data', function(chunk) { // 当有数据流出时，写入数据
        if (writeStream_server.write(chunk) === false) { // 如果没有写完，暂停读取流
          readStream_server.pause();
        }
      });

      writeStream_server.on('drain', function() { // 写完后，继续读取
        readStream_server.resume();
      });

      readStream_server.on('end', function() { // 当没有数据时，关闭数据流
        writeStream_server.end();
        resolve(true);
      });

    });
};

co(function *(){
  // resolve multiple promises in parallel
  var a = yield initWebpackConfig(argv[0]);
  var b = yield initServer(argv[0]);
  var res = yield [a, b];
  console.log(res);
  // => [1, 2]
}).catch(onerror);

// errors can be try/catched
co(function *(){
  try {
    yield Promise.reject(new Error('boom'));
  } catch (err) {
    console.error(err.message); // "boom"
 }
}).catch(onerror);

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}