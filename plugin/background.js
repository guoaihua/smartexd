let rules = null;
chrome.storage.local.get(null,function (items) {
    rules = items
})

chrome.webRequest.onBeforeRequest.addListener(function(details){
    let url = details.url;
    let redirectUrl = "";
    let rulekeys = Object.keys(rules)

    if(!rulekeys.length){
        return;
    }

    for(let item in rules){
        // 取出规则，开始匹配.data 包含rule、response、disable
        let data = rules[item];
        if(data && data.disable){
            // disable 为true的参数，结束该规则的后续判断
            continue
        }else {

            if( isRegExp(data.rule) && data.rule.test(url)){
                redirectUrl =  url.replace(data.rule,data.response)
            }else if(url.includes(data.rule)){
                redirectUrl = url.replace(data.rule,data.response)
            }
        }
    }


    if(redirectUrl){
        return {redirectUrl:redirectUrl}
    }

},{urls: ["<all_urls>"]},['blocking'])



function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]'
}

function updateRules(newRules) {
    rules = newRules
}

