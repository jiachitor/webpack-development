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

// 创造新的 'js' 文件
function init(appName,src_file,to_file) {
  return new Promise(
    // The resolver function is called with the ability to resolve or
    // reject the promise
    function(resolve, reject) {

      var readStream = fs.createReadStream(path.join(__dirname, 'webpack', src_file))
        .pipe(replaceStream('config_appName', '"' + appName + '"'));
      var writeStream = fs.createWriteStream(path.join(__dirname, to_file));

      readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
        if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流
          readStream.pause();
        }
      });

      writeStream.on('drain', function() { // 写完后，继续读取
        readStream.resume();
      });

      readStream.on('end', function() { // 当没有数据时，关闭数据流
        writeStream.end();
        resolve(true);
      });

    });
};

co(function *(){
  // resolve multiple promises in parallel
  var a = yield init(argv[0],'webpack.config.init.js','webpack.config.js');
  var b = yield init(argv[0],'webpack.server.init.js','server.js');
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