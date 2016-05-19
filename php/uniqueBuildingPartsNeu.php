<?php
$pdo = new PDO('mysql:host=localhost;dbname=raumfinder', 'root', '');

$allBuildings = [];

echo "<h2>Hole alle Gebaeude in Datenbank:</h2>";

$sql = "SELECT * FROM buildings";
foreach ($pdo->query($sql) as $row) {
    echo $row['bCode']." - ".$row['displayName']."<br />";
    array_push($allBuildings, $row['bCode']);
}

echo "<br /><b>" . count($allBuildings) . " Gebaeude gefunden</b><br />";





foreach($allBuildings as $val) {
   print $val . '<br />';
     
    
    $sql2 = "SELECT `buildings`.`bCode`, `buildings`.`displayName`, `floor`.*, `building_part`.`address` ".
             "FROM `buildings` ".
               "LEFT JOIN `raumfinder`.`building_part` ON `buildings`.`bCode` = `building_part`.`building_code` ".
               "LEFT JOIN `raumfinder`.`floor` ON `building_part`.`bpCode` = `floor`.`buildingPart` ".
            "WHERE buildings.bCode = '". $val ."' ".
            "GROUP BY `floor`.`mapUri`, `buildings`.`displayName`".
            "ORDER BY `buildings`.`bCode` ASC, `building_part`.`address` ASC, `floor`.`mapUri` ASC";
    

    $sth = $pdo->prepare($sql2);
    $sth->execute();
    
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    $result = utf8ize($result);
    print_r(json_encode($result));
    echo "<br/> <br/>";

    file_put_contents($val . ".json", json_encode($result));


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