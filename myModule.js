
exports.getDate = function(){
    today = new Date();
    var options={
        month:"long",
        day:"numeric",
        weekday:"long",
        year:"numeric"
    }
    return  today.toLocaleDateString("en-US",options);
}

exports.getDay= function(){
    today = new Date();
    var options={
        weekday:"long",
    }
    return  today.toLocaleDateString("en-US",options);
}
