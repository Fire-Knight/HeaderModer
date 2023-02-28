$(function(){
    $('#btn1').click(function(){
        var bg = chrome.extension.getBackgroundPage();
        bg.downloadRequest();
    });
});

$(function(){
    $('#btn2').click(function(){
        var bg = chrome.extension.getBackgroundPage();
        bg.clearRequestContentList();
    });
})