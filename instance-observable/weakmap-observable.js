var WeakMap = require('es6-weak-map'),
    trackedInstances = new WeakMap();

function on(object, key, handler){
    var type = typeof object;

    if(!object || (type !== 'object' && type !== 'function')){
        throw new Error('value was not an object or function');
    }

    var objectEvents = trackedInstances.get(object);

    if(!objectEvents){
        objectEvents = {};
        trackedInstances.set(object, objectEvents);
    }

    var listeners = objectEvents[key];

    if(!listeners){
        listeners = [];
        objectEvents[key] = listeners;
    }

    listeners.push(handler);
}

function emit(object, key, value){
    var objectEvents = trackedInstances.get(object);

    if(!objectEvents){
        return;
    }

    var listeners = objectEvents[key];

    if(!listeners){
        return;
    }

    listeners.forEach(function(listener){
        listener(value);
    });
}

function set(object, key, value){
    object[key] = value;
    emit(object, key, value);
}

module.exports = {
    on: on,
    emit: emit,
    set: set
};