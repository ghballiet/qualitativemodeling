<?php
// hide errors
// ini_set("display_errors", 0);

$data = $_REQUEST['json_data'];

foreach($data as $key => $value) {
    $filename = sprintf("json/%s.json",$key);
    
    $f = fopen($filename, "w");
    
    fwrite($f, '[');
    
    try {
        $i = 1;
        $j = count($value);
        foreach($value as $key2 => $value2) {
            fwrite($f, json_encode($value2));
            if($i < $j) {
                fwrite($f, ",");
                $i++;
            }
        }
    } catch(Exception $e) {
        echo $e;
    }
    
    fwrite($f, ']');
    
    fclose($f);
}

echo "All files successfully written.";
?>