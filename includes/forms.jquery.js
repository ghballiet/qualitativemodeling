function claimsForm() {
    s += '<select name="effect">';
    for(i in objects['quantities']) {
        o = objects['quantities'][i];
        s += '<option value="' + o.id + '">' + o.fullName() + '</option>';
    }
    s += '</select>';
    s += '<select name="direction">';
    s += '<option value="increases">increases with</option>';    
    s += '<option value="does-not-change">does not change with</option>';
    s += '<option value="decreases">decreases with</option>';
    s += '</select>';
    
    s += '<select name="cause">';
    for(i in objects['quantities']) {
        o = objects['quantities'][i];
        s += '<option value="' + o.id + '">' + o.fullName() + '</option>';
    }
    s += '</select>';
    s += '<input type="hidden" name="note" value="nil" />';
    s += '<input type="hidden" name="id" value="nil" />';
    s += '<input type="button" value="Add Claim" />';
    return s;
}

function factsForm() {
    s += '<select name="to">';
    for(i in objects['quantities']) {
        o = objects['quantities'][i];
        s += '<option value="' + o.id + '">' + o.fullName() + '</option>';
    }
    s += '</select>';
    s += '<select name="direction">';
    s += '<option value="increases">increases with</option>';    
    s += '<option value="does-not-change">does not change with</option>';
    s += '<option value="decreases">decreases with</option>';
    s += '</select>';
    
    s += '<select name="from">';
    for(i in objects['quantities']) {
        o = objects['quantities'][i];
        s += '<option value="' + o.id + '">' + o.fullName() + '</option>';
    }
    s += '</select>';
    s += '<input type="hidden" name="note" value="nil" />';
    s += '<input type="hidden" name="id" value="nil" />';
    s += '<input type="button" value="Add Fact" />';
    return s;
}

function quantitiesForm() {
    s += '<input type="text" name="name" />';
    s += '<span>in</span>';
    s += '<select name="in">';
    s += '<option value="nil">       </option>';
    
    for(i in objects['places']) {
        o = objects['places'][i];
        s += '<option value="' + o.id + '">' + o.fullName() + '</option>';
    }
    
    s += '</select>';
    s += '<span>is</span>';
    s += '<select name="type">';
    s += '<option value="nil">       </option>';
    s += '<option>stable</option>';
    s += '<option>transient</option>';
    s += '</select>';
    s += '<input type="hidden" name="note" value="nil" />';    
    s += '<input type="hidden" name="id" value="nil" />';
    s += '<input type="button" value="Add Quantity" />';
    return s;
}

function placesForm() {
    s += '<input type="text" name="name" />';
    s += '<span>in</span>';
    s += '<select name="in">';
    s += '<option value="nil">       </option>';
    
    for(i in objects['places']) {
        o = objects['places'][i];
        s += '<option value="' + o.id + '">' + o.fullName() + '</option>';
    }
    
    s += '</select>';
    s += '<input type="hidden" name="note" value="nil" />';    
    s += '<input type="hidden" name="id" value="nil" />';
    s += '<input type="button" value="Add Place" />';
    return s;
}

function predictionsForm() {
    return 'Form undefined.';
}

function addForm(type) {
    $('.add_form').remove();
    console.log("Form: " + type);
    
    s = '<form id="form_' + type + '" class="add_form">';
    
    switch(type) {
        case "claims": s += claimsForm(); break;
        case "facts": s += factsForm(); break;
        case "quantities": s += quantitiesForm(); break;
        case "places": s += placesForm(); break;
        case "predictions": s += predictionsForm(); break;
    }
    
    s += "</form>";
    
    $('#' + type + ' h2').before(s);    
    $('#form_' + type + ' input[type="button"]').click(function() {
        obj = $("#form_" + type).serializeObject();
        
        addResultToJSON(obj, type);
    });
    
    $('#form_' + type).submit(function() {
        $('#form_' + type + ' input[type="button"]').click();
        return false;
    });
}

function addResultToJSON(data, type) {
    console.log('Adding new: ' + type);
    
    // normalize the name
    if("name" in data)
        data.name = data.name.replace(' ','-');
    
    // set the ID
    var max_id = generateID(type);
    data.id = max_id;
    
    console.log('Adding: ' + data.id);
    
    // add to json
    json_data[type][data.id] = data;
    
    // remake classes from json data
    make_classes(json_data, objects);
    
    // refresh data
    refresh_data(objects);
    
    // display changed data
    console.log('Changed data: ' + type);
    console.log(objects[type][data.id]);
    
    show_message('Added new item with ID <strong>' + data.id + '</strong> to <strong>' + type + '</strong>.',3000);
}