<?php
mysql_connect("localhost", "root", "");
mysql_select_db("raumfinder");      

$res = mysql_query(
"SELECT `buildings`.`bCode`, `buildings`.`displayName`, `floor`.*, `building_part`.`address` ".
"FROM `buildings` ".
   "LEFT JOIN `raumfinder`.`building_part` ON `buildings`.`bCode` = `building_part`.`building_code` ".
   "LEFT JOIN `raumfinder`.`floor` ON `building_part`.`bpCode` = `floor`.`buildingPart` ".
"GROUP BY `floor`.`mapUri`, `buildings`.`displayName`".
"ORDER BY `buildings`.`bCode` ASC, `building_part`.`address` ASC, `floor`.`mapUri` ASC");

$records = array();


$first = true;
$buildingCode = " ";


while($obj = mysql_fetch_object($res)) {
    
    echo($obj);
    
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