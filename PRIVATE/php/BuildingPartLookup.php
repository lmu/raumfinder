<?php

$pdo = new PDO('mysql:host=localhost;dbname=raumfinder', 'root', '');

$allBuildings = [];

echo "<h2>Hole alle Gebaeude in Datenbank:</h2>";



$sql = "SELECT BTCode, BWCode FROM rooms_original GROUP BY BTCode";
$sth = $pdo->prepare($sql);
$sth->execute();
    
$result = $sth->fetchAll(PDO::FETCH_KEY_PAIR);
//$result = $sth->fetchAll(PDO::FETCH_ASSOC);
echo($result);
$result = utf8ize($result);
print_r(json_encode($result, JSON_UNESCAPED_UNICODE));

if (!is_dir('building')) {
  mkdir('building');
}
file_put_contents("building/buildingLookup.json", json_encode($result,JSON_UNESCAPED_UNICODE));


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
