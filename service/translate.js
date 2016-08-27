angular.module('myApp').config(function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    $translateProvider.translations('de_DE', {
        APP_NAME: 'LMU RAUMFINDER',
        APP_NAME_SHORT: 'RAUMFINDER',
        IMPRESSUM: 'Impressum',

        TRANSLATE: 'English Version',

        BACK_TO_APP: 'Zurück zum Raumfinder',
        BACK_TO_BUILDINGSEARCH: 'Nach Gebäude suchen',
        MENU_IMPRESSUM: 'Impressum Raumfinder',
        MENU_LMU: 'LMU München',
        MENU_PLAYSTORE: 'App im Google Play Store',
        MENU_GITHUB: 'Raumfinder bei GitHub',
        MENU_CONTACT: 'Kontaktformular',
        MENU_SHOW_BUILDINGMAP: 'Gebäudeplan anzeigen',
        MENU_SEARCH_ROOM: 'Raum suchen',
        MENU_SEARCH_BUILDING: 'Gebäude suchen',
        MENU_SHOW_ON_GOOGLEMAPS: 'Auf Google Maps zeigen',
        MENU_SHOW_ON_MAP: 'Auf Karte zeigen',

        SEARCH_NO_RESULTS: 'Keine Ergebnisse gefunden.',

        IMPRESSUM_LMU_DISCLAIMER: "LMU-Raumfinder wurde von Studenten der LMU erstellt und ist kein offizielles Produkt der Ludwig-Maximilians-Universität München. Die LMU unterstützt die Website bzw. App im Rahmen einer Kooperation, übernimmt jedoch keine Haftung und ist nicht für deren Inhalte verantwortlich.",

        IMPRESSUM_CONTACT_HEADLINE: 'Kontakt',
        IMPRESSUM_CONTACT: 'Bitte nutze das <a href="http://www.internetdienste.verwaltung.uni-muenchen.de/funktionen/kontakt-raumfinder/index.html">Kontaktformular</a> für Fragen, Anregungen oder Probleme.<br/>Wir freuen uns auf Dein Feedback!',
        IMPRESSUM_HELP_HEADLINE: 'Du willst helfen?',
        IMPRESSUM_HELP: 'Wir versuchen stets die Website und App zu verbessern und Fehler möglichst schnell zu beheben. Melde Dich bei uns, falls Du uns bei der Entwicklung unterstützen willst (Android, iOS, Web)!',

        ERROR_HEADLINE: 'Gebäude oder Raum konnte nicht gefunden werden (Error 404)',
        ERROR_MESSAGE: 'Leider konnte das gesuchte Gebäude oder der gesuchte Raum nicht gefunden werden.<br>&nbsp;<br>Bitte nutze das <a href="http://www.maxmediapictures.de/kontakt/index.html">Kontaktformular</a> um diesen Fehler zu melden. Vielen Dank für Dein Feedback!<br>&nbsp;</br><a href="/">Nach Gebäude suchen</a><br>&nbsp;<br>',
        ERROR_NOTE: 'Hinweis',



    });

    $translateProvider.translations('en_US', {
        APP_NAME: 'LMU ROOMFINDER',
        APP_NAME_SHORT: 'ROOMFINDER',
        IMPRESSUM: 'Imprint',

        TRANSLATE: 'Deutsche Version',

        BACK_TO_APP: 'Back to Room Finder',
        BACK_TO_BUILDINGSEARCH: 'Search building',
        MENU_IMPRESSUM: 'Imprint Room Finder',
        MENU_LMU: 'LMU Munich',
        MENU_PLAYSTORE: 'App on Google Play Store',
        MENU_GITHUB: 'Room Finder on GitHub',
        MENU_CONTACT: 'Contact form',
        MENU_SHOW_BUILDINGMAP: 'Show floor plan',
        MENU_SEARCH_ROOM: 'Search room',
        MENU_SEARCH_BUILDING: 'Search building',
        MENU_SHOW_ON_GOOGLEMAPS: 'Show on Google Maps',
        MENU_SHOW_ON_MAP: 'Show on map',

        SEARCH_NO_RESULTS: 'No results found. Sorry.',

        IMPRESSUM_LMU_DISCLAIMER: "LMU Room Finder has been developed by students of LMU Munich and is not an official service of Ludwig-Maximilians-Universität Munich. LMU Munich supports this website and the Android app as part of a cooperation, however, does not assume any liability and is not responsible for their content.",
        IMPRESSUM_ADDRESS_HEADLINE: 'Address',
        IMPRESSUM_ADDRESS: 'Max von Bülow<br/>Osterwaldstr. 59<br/>80805 Munich<br/>Germany<br/>',
        IMPRESSUM_CONTACT_HEADLINE: 'Contact',
        IMPRESSUM_CONTACT: 'Please use our <a href="http://www.maxmediapictures.de/kontakt/index.html">contact form</a> for any questions, suggestions or found errors.<br/>We look forward to your feedback!',
        
        IMPRESSUM_HELP_HEADLINE: 'You want to support us?',
        IMPRESSUM_HELP: 'We continuously try to improve our website and app. Please contact us if you want to help us developing our website or app (iOS, Android)!',

        ERROR_HEADLINE: 'This building or room could not be found (Error 404)',
        ERROR_MESSAGE: 'Unfortunately, the building or room you were looking for could not be found.<br>Please use the <a href="http://www.maxmediapictures.de/kontakt/index.html">contact form</a> to report this error.<br><a href="/">Search buildings</a><br>&nbsp;<br>',

        ERROR_NOTE: 'Note',

    });

    $translateProvider.preferredLanguage('de_DE');
});