var observable = require('./observable'),
    crel = require('crel');

function makeThing(){
    var data = {},
        input,
        clear,
        label;

    crel(document.body,
        input = require('./input')(data),
        clear = require('./clear')(data),
        label = require('./label')(data)
    );

    setTimeout(function(){
        input.remove();
        clear.remove();
        label.remove();
        data = input = clear = label = null;
    }, 1000);
}

window.onload = function(){

    setInterval(function(){
        for(var i = 0; i < 100; i++){
            makeThing();
        }
    },1000);
};