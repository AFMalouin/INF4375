# Guide de correction
## Point développés
### A1 (15xp)
#### Où le trouver?
Les requêtes HTTP sont effectuées dans les fichiers `~/models/rink.js`, `~/models/slide.js` et `~/models/pool.js`, le résultat de ces requêtes est converti dans le fichier format-helpers.js et les données sont storés par la fonction save du fichier db.js dans une db nommée `tp1` contenant une collection nommée `installations`.
#### Comment le tester?
La récupération des données se fait au démarrage de l'application ainsi que chaque jour à minuit.

Il est possible de récupérer les données récupérés directement de la base do données Mongo avec les commandes suivantes dans la console Mongo:

`use tp1`

`db.installations.find();`
### A2 (5xp)
#### Où le trouver?
Le cron est configuré à la fin du fichier `~/app.js`.
#### Comment le tester?
Le moment de la journée (heure, minute) où le cron est exécuté peut être modifié dans le fichier `~/config.js`.
### A3 (5xp)
#### Où le trouver?
La route est configurée dans le fichier `~/controllers/index.js`.

La dcoumentation RAML est déclarée dans le fichier `~/controllers/doc/index.raml`
#### Comment le tester?
La documentation est disponible à l'adresse `http://localhost:3000/doc`.
### A4 (10xp)
#### Où le trouver?
La route `/installations` et ses paramètres sont configurés dans le fichier `~/controllers/index.js`. 

Le fichier `~/models/installation.js` s'occuppe de faire la recherche par le biais de la fonction `find` du fichier `~/db/db.js`.
#### Comment le tester?
L'adresse `http://localhost:3000/installations` retourne toutes les installations disponibles.

L'adresse `http://localhost:3000/installations?arrondissement={arrondissement}` retourne toutes les installations pour l'arrondissement envoyé en paramètre. 

L'addresse `http://localhost:3000/installations/{id}` où {id} représente l'id de l'installation à trouver, retourne une seule installation.
### A5 (10xp)
#### Où le trouver?
Le formulaire est déclaré dans le fichier `~/views/layout.pug` et on peut trouver la requête ajax dans le fichier `~/public/scripts.js`.
#### Comment le tester?
Le formulaire est visible sur la page `http://localhost:3000/` sous la section "Recherche par arrondissement".
### A6 (10xp)
#### Où le trouver?
La liste décourlante est déclarée dans le fichier `~/views/layout.pug` et on peut trouver la requête ajax dans le fichier `~/public/scripts.js`.
#### Comment le tester?
La liste déroulante est visible sur la page `http://localhost:3000/` sous la section "Recherche par nom".
### C1 (10xp)
#### Où le trouver?
La route est configurée dans le fichier `~/controllers/index.js`.

Le fichier `~/models/installation.js` s'occuppe de faire la recherche par le biais de la fonction `find` du fichier `~/db/db.js`.
#### Comment le tester?
L'adresse `http://localhost:3000/mauvaisesconditions.json` retourne une liste JSON de toutes les installations en mauvaise condition.
### C2 (10xp)
#### Où le trouver?
La route est configurée dans le fichier `~/controllers/index.js`.

Le fichier `~/models/installation.js` s'occuppe de faire la recherche par le biais de la fonction `find` du fichier `~/db/db.js` et la conversion de format par le biais de la fonction `jsonToXml` du fichier `~/helpers/format-helper.js`.
#### Comment le tester?
L'adresse `http://localhost:3000/mauvaisesconditions.xml` retourne une liste XML de toutes les installations en mauvaise condition.
### C3 (5xp)
#### Où le trouver?
La route est configurée dans le fichier `~/controllers/index.js`.

Le fichier `~/models/installation.js` s'occuppe de faire la recherche par le biais de la fonction `find` du fichier `~/db/db.js` et la conversion de format par le biais de la fonction `jsonToCsv` du fichier 
#### Comment le tester?
L'adresse `http://localhost:3000/mauvaisesconditions.csv` retourne une liste CSV de toutes les installations en mauvaise condition.
### D1 (15xp)
#### Où le trouver?
La route est configurée dans le fichier `~/controllers/index.js`, l'opération de modification est effectuée par la fonction `updateInstallation` du fichier `~/db/db.js`.
#### Comment le tester?
Envoyer une requête HTTP `PUT` à l'addresse `http://localhost:3000/installations/{id}` où {id} représente l'id de la glissade à modifier, avec un body contenant les champs à modifier. Le schéma de l'objet JSON à envoyer dans le body de la requête est disponible dans le fichier `~/controllers/schemas/change-single-installation.json`.
### D2 (5xp)
#### Où le trouver?
La route est configurée dans le fichier `~/controllers/index.js`, l'opération de suppression est effectuée par la fonction `deleteInstalaltion` du fichier `~/db/db.js`.
#### Comment le tester?
Envoyer une requête HTTP `DELETE` à l'addresse `http://localhost:3000/installations/{id}` où {id} représente l'id de la glissade à supprimer.
### F1 (20xp)
#### Où le trouver?
La configuration pour le déploiement sur Heroku se retrouve dans le fichier `~/config.js`
#### Comment le tester?
L'application est disponible sur Heroku à l'adresse `https://agile-earth-61766.herokuapp.com/`