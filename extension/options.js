$(function(){
    display();

    $('#autojumpFlag').click(function(){
        var autojumpFlag = $('#autojumpFlag').prop('checked');
        localStorage.setItem('autojumpFlag', JSON.stringify(autojumpFlag));
    });
    
    $('#options').submit(function(){
        // テキストから配列
        // URL成形まで
        var antennaSiteUrlsText = $('#antennaSiteUrls').val();
        antennaSiteUrlsText = antennaSiteUrlsText.replace(/\r\n/g, '\n');
        antennaSiteUrlsText = antennaSiteUrlsText.replace(/\r/g, '\n');
        antennaSiteUrlsText = antennaSiteUrlsText.replace(/\n+/g, '\n');
        var antennaSiteUrls = antennaSiteUrlsText.split('\n');

        for(var i in antennaSiteUrls){
            antennaSiteUrls[i] = antennaSiteUrls[i].replace(/^https?:\/\//, '');
            if(!antennaSiteUrls[i].match(/%/)){
                antennaSiteUrls[i] = encodeURI(antennaSiteUrls[i]);
            }
            if(antennaSiteUrls[i].length < 10){
                antennaSiteUrls[i] = '';
            }
        }
        antennaSiteUrls = $.grep(antennaSiteUrls, function(e){return e !== "";});
        antennaSiteUrls.sort();
        
        localStorage.setItem('antennaSiteUrls', JSON.stringify(antennaSiteUrls));
        $('#msg').text("saved").show().fadeOut(1000);

        display();
    });

    function display(antennaSiteUrl){
        var autojumpFlag = JSON.parse(localStorage.getItem('autojumpFlag'));
        var antennaSiteUrls = JSON.parse(localStorage.getItem('antennaSiteUrls'));

        if(autojumpFlag){
            $('#autojumpFlag').prop('checked', autojumpFlag);
        }
        
        if(antennaSiteUrls){
            console.log(antennaSiteUrls);
            $('#antennaSiteUrls').val(antennaSiteUrls.join('\n'));
        }
    }

    $('#remove').click(function(){
        localStorage.removeItem('autojumpFlag');
        localStorage.removeItem('antennaSiteUrls');
    });
    
});
