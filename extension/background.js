var tmpArticleText;

chrome.extension.onConnect.addListener(function(port){
    port.onMessage.addListener(function(msg){
        if(msg.status === "clicked"){
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
