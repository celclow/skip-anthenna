var tmpArticleText;

chrome.extension.onConnect.addListener(function(port){
    port.onMessage.addListener(function(msg){
        if(msg.status === "loading"){
            var autojumpFlag = JSON.parse(localStorage.getItem('autojumpFlag'));
            if(!autojumpFlag) autojumpFlag = false;
            var antennaSiteUrls = JSON.parse(localStorage.getItem('antennaSiteUrls'));
            if(!antennaSiteUrls) antennaSiteUrls = [];

            if(autojumpFlag){
                port.postMessage({status:'sendParams', antennaSiteUrls:antennaSiteUrls, tmpArticleText:tmpArticleText});
            }
        } else if(msg.status === "clicked"){
            tmpArticleText = msg.articleText;   
            backgroundConsoleLog(msg.articleText);
        } else if(msg.status === "log"){
            console.log(msg.consoleMessage);
        }
    });
});

// アイコンをクリックしたら
chrome.browserAction.onClicked.addListener(function(tab){
    backgroundConsoleLog("button clicked");
    chrome.tabs.executeScript( null, {code: "skipAntenna('"+tmpArticleText+"');"} ); // skipAntenna関数実行
});


function backgroundConsoleLog(consoleMessage){
    console.log("[background.js]: "+consoleMessage);
}
