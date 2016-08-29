<?php

$pdo = new PDO('mysql:host=localhost;dbname=raumfinder', 'root', '');

$allBuildings = [];

echo "<h2>Hole alle Gebaeude in Datenbank:</h2>";


$sql = "SELECT * FROM building";
foreach ($pdo->query($sql) as $row) {
    echo $row['code']." - ".$row['displayName']."<br />";
    array_push($allBuildings, $row['code']);
}

echo "<br /><b>" . count($allBuildings) . " Gebaeude gefunden</b><br />";

if (!is_dir('rooms')) {
  mkdir('rooms');
}

foreach($allBuildings as $val) {
   print $val . '<br />';

     $sql2 = "SELECT room.Code as rCode,   ".
             "       room.name as rName, room.floorCode, room.posX as pX, room.posY as pY ".
       
             "FROM building ".
             "     LEFT JOIN building_part ON building.code = building_part.buildingCode ".
             "     LEFT JOIN floor ON building_part.code = floor.buildingPart ".
             "     LEFT JOIN room ON floor.code = room.floorCode ".
             "WHERE building.code = '" . $val . "'";
    
    $sth = $pdo->prepare($sql2);
    $sth->execute();
    
    $result = $sth->fetchAll(PDO::FETCH_GROUP|PDO::FETCH_UNIQUE|PDO::FETCH_ASSOC);
    $result = utf8ize($result);
    //print_r(json_encode($result));
    echo "<br/> <br/>";

    file_put_contents("rooms/" . $val . ".json", json_encode($result));

    
};    


function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}
?>