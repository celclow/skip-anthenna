var port = chrome.extension.connect();
var currentUrl = location.href;
var currentHost = location.host;

var minLinkLength = 10;

$(function(){
    // ページを読み込んだらbackgroundに送る
    port.postMessage({status: "loading"});

    // リンクを踏むときは、リンクテキストを取得しbackgroundに送る  
    $("a").click(function(){
        var articleText = $.trim($(this).text());
        articleText = articleText.replace(/[wｗ]+/g,"ｗ");
        // articleText = articleText.replace(/…$/,"");
        // articleText = articleText.replace(/　?他$/,"");
        // articleText = articleText.replace(/　?←.*$/,"");
        articleText = $.trim(articleText);

        // background に送る
        backgroundConsoleLog("click link: "+articleText);
        port.postMessage({status: "clicked", articleText: articleText});
    });
});

function skipAntenna(preArticleText){

    // 枝刈り
    if(!preArticleText) return 0;
    if(preArticleText.length < minLinkLength) return 0;
    
    backgroundConsoleLog("search: "+preArticleText);

    $("a").each(function(){
        var skipArticleText = $.trim($(this).text());
        skipArticleText = skipArticleText.replace(/[wｗ]+/g,"ｗ");
        skipArticleText = skipArticleText.substr(0, preArticleText.length);
        var skipUrl = $(this).attr("href");
        //skipUrl = skipUrl.replace(/.*http:\/\//,"http://");

        // 枝刈り
        if(!skipArticleText) return 0;
        if(skipArticleText.length < minLinkLength) return 0;

        maxLength = Math.max(preArticleText.length, skipArticleText.length);
        nld = levenshteinDistance(preArticleText, skipArticleText) / maxLength;

        backgroundConsoleLog(nld.toFixed(3)+" "+skipArticleText);
        if(skipUrl.indexOf(currentHost) === -1 && nld < 0.5){
           backgroundConsoleLog("-> skip");
           window.location = skipUrl;
        } else{
           backgroundConsoleLog("-> ignore");
        }
    });
}

function backgroundConsoleLog(consoleMessage){
    port.postMessage({status: "log", consoleMessage: "[script.js]: "+consoleMessage});
}

function levenshteinDistance(s1, s2){
    //       discuss at: http://phpjs.org/functions/levenshtein/
    //      original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    //      bugfixed by: Onno Marsman
    //       revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    // reimplemented by: Alexander M Beedie
    //        example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    //        returns 1: 3

    if (s1 == s2) {
        return 0;
    }

    var s1_len = s1.length;
    var s2_len = s2.length;
    if (s1_len === 0) {
        return s2_len;
    }
    if (s2_len === 0) {
        return s1_len;
    }

    // BEGIN STATIC
    var split = false;
    try {
        split = !('0')[0];
    } catch (e) {
        split = true; // Earlier IE may not support access by string index
    }
    // END STATIC
    if (split) {
        s1 = s1.split('');
        s2 = s2.split('');
    }

    var v0 = new Array(s1_len + 1);
    var v1 = new Array(s1_len + 1);

    var s1_idx = 0,
        s2_idx = 0,
        cost = 0;
    for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
        v0[s1_idx] = s1_idx;
    }
    var char_s1 = '',
        char_s2 = '';
    for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
        v1[0] = s2_idx;
        char_s2 = s2[s2_idx - 1];

        for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
            char_s1 = s1[s1_idx];
            cost = (char_s1 == char_s2) ? 0 : 1;
            var m_min = v0[s1_idx + 1] + 1;
            var b = v1[s1_idx] + 1;
            var c = v0[s1_idx] + cost;
            if (b < m_min) {
                m_min = b;
            }
            if (c < m_min) {
                m_min = c;
            }
            v1[s1_idx + 1] = m_min;
        }
        var v_tmp = v0;
        v0 = v1;
        v1 = v_tmp;
    }
    return v0[s1_len];
}
