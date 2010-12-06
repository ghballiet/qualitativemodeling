<?
$_POST['page_title']="Qualitative Modeling Environment";
include_once('../templates/before.php');
?>
<div id="actions">
    <input type="button" value="Show Predictions" id="show_predicitons" class="top_action_button"/>
    <input type="button" value="Save" id="view_json" class="top_action_button"/>
    <input type="button" value="Reset" id="reset_json" class="top_action_button"/>
    <input type="button" value="Export to Lisp" id="export_lisp" class="top_action_button"/>
    <input type="button" value="Regenerate JSON from Lisp" id="import_lisp" class="top_action_button" />
</div>

<div id="places" class="box">
    <h2>locations</h2>
</div>
<div id="quantities" class="box">
    <h2>quantities</h2>
</div>
<div id="claims" class="box">
    <h2>hypothesized claims</h2>
</div>
<div id="facts" class="box">
    <h2>empirical facts</h2>
</div>
<div id="predictions" class="box">
    <h2>predictions</h2>
</div>

<div id="beliefs" class="box">
    <h2>beliefs</h2>
</div>
<?
include_once('../templates/after.php');
?>