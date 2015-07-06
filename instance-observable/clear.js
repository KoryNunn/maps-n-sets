var observable = require('./observable'),
    crel = require('crel');

module.exports = function(data){
    var button = crel('button', 'Clear');

    button.addEventListener('click', function(event){
        observable.set(data, 'things', '');
    });

    return button;
};