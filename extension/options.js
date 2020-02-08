$(function(){
    shortcutkeyOld = localStorage['shortcutkey'];
    console.log(shortcutkeyOld);

    if(shortcutkeyOld){
        $('#shortcutkey').val(shortcutkeyOld);
    }

    $('#options').submit(function(){
        shortcutkeyNew = $('#shortcutkey').val();
        if(shortcutkeyNew.match(/^[0-9a-z]?$/)){
            if(shortcutkeyNew){
                localStorage['shortcutkey'] = shortcutkeyNew;
            } else{
                localStorage.removeItem('shortcutkey');
            }
            $('#msg').text("saved").show().fadeOut(1000);
        } else{
            $('#msg').text("error").show().fadeOut(1000);
        }
    });
});