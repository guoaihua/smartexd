'use strict';
var reres = angular.module('reres', []);

reres.controller('mapListCtrl', function ($scope) {
    var bg = chrome.extension.getBackgroundPage();

    //保存规则数据到localStorage
    function saveData() {
        bg.localStorage.ReResMap = angular.toJson($scope.maps);
    }

    //当前编辑的规则
    $scope.curRule = {
        req: '.*test\\.com',
        res: 'http://cssha.com',
//        type: 'file',
        checked: true
    }

    $scope.maps = bg.ReResMap;

    //编辑框显示状态
    $scope.editDisplay = 'none';

    //按钮框显示状态
//    $scope.btnDisplay = 'block';

    //编辑框保存按钮文本
    $scope.editType = '添加';

    //输入错误时候的警告
    $scope.inputError = '';

    //隐藏编辑框
    $scope.hideEditBox = function () {
        $scope.editDisplay = 'none';
//        $scope.btnDisplay = 'block';
    }

    //显示编辑框
    $scope.showEditBox = function () {
        $scope.editDisplay = 'block';
//        $scope.btnDisplay = 'none';
    }

    //验证输入合法性
    $scope.virify = function () {
        if (!$scope.curRule.req || !$scope.curRule.res) {
            $scope.inputError = '输入不能为空';
            return false;
        }
        try {
            new RegExp($scope.curRule.req)
        } catch (e) {
            $scope.inputError = 'req正则格式错误';
            return false;
        }
        $scope.inputError = '';
        return true;
    }

    // 点击添加按钮
    $scope.addRule = function () {
        $scope.curRule = {
            req: '.*test\\.com',
            res: 'http://cssha.com',
//            type: 'file',
            checked: true
        };
        $scope.editType = '添加';
        $scope.showEditBox();
    };

    //点击编辑按钮
    $scope.edit = function (rule) {
        $scope.curRule = rule;
        $scope.editType = '编辑';
        $scope.showEditBox();
    }

    //编辑后保存
    $scope.saveRule = function () {
        if ($scope.virify()) {
            if ($scope.editType === '添加') {
                $scope.maps.push($scope.curRule);
            } else {

            }
            saveData();
            $scope.hideEditBox();
        }
    };

    //删除规则
    $scope.removeUrl = function (rule) {
        for (var i = 0, len = $scope.maps.length; i < len; i++) {
            if ($scope.maps[i] === rule) {
                $scope.maps.splice(i, 1);
            }
        }
        saveData();
    }
});



var ReResMap = [];
var typeMap = {
    "txt"   : "text/plain",
    "html"  : "text/html",
    "css"   : "text/css",
    "js"    : "text/javascript",
    "json"  : "text/json",
    "xml"   : "text/xml",
    "jpg"   : "image/jpeg",
    "gif"   : "image/gif",
    "png"   : "image/png",
    "webp"  : "image/webp"
}

function getLocalStorage() {
    ReResMap = window.localStorage.ReResMap ? JSON.parse(window.localStorage.ReResMap) : ReResMap;
}

function getLocalFileUrl(url) {
    var arr = url.split('.');
    var type = arr[arr.length-1];
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, false);
    xhr.send(null);
    var content = xhr.responseText || xhr.responseXML;
    if (!content) {
        return false;
    }
    content = encodeURIComponent(
      type === 'js' ?
        content.replace(/[\u0080-\uffff]/g, function($0) {
            var str = $0.charCodeAt(0).toString(16);
            return "\\u" + '00000'.substr(0, 4 - str.length) + str;
        }) : content
    );
    return ("data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content);
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
      var url = details.url;
      for (var i = 0, len = ReResMap.length; i < len; i++) {
          var reg = new RegExp(ReResMap[i].req, 'gi');
          if (ReResMap[i].checked && ReResMap[i].res && reg.test(url)) {
              if (!/^file:\/\//.test(ReResMap[i].res)) {
//                    return ReResMap[i].type === 'file' ?
//                    {redirectUrl: ReResMap[i].res} :
//                    {redirectUrl: url.replace(reg, ReResMap[i].res)};
                  return {redirectUrl: url.replace(reg, ReResMap[i].res)};
              } else {
//                    return ReResMap[i].type === 'file' ?
//                    {redirectUrl: getLocalFileUrl(ReResMap[i].res)} :
//                    {redirectUrl: getLocalFileUrl(url.replace(reg, ReResMap[i].res))};
                  return {redirectUrl: getLocalFileUrl(url.replace(reg, ReResMap[i].res))};
              }
          }
      }
      return true;
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

getLocalStorage();
window.addEventListener('storage', getLocalStorage, false);


