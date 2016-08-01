City Map View
=========================

    List all buildings
    -> List all: Building.json
    
    Show buildings on Map
    -> List all: Building.json
    


Building Detail View
=========================

    Show selected building street and position on map 
    -> Query BuildingCode in Building.json
                    or
    -> Get selected building of Building.json
        



Building Map View
=========================

Init
-------------------------

    List all rooms 
    -> List all roomsInBuilding.json

    Show ground floor
    -> Query Floor with lowest level >= EG
    	           or
    -> Show first element in UniqueBuildingParts.json
    
    
    Show level and building part selection for map
    -> Query for list with unique MapURI for Building
    -> If same level 2x : complex case
    -> Normal case: list all
    -> Complex case: sort by adress
    
    
    
    Show street name 
    -> Query BuildingCode in Building.json
                    or
    -> Get selected building of Building.json
    
Interaction
--------------------------

    Show room -> Click on room list
    -> Look up room 
    -> get mapID, posX/Y, 
    
    Show level -> Click on level selection
    -> Look up getMapID 
    

    
    

