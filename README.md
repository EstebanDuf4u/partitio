# Partitio

Partitio est une application React + Java Spring Boot avec une base PostgreSQL. Le projet est lance avec Docker Compose, et le schema de base de donnees est gere par Flyway.

## Demarrage rapide

Remplir le .env avec le .env.example, et le mettre dans le bon dossier partitio

Depuis la racine du projet :

```bash
docker compose up -d --build
```

L'application est ensuite disponible ici :

```text
http://localhost:8081
```

Pages front utiles :

```text
http://localhost:8081/signup
```

API utile :

```text
GET  http://localhost:8081/api/health
POST http://localhost:8081/api/signup
POST http://localhost:8081/api/login
```

Pour arreter les conteneurs :

```bash
docker compose down
```

Pour supprimer aussi le volume PostgreSQL et repartir d'une base vide :

```bash
docker compose down -v
```

## Structure du projet

```text
.
├── backend/             # API Java Spring Boot
├── db/migrations/       # Migrations Flyway SQL
├── partitio/            # Front React/Vite
├── docker-compose.yml   # Stack Docker complete
├── .env                 # Variables locales non versionnees
└── .env.example         # Exemple de variables pour nouveaux devs
```

## Docker Compose

Le fichier `docker-compose.yml` declare quatre services :

```text
postgres  # Base PostgreSQL 16
flyway    # Applique les migrations SQL avant le backend
backend   # API Java Spring Boot sur le port 3000
frontend  # App React servie par Nginx sur le port 8081
```

Ordre de demarrage :

1. `postgres` demarre et attend d'etre healthy.
2. `flyway` applique les migrations dans `db/migrations`.
3. `backend` demarre quand Flyway a termine.
4. `frontend` demarre et proxy les appels `/api` vers le backend.

## Variables d'environnement

Les variables sont dans `.env`. Ce fichier est ignore par git, donc il ne faut pas compter dessus pour partager la config.

Pour creer un `.env` sur une nouvelle machine :

```bash
cp .env.example .env
```

Variables importantes :

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD

BACKEND_PORT
FRONTEND_PORT

SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD

FLYWAY_URL
FLYWAY_USER
FLYWAY_PASSWORD
```

Par defaut :

```text
Frontend: http://localhost:8081
Backend:  http://localhost:3000
Postgres: localhost:5432
```

## Backend Java

Le backend est dans `backend/`. C'est une API Spring Boot Java 21.

### Fichiers principaux

```text
backend/pom.xml
```

Configure le projet Maven, Java 21, Spring Boot, JDBC, validation, PostgreSQL et BCrypt.

```text
backend/Dockerfile
```

Construit l'API en deux etapes :

1. image Maven pour compiler le `.jar`
2. image Java JRE pour executer `app.jar`

```text
backend/src/main/resources/application.properties
```

Lit la config runtime depuis les variables d'environnement Docker :

```text
server.port
spring.datasource.url
spring.datasource.username
spring.datasource.password
```

### Code Java

```text
backend/src/main/java/com/partitio/PartitioApplication.java
```

Point d'entree Spring Boot.

```text
backend/src/main/java/com/partitio/controllers/
```

Contient les endpoints HTTP :

```text
HealthController.java  # GET /api/health
SignupController.java  # POST /api/signup
LoginController.java   # POST /api/login
```

```text
backend/src/main/java/com/partitio/repositories/UserRepository.java
```

Contient les requetes SQL vers la table `users`.

Methodes actuelles :

```text
create(...)       # Cree un utilisateur
findByEmail(...)  # Trouve un utilisateur par email
```

```text
backend/src/main/java/com/partitio/models/User.java
```

Modele Java representant un utilisateur lu en base.

```text
backend/src/main/java/com/partitio/dtos/
```

Objets d'entree/sortie de l'API :

```text
SignupRequest.java
LoginRequest.java
UserResponse.java
ErrorResponse.java
```

```text
backend/src/main/java/com/partitio/config/
```

Configuration technique :

```text
PasswordConfig.java  # BCryptPasswordEncoder
WebConfig.java       # CORS pour /api/**
```

### Tests backend

Les tests unitaires Java sont dans :

```text
backend/src/test/java/
```

Ils couvrent les controleurs, DTO, configuration, service JWT et repository backend avec JUnit 5, Mockito et Spring Boot Test.

Lancer les tests backend :

```bash
cd backend
mvn test
```

Un rapport de couverture JaCoCo est genere pendant les tests :

```text
backend/target/site/jacoco/index.html
```

Les tests Java couvrent le backend Spring Boot. Le frontend React/Vite n'est pas couvert par ces tests Java.

### Endpoints backend

Healthcheck :

```http
GET /api/health
```

Reponse :

```json
{ "status": "ok" }
```

Inscription :

```http
POST /api/signup
Content-Type: application/json
```

Body :

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@test.fr",
  "password": "password123",
  "terms": true
}
```

