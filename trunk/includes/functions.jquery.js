var json_data = {};
var objects = {};
var mouse_in_form = false;
var mouse_in_explanation = false;

var references = {};
references["places"] = { "places" : [ "in" ] };
references["quantities"] = { "places" : [ "in" ] };
references["facts"] = { "quantities" : [ "from", "to" ] };
references["claims"] = { "quantities" : [ "cause", "effect" ] };

var names = ['claims', 'facts', 'places', 'quantities'];

var debug = false;

function load_entity(entity) {
    var n = entity;
    json_data[n] = {};
    $.ajax({
        type: "GET",
        url: "../includes/serve_json.php?name=" + n,
        dataType: "json",
        async: false,
        complete: function(data) {
            try {
                var js = jQuery.parseJSON(data.responseText.toLowerCase());
                for(var j in js) {
                    json_data[n][js[j].id] = js[j];
                }                    
            } catch(e) {
                console.log("EXCEPTION: " + e);
            }
        }
    });
}

function load() {    
    var seen = 0;
    var total = names.length;
    
    for(i in names) {
        load_entity(names[i]);
        
        seen++;
        console.log("Loaded: " + names[i]);
        
        if(seen == total) {
            make_classes(json_data, objects);
        }
    }
    
    refresh_data(objects);
}

function make_classes(json_data, objects) {
    for(var i in json_data) {
        objects[i] = {};
        
        try {
            for(var j in json_data[i])
                objects[i][j] = newItem(i, json_data[i][j]);
        } catch(e) {
            console.log("EXCEPTION: " + e);
        }
    }
    
    // relate objects and IDs
    for(var i in objects['places']) {
        var l = objects['places'][i].is_in;
        var p = objects['places'][l];
        objects['places'][i].is_in = p;
    }
    
    for(var i in objects['facts']) {
        var f = objects['facts'][i].from;
        var q1 = objects['quantities'][f];
        objects['facts'][i].from = q1;
        
        var t = objects['facts'][i].to;
        var q2 = objects['quantities'][t];
        objects['facts'][i].to = q2;
    }
    
    for(var o in objects['quantities']) {
        var i = objects['quantities'][o].is_in;
        var p = objects['places'][i];
        objects['quantities'][o].is_in = p;
    }
    
    for(var o in objects['claims']) {
        var c = objects['claims'][o].cause;
        var q1 = objects['quantities'][c];
        objects['claims'][o].cause = q1;
        
        var e = objects['claims'][o].effect;
        var q2 = objects['quantities'][e];
        objects['claims'][o].effect = q2;
    }
    
    for(var o in objects['predictions']) {
        var f = objects['predictions'][o].from;
        var q1 = objects['quantities'][f];
        objects['predictions'][o].from = q1;
        
        var t = objects['predictions'][o].to;
        var q2 = objects['quantities'][t];
        objects['predictions'][o].to = q2;
        
        // clean up the paths
        var arr = {};
        
        for(var i in objects['predictions'][o].paths) {
            var direction = objects['predictions'][o].paths[i][0];
            arr[direction] = Array();
            
            for(var j=1; j < objects['predictions'][o].paths[i].length - 1; j++) {
                var cid = objects['predictions'][o].paths[i][j]['id'];
                arr[direction].push(objects['claims'][cid]);
            }
        }
        
        objects['predictions'][o].paths = arr;
    }

    for(var o in objects['beliefs']) {
        var f = objects['beliefs'][o].fact;
        var f2 = objects['facts'][f];
        objects['beliefs'][o].fact = f2;
    
        var p = objects['beliefs'][o].prediction;
        var p2 = objects['predictions'][p];
        objects['beliefs'][o].prediction = p2;
    }
}

function refresh_data(objects) {
    if(debug)
        console.log(objects);
    
    for(i in objects) {
        $("#" + i).html("<h2>" + i + "</h2>");
        
        add_button(i);
        
        console.log("Rendering: " + i);
        
        try {            
            for(j in objects[i]) {
                var o = objects[i][j];
                // special case for quantity time
                if(o.name == "time")
                    continue;
                var s = '<div id="' + o.id + '" class="item">';
                s += o.html();
                s += '<div class="actions">';
                s += '<input type="button" value="Edit" class="edit_button" disabled/>';            
                s += '<input type="button" value="Delete" class="delete_button"/>';
                s += '</div>';
                s += '</div>';
                $('#' + i).append(s);
            }
        } catch(error) {
            
        }
    }
    
    // fixed names for facts, claims, and places
    $('#facts h2').html('Empirical Facts');
    $('#claims h2').html('Hypothesized Claims');
    $('#places h2').html('Locations');
        
    add_button_events();
    delete_button_events();
    prediction_click_events();
}

function add_button(item) {
    var i = $("#" + item);
    $(i).append('<div id="add_' + item + '" class="add_button">Add</div>');
}

function find_all_references(type, id) {
    console.log('Searching for references: ' + type + '(' + id + ')');
    
    var remove = {};
    
    for(var kind in references)
        remove[kind] = Array();
    
    // add this initially
    remove[type].push(id);
    
    for(var place in json_data['places']) {
        for(var i=0; i < remove['places'].length; i++) {
            if(json_data['places'][place]['in'] == remove['places'][i])
                remove['places'].push(json_data['places'][place]['id']);
        }
    }

    for(var qty in json_data['quantities']) {
        for(var i=0; i < remove['places'].length; i++) {
            if(json_data['quantities'][qty]['in'] == remove['places'][i])
                remove['quantities'].push(json_data['quantities'][qty]['id']);
        }
    }

    for(var i=0; i < remove['quantities'].length; i++) {
        var value = remove['quantities'][i];
    
        for(var fact in json_data['facts']) {
            var item = json_data['facts'][fact];
        
            if(item['from'] == value || item['to'] == value) {
                var exists = false;
            
                for(var j=0; j < remove['facts'].length; j++) {
                    if(remove['facts'][j] == item['id']) {
                        exists = true;
                        break;
                    }
                }
            
                if(!exists)
                    remove['facts'].push(item['id']);
            }
        }
    
        for(var claim in json_data['claims']) {
            var item = json_data['claims'][claim];
        
            if(item['cause'] == value || item['effect'] == value) {                    
                var exists = false;
        
                for(var j=0; j < remove['claims'].length; j++) {
                    if(remove['claims'][j] == item['id']) {
                        exists = true;
                        break;
                    }
                }
        
                if(!exists)
                    remove['claims'].push(item['id']);
            }
        }
    }
    
    return remove;
}

