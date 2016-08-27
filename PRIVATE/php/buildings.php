<?php
$pdo = new PDO('mysql:host=localhost;dbname=raumfinder', 'root', '');

$allBuildings = [];

echo "<h2>Lade Gebaeude:</h2>";

$sql = "SELECT building.code, building.displayName, building.lat, building.lng, ".
       "      city.name as city, building_img.hasImage ".
       "FROM building ".
       "LEFT JOIN street ON street.code=building.streetCode ".
       "LEFT JOIN city ON street.cityCode = city.code ".
       "LEFT JOIN building_part ON building_part.buildingCode = building.code ".
       "LEFT JOIN building_img ON building_img.code = building.code ".
       "GROUP BY building.displayName";


$sth = $pdo->prepare($sql);
$sth->execute();
    
//$result = $sth->fetchAll(PDO::FETCH_GROUP|PDO::FETCH_UNIQUE|PDO::FETCH_ASSOC);
$result = $sth->fetchAll(PDO::FETCH_ASSOC);
echo($result);
$result = utf8ize($result);
print_r(json_encode($result, JSON_UNESCAPED_UNICODE));
echo "<br/> <br/>";


if (!is_dir('building')) {
  mkdir('building');
}
file_put_contents("building/buildings.json", json_encode($result,JSON_UNESCAPED_UNICODE));

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