Connexion :

```http
POST /api/login
Content-Type: application/json
```

Body :

```json
{
  "email": "jane.doe@test.fr",
  "password": "password123"
}
```

Les mots de passe sont hashes avec BCrypt avant stockage.

## Base de donnees et Flyway

Les migrations sont dans :

```text
db/migrations/
```

Migration actuelle :

```text
V1__create_users.sql
```

Elle cree la table `users` :

```text
id
first_name
last_name
email
password_hash
accepted_terms
created_at
```

Pour ajouter une migration :

```text
db/migrations/V2__nom_de_la_migration.sql
```

Convention Flyway :

```text
V<numero>__description.sql
```

Exemple :

```text
V2__add_user_profile_fields.sql
```

Ne modifiez pas une migration deja appliquee sur une base partagee. Ajoutez plutot une nouvelle migration.

### Verifier la base

Afficher les utilisateurs :

```bash
docker compose exec postgres psql -U partitio -d partitio -c "SELECT id, first_name, last_name, email, accepted_terms, created_at FROM users ORDER BY id DESC;"
```

Voir l'etat Flyway :

```bash
docker compose logs flyway
```

## Frontend React

Le front est dans `partitio/`. C'est une application React avec Vite.

### Fichiers principaux

```text
partitio/package.json
```

Scripts disponibles :

```bash
npm run dev      # serveur de dev Vite
npm run build    # build production
npm run lint     # lint ESLint
npm run preview  # preview du build
```

```text
partitio/src/main.jsx
```

Point d'entree React.

```text
partitio/src/App.jsx
```

Declare les routes React.

Route actuelle :

```text
/signup
```

```text
partitio/src/pages/auth/signup.jsx
```

Page d'inscription. Elle valide le formulaire cote front puis appelle :

```text
POST /api/signup
```

```text
partitio/src/pages/auth/signup.scss
```

Styles de la page d'inscription.

```text
partitio/src/pages/auth/login.jsx
partitio/src/pages/auth/login.scss
```

Fichiers reserves a la future page de login. Ils ne sont pas branches actuellement.

```text
partitio/nginx.conf
```

Configuration Nginx utilisee dans Docker. Elle sert les fichiers statiques React et proxy les appels API :

```text
/api/* -> http://backend:3000
```

```text
partitio/Dockerfile
```

Construit le front avec Node, puis sert le dossier `dist` avec Nginx.

## Lancer sans Docker

Le mode recommande reste Docker Compose, car il lance Postgres, Flyway, le backend et le front ensemble.

Pour lancer seulement le front en local :

```bash
cd partitio
npm install
npm run dev
```

Dans ce mode, il faut quand meme un backend disponible pour les appels `/api`.

Pour lancer seulement le backend en local, il faut Java 21, Maven et une base PostgreSQL accessible :

```bash
cd backend
mvn spring-boot:run
```

Les variables suivantes doivent etre disponibles :

```text
PORT
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
```

## Commandes utiles

Rebuild complet :

```bash
docker compose up -d --build
```

Voir les conteneurs :

```bash
docker compose ps
```

Voir les logs backend :

```bash
docker compose logs -f backend
```

Voir les logs frontend :

```bash
docker compose logs -f frontend
```

Voir les logs Postgres :

```bash
docker compose logs -f postgres
```

Tester l'API :

```bash
curl http://localhost:8081/api/health
```

Lint front :

```bash
cd partitio
npm run lint
```

Build front :

```bash
cd partitio
npm run build
```

Build backend via Docker :

```bash
docker compose build backend
```

## Notes pour nouveaux devs

- Le code source backend est dans `backend/src/main`.
- Le dossier `backend/target` est genere par Maven et ne doit pas etre modifie a la main.
- Le code source front est dans `partitio/src`.
- Les migrations SQL sont dans `db/migrations`.
- `.env` est local et ignore par git.
- `.env.example` sert de reference pour recreer `.env`.
- Le frontend appelle l'API via `/api/...`; Nginx redirige ensuite vers le service Docker `backend`.
- Flyway est responsable du schema SQL, pas le backend Java.
