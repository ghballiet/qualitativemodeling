function Place(id, name, is_in, note) {
    this.id = id;
    this.name = name;
    this.is_in = is_in;
    this.note = note;
    
    this.toHtml = function() {
        var s = '';
        s += '<div class="place item">';
        s += '<h2>' + this.name + '</h2>';
        s += '<ul>';
        s += '<li><strong>ID:</strong> ' + this.id + '</li>';
        s += '<li><strong>Name:</strong> ' + this.name + '</li>';
        s += '<li><strong>In:</strong> ' + this.is_in + '</li>';
        s += '<li><strong>Note:</strong> ' + this.note + '</li>';
        s += '</ul>';
        s += '</div>';
        return s;
    };
}