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

### Entwicklungs-Server
Mit Hilfe des Gulp-Skriptes kann der Raumfinder auf einem 
Entwicklungsserver entwickelt und getestet werden.

```gulp default```

### Build Prozess
Der Buildprozess kann mit ```gulp build``` gestartet werden.

### Aufbereiten der Daten 
Alle json-Daten der App Kollegen müssen in eine SQL-Tabelle geladen werden. Zusätzlich wir die original rf_raum_app.csv benötigt. Mit Hilfe der PHP Skripte können die WebApp json Dateien erzeugt werden. Bei builingLookup.json und buildiung.json müssen in den Dateien noch Variablennamen hingefügt werden (und Strichpunkt am Ende der Datei).