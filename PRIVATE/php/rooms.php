<?php
$db = new mysqli('localhost', 'root', '', 'raumfinder');




mysql_connect("localhost", "root", "");
mysql_select_db("raumfinder");      

$res = mysql_query("SELECT building.code as bCode, building_part.code as bpCode, floor.mapUri, ".
                   "       room.Code as rCode, room.name as rName, room.floorCode, room.posX as pX, room.posY as pY ".
       
                   "FROM building ".
                   "     LEFT JOIN building_part ON building.code = building_part.buildingCode ".
                   "     LEFT JOIN floor ON building_part.code = floor.buildingPart ".
                   "     LEFT JOIN room ON floor.code = room.floorCode ".
                   "ORDER BY building.code ASC");


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