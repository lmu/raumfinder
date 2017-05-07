# LMU Raumfinder

Der LMU Raumfinder ist eine Web- und Android-Applikation mit der Gebäude 
und Räume an der Ludwig-Maximilians-Universität München gefunden und 
geteilt werden können. Ziel des Projekts ist es, die Orientierung auf 
dem verteilten Campus der LMU zu erleichtern.

## Der Online Raumfinder 

Die Webversion des LMU Raumfinders basiert auf einer Angular 1.x Webapp, 
ein paar PHP-Skripten zur Aufbereitung der Rohdaten und einem Gulp-Skript 
zum Bauen der Applikation. 
Der Raumfinder kann auf einem statischen Webserver betrieben werden. Alle 
benötigten Raum- und Gebäudeinformationen liegen in vorab generierten 
json Dateien, die bei Bedarf nachgeladen werden. Durch diesen Aufbau kann 
der Raumfinder direkt in die Haupseite der LMU integriert werden.

## Gulp-Skript

Mit Hilfe des Gulp-Skriptes kann der Raumfinder auf einem 
Entwicklungsserver entwickelt und getestet werden.

```gulp default```

Der Buildprozess kann mit ```gulp build``` gestartet werden.
