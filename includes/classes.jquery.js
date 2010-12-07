function Belief(item) {
    this.id = item.id;
    this.fact = item.fact;
    this.prediction = item.prediction;
    this.relation = item.relation;
    
    this.html = function() {
        s = '<p class="belief_fact">';
        s += 'Fact ' + this.fact.id + ' (' + this.fact.shortHtml();
        s += ')</p> <strong>' + this.relation + 's with</strong> <p class="belief_prediction">';
        s += 'Prediction ' + this.prediction.id + ' (' + this.prediction.shortHtml();
        s += ')</p>.';
        return s;
    }
}

function Claim(item) {
    this.id = item.id;
    this.cause = item.cause;
    this.effect = item.effect;
    this.direction = item.direction;
    this.note = item.note;
    
    this.html = function() {
        s = this.effect.shortHtml();
        s += " " + this.direction.replace(/-/gi," ") + " ";
        s += "with " + this.cause.shortHtml();
        s += ".";
        if(this.note != "nil" && this.note !="")
            s += " <span>" + this.note + "</span>";
        return s;
    };
    
    this.html_nonotes = function() {
        s = this.effect.shortHtml();
        s += " " + this.direction.replace(/-/gi," ") + " ";
        s += "with " + this.cause.shortHtml();
        s += ".";
        return s;
    }
}

function Fact(item) {
    this.id = item.id;
    this.from = item.from;
    this.to = item.to;
    this.direction = item.direction;
    this.note = item.note;
    this.html = function() {
        s = this.to.shortHtml();
        s += " " + this.direction.replace(/-/gi," ");
        s += " with " + this.from.shortHtml();
        s += ".";        
        if(this.note != "nil")
            s += " <span>" + this.note + "</span>";
        return s;        
    }
    
    this.shortHtml = function() {
        s = this.to.shortHtml();
        s += " " + this.direction.replace(/-/gi," ");
        s += " with " + this.from.shortHtml();
        return s;
    }
}

function Place(item) {
    this.id = item.id;
    this.name = item.name;
    this.is_in = item['in'];
    this.note = item.note;    
    this.html = function() {
        s = "<strong>" + this.name.replace(/-/gi," ") + "</strong>";
        if(this.is_in != null)
            s += " in <strong>" + this.is_in.name.replace(/-/gi," ") + "</strong>";
        s += ".";
        if(this.note != "nil")
            s += " <span>" + this.note + "</span>";
        return s;
    }
    
    this.fullName = function() {
        if(this.is_in != null)
            return this.name.replace(/-/gi," ") + ' in ' + this.is_in.name.replace(/-/gi," ");
        else
            return this.name.replace(/-/gi," ");
    }
}

function Prediction(item) {
    this.id = item.id;
    this.from = item.from;
    this.to = item.to;
    this.direction = item.direction;
    this.paths = item.paths;
        
    this.html = function() {
        var b = this.id.replace('p','b');
        var relation = objects['beliefs'][b].relation;
        
        var s = "";
        s += '<p class="' + relation + ' arrow">' + relation + '</p>';
        s += this.to.shortHtml();
        s += " " + this.direction.replace(/-/gi," ");
        s += " with " + this.from.shortHtml();
        s += ".";
        
        
        var t = '<div id="' + this.id + '_explanation" class="explanation">';
        if(this.paths != null) {
            t += '<h3>' + this.to.fullName() + ' ' + this.direction.replace(/-/gi," ");
            t += ' with ' + this.from.fullName() + ' because:</h3>';
            var count = 0;
            for(var i in this.paths) {
                count++;
                t += '<div class="direction" id="direction_' + this.id + '_' + this.paths[i][0] + count + '">';
                t += '<h4>' + this.paths[i][0] + '</h4>';
                for(var j in this.paths[i][1]) {
                    var c = this.paths[i][1][j];
                    t += '<p class="hidden">';
                    t += c.html_nonotes();
                    t += '</p>';
                }
                t += '</div>';
            }
        } else {
            t += '<h3>There are no causal paths from ' + this.to.fullName() + ' to ' + this.from.fullName() + '.</h3>';
        }
        t += '</div>';
        $('#wrapper').append(t);
        s += '</div>';
        return s;
    }
    
    this.shortHtml = function() {
        s = this.to.shortHtml();
        s += " " + this.direction.replace(/-/gi," ");
        s += " with " + this.from.shortHtml();
        return s;        
    }
}

function Quantity(item) {
    this.id = item.id;
    this.name = item.name;
    this.type = item.type;
    this.is_in = item['in'];
    this.note = item.note;
    
    this.shortHtml = function() {
        s = "<strong>" + this.name.replace(/-/gi," ") + "</strong>";
        if(this.is_in != null)
            s += " in <strong>" + this.is_in.name.replace(/-/gi," ") + "</strong>";
        return s;
    }
    
    this.html = function() {
        s = this.shortHtml();
        if(this.type != "nil")
            s += " is <strong>" + this.type + "</strong>";
        s += ".";
        if(this.note != "nil")
            s += " <span>" + this.note + "</span>";
        return s;
    }
    
    this.fullName = function() {
        if(this.is_in != null)
            return this.name.replace(/-/gi," ") + ' in ' + this.is_in.name.replace(/-/gi," ");
        else
            return this.name.replace(/-/gi," ");
    }
}

function newItem(item, data) {
    switch(item) {
        case "beliefs": return new Belief(data); break;
        case "claims": return new Claim(data); break;
        case "facts": return new Fact(data); break;
        case "places": return new Place(data); break;
        case "predictions": return new Prediction(data); break;
        case "quantities": return new Quantity(data); break;
    }
}