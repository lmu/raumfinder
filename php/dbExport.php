<?php
$db = new mysqli('localhost', 'root', '', 'raumfinder');




mysql_connect("localhost", "root", "");
mysql_select_db("raumfinder");      

$res = mysql_query("SELECT `buildings`.`bCode`, `building_part`.`bpCode`, `floor`.`mapUri`, `room`.* FROM `buildings` LEFT JOIN `raumfinder`.`building_part` ON `buildings`.`bCode` = `building_part`.`building_code` LEFT JOIN `raumfinder`.`floor` ON `building_part`.`bpCode` = `floor`.`buildingPart` LEFT JOIN `raumfinder`.`room` ON `floor`.`fCode` = `room`.`floorCode` ORDER BY `buildings`.`bCode` ASC");
$records = array();


$first = true;
$buildingCode = " ";


while($obj = mysql_fetch_object($res)) {
    
    echo($obj->bCode);
    
    if($first){
        $buildingCode = $obj->bCode;
        $first= false;
    }
    
   if(strcmp($buildingCode, $obj->bCode) == 0){
       $records []= $obj;
   }else{
       file_put_contents($buildingCode . ".json", json_encode($records));
       $buildingCode = $obj->bCode;
       $records = array();
       $records []= $obj;
   }
    
}
       file_put_contents($buildingCode . ".json", json_encode($records));
    


?>