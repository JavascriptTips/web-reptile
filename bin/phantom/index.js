/**
 * Created by zyg on 16/5/16.
 */
var spawn = require('child_process').spawn;
var path = require('path');
var flag = require('./config/flag')

var cookieManager = require('../cookieManager');

var successFlag = flag.successFlag
var errorFlag = flag.errorFlag

var successReg = new RegExp(successFlag);
var errorReg = new RegExp(errorFlag);

var prefixLength = successReg.toString().length-2;
var failPrefixLength = errorReg.toString().length-2;

var winston = require('winston')

//进程超时未响应
var processTimeout = 10*1000;

function callbackFn(cb){

}

function phantom(phantomTaskPath,args,callback,config){

  var onCloseCb = callback || (_=>_);
  var onConsoleCb = _=>_;
  var onSuccessCb = _=>_;
  var onFailCb = _=>_;

  var fullPhantomTaskPath = path.resolve(__dirname,phantomTaskPath.replace('/','')+'.js');

  if(!config){
    config = {};
  }

  console.info('fullPhantomTaskPath:',fullPhantomTaskPath);

  var phantomProcess = spawn('phantomjs',[fullPhantomTaskPath].concat(args));


  if(!config.runInBackground){
    var timeoutSti = setTimeout(()=>{

      phantomProcess.kill('SIGKILL');

      onFailCb('process timeout');

    },processTimeout)
  }

  phantomProcess.stdout.on('data', (data) => {
    var prefixI;

    data = data.toString().replace(/\n|\r/,'');

    console.info(`stdout:${data}`);

    if(successReg.test(data)){
      clearTimeout(timeoutSti);

      prefixI = data.indexOf(successFlag)

      onSuccessCb(data.substr(prefixI+prefixLength));
      phantomProcess.kill('SIGHUP');
    }else if(errorReg.test(data)){
      clearTimeout(timeoutSti);

      prefixI = data.indexOf(errorFlag)

      onFailCb(data.substr(prefixI+failPrefixLength));
      phantomProcess.kill('SIGHUP');
    }
    onConsoleCb(data.toString());
  });

  phantomProcess.stderr.on('data', (data) => {
    winston.error(`stderr: ${data}`);
    clearTimeout(timeoutSti);
  });

  phantomProcess.on('close', (code) => {
    clearTimeout(timeoutSti);
    onCloseCb(code);
  });


  return {
    close(){
      phantomProcess.kill('SIGHUP');
    },
    onClose(cb){
      if(cb){
        onCloseCb = cb;
      }
    },
    onConsole(cb){
      if(cb){
        onConsoleCb = cb;
      }
    },
    onSuccess(cb){
      if(cb){
        onSuccessCb = cb;
      }
    },
    onFail(cb){
      if(cb){
        onFailCb = cb;
      }
    }
  }
}

phantom.normalService = function (workFile) {

  return function (url, callback) {

    var cookie = cookieManager.getCookie('m');

    if (cookie) {

      var phantomProcess = phantom(workFile, [url, cookie].concat([].slice.call(arguments,2)));

      phantomProcess.onSuccess(function (data) {
        callback(null, {
          data
        })
      });

      phantomProcess.onFail(function (data) {
        callback(data || 'open error', {code: 2});
      });

    } else {
      callback('no cookie', {code: 0});
    }
  }
}

phantom.successReg = successReg
phantom.errorReg = errorReg

module.exports = phantom