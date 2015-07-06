var observable = require('./observable'),
    crel = require('crel');

module.exports = function(data){
    var input = crel('input');

    input.addEventListener('keyup', function(event){
        observable.set(data, 'things', event.target.value);
    });

    observable.on(data, 'things', function(value){
        if(input.value === value){
            return;
        }

        input.value = value;
    });

    return input;
};