<?
include_once('../templates/before.php');
?>
<pre id="places_json_code">
</pre>

<div id="places">
    
</div>

<script type="text/javascript">
    $(document).ready(function() {
        $.get('places.json.php', function(data) {
            $('#places_json_code').append(data);
            var places = jQuery.parseJSON(data);
            for(var i in places) {
                var p = places[i];
                var pl = new Place(p.id, p.name, p.in, p.note);
                $('#places').append(pl.toHtml());
            }
        });
    });
</script>
<?
include_once('../templates/after.php');
?>