function delete_button(item) {
    type = $(item).parent().parent().parent().attr('id');
    id = $(item).parent().parent().attr('id');
    
    // delete references
    var to_remove = find_all_references(type, id);
    
    var confirm_str = "Are you sure you want to remove " + id + " from " + type + "?";
    confirm_str += "\n\nAffected items:";
    
    for(kind in to_remove) {
        if(to_remove[kind].length > 0)
            confirm_str += "\n - " + to_remove[kind].length + " " + kind;
    }
    
    if(confirm(confirm_str)) {
        // delete from json
        console.log('Deleting: ' + id + ' from ' + type);        
        delete json_data[type][id];
        
        // delete all references
        for(kind in to_remove) {
            for(i in to_remove[kind]) {
                console.log('Deleting: ' + to_remove[kind][i] + ' from ' + kind + ' (references ' + id + ')');
                delete json_data[kind][to_remove[kind][i]];
            }
        }
        
        // remake classes
        make_classes(json_data, objects);
    
        // refresh data
        refresh_data(objects);      
        
        show_message("Removed item with ID <strong>" + id + "</strong> from <strong>" + type + "</strong> (and all referenced items).", 3000);
    }        
}

function generateID(type) {
    var type_char = "";
    var max_id = 0;
    
    for(i in objects[type]) {
        var curr_id = parseInt(objects[type][i].id.substr(1));
        type_char = objects[type][i].id.substr(0,1);
        
        if(curr_id > max_id)
            max_id = curr_id;
    }
    
    max_id++;
    
    return type_char + "" + max_id;
}


function add_button_events() {
    $('.add_button').click(function() {
        var i = $(this).attr('id').replace('add_','');        
        console.log("Add: " + i);
        addForm(i);
    });    
}

function delete_button_events() {
    $('.delete_button').click(function() {
        delete_button($(this));
    });
}

function prediction_click_events() {
    $('#predictions .item').click(function() {
        var id = $(this).attr('id');
        $('.explanation').hide();
        $('#' + id + '_explanation').fadeIn('fast');
    });
}

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

function get_beliefs() {
    var cmd = "./lisp/encode_struct.sh beliefs";
    $.post('../includes/shell_exec.php', { 'cmd' : cmd }, function(data) {
       load_entity('beliefs');
       make_classes(json_data, objects);
       refresh_data(objects);
       show_message("Loaded predictions and beliefs.",2500);
    });
}

function show_predictions() {
    try {
        var cmd = "./lisp/encode_struct.sh predictions";
        $.ajax({
            type: "post",
            url: "../includes/shell_exec.php",
            dataType: "json",
            async: false,
            data: { 'cmd' : cmd },
            complete: function(data) {
                load_entity('predictions');
                get_beliefs();
            }
        });
        
    } catch(e) {
    }
}

function view_json() {
    var jdata2 = json_data;
    
    for(var type in jdata2) {
        for(var id in json_data[type]) {
            for(key in json_data[type][id]) {
                jdata2[type][id][key] = json_data[type][id][key].toUpperCase();
            }
        }
    }
    
    $.post('../includes/view_json.php', { 'json_data' : jdata2 }, function(data) {
        show_message(data, 2500);
    });
}

function reset_json() {
    if(confirm("Are you sure you want to reset the page? All unsaved changes will be lost.")) {
        load();
    }
}

function export_to_lisp() {
    var cmd = "./lisp/export.sh ";
    show_message("Succesfully exported to Lisp.",2500);
}

function import_from_lisp() {
    for(var i in names) {
        var cmd = "./lisp/encode_struct.sh " + names[i];
        $.ajax({
            type: "post",
            url: "../includes/shell_exec.php",
            dataType: "json",
            async: false,
            data: { 'cmd' : cmd },
            complete: function(data) {
                load_entity(names[i]);
            }
        });
    }
    make_classes(json_data,objects);
    refresh_data(objects);
}

function show_message(msg, length) {
    $('#messages').html(msg);
    $('#messages').slideDown('fast').delay(length).slideUp('fast');
}

$(document).ready(function() {
    load();
    $('#view_json').click(function() {
        view_json();
    });
    
    $('#reset_json').click(function() {
       reset_json(); 
    });
    
    $('#show_predicitons').click(function() {
       show_predictions(); 
    }); 
    
    $('#export_lisp').click(function() {
        export_to_lisp();
    })
    
    $('#import_lisp').click(function() {
        import_from_lisp();
    });
    
    $('.add_form').hover(function() {
       mouse_in_form = true; 
    }, function() {
       mouse_in_form = false;
    });
    
    $('.explanation').hover(function() {
       mouse_in_explanation = true; 
    }, function() {
       mouse_in_explanation = false;
    });
    
    $('body').mouseup(function() {
        // if(!mouse_in_form)
        //     $('.add_form').remove();
        if(!mouse_in_explanation)
            $('.explanation').hide();
    });
});