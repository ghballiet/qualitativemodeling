<?
include_once('../templates/before.php');
?>
<pre id="json_code">
</pre>

<div id="quantities">
    
</div>

<script type="text/javascript">
    $(document).ready(function() {
        $.get('quantities.json.php', function(data) {
            $('#json_code').append(data);
            var quantities = jQuery.parseJSON(data);
            for(var i in quantities) {
                var q = quantities[i];
                var qu = new Quantity(q.id, q.name, q.type, q.in, q.note);
                $('#quantities').append(qu.toHtml());
            }
        });
    });
</script>
<?
include_once('../templates/after.php');
?>