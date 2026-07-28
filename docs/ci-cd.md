# CI/CD Partitio

Cette configuration publie une image applicative unique sur GHCR, puis redeploie uniquement le conteneur correspondant a la branche poussee.

- Push sur `dev` : image `ghcr.io/<owner>/<repo>:dev`, service `partitio-dev`.
- Push sur `main` : image `ghcr.io/<owner>/<repo>:prod`, service `partitio-prod`.

Le `docker-compose.yml` local a la racine du projet reste dedie au developpement local. Les fichiers de production sont dans `deploy/`.

## Fichiers ajoutes

- `Dockerfile` : construit le front React, l'integre dans le jar Spring Boot, puis produit une image runtime Java 21 non-root.
- `.dockerignore` : limite le contexte Docker et evite d'envoyer les secrets locaux.
- `.github/workflows/partitio-cicd.yml` : build Buildx, cache Docker, push GHCR, deploiement SSH.
- `deploy/docker-compose.yml` : deux services applicatifs, `partitio-dev` et `partitio-prod`.
- `deploy/docker-compose.databases.yml` : optionnel, bases PostgreSQL et migrations Flyway separees par environnement.
- `deploy/.env*.example` : exemples de configuration serveur.

## Prerequis VPS

Installer Docker Engine avec le plugin Docker Compose v2, puis creer un utilisateur de deploiement autorise a piloter Docker.

Exemple :

```bash
sudo mkdir -p /opt/partitio
sudo chown "$USER:$USER" /opt/partitio
docker compose version
```

Par defaut, les services publient leurs ports sur `127.0.0.1`, ce qui est adapte a un reverse proxy Nginx/Caddy/Traefik. Pour exposer directement un service, remplacez l'adresse par `0.0.0.0` dans `.env`.

## Configuration serveur

Dans `/opt/partitio`, creer les fichiers reels a partir des exemples :

```bash
cp .env.example .env
cp .env.dev.example .env.dev
cp .env.prod.example .env.prod
```

Dans `.env`, definir l'image GHCR :

```dotenv
PARTITIO_IMAGE=ghcr.io/OWNER/REPOSITORY
PARTITIO_DEV_HTTP_PORT=8081
PARTITIO_PROD_HTTP_PORT=8080
```

Dans `.env.dev` et `.env.prod`, utiliser des secrets differents et des bases differentes :

```dotenv
SPRING_DATASOURCE_URL=jdbc:postgresql://partitio-dev-db:5432/partitio_dev
SPRING_DATASOURCE_USERNAME=partitio_dev
SPRING_DATASOURCE_PASSWORD=...
JWT_SECRET=...
JWT_COOKIE_SECURE=false
```

En production, mettre `JWT_COOKIE_SECURE=true` si l'application est servie en HTTPS.

## Bases PostgreSQL optionnelles sur le VPS

Si les bases sont hebergees ailleurs, il suffit de renseigner les URLs JDBC dans `.env.dev` et `.env.prod`.

Si les bases doivent tourner sur le meme VPS :

```bash
cp .env.dev.db.example .env.dev.db
cp .env.prod.db.example .env.prod.db
docker compose -f docker-compose.yml -f docker-compose.databases.yml --env-file .env up -d partitio-dev-db partitio-prod-db
```

Appliquer les migrations Flyway :

```bash
docker compose -f docker-compose.yml -f docker-compose.databases.yml --env-file .env --profile migrations run --rm partitio-dev-migrate
docker compose -f docker-compose.yml -f docker-compose.databases.yml --env-file .env --profile migrations run --rm partitio-prod-migrate
```

Le workflow met aussi a jour `/opt/partitio/db/migrations` sur le serveur a chaque deploiement.

## Secrets GitHub

Configurer ces secrets dans `Settings > Secrets and variables > Actions`.

| Nom | Description |
| --- | --- |
| `VPS_SSH_HOST` | Hote ou IP du VPS. |
| `VPS_SSH_PORT` | Port SSH, optionnel si `22`. |
| `VPS_SSH_USER` | Utilisateur de deploiement. |
| `VPS_SSH_PRIVATE_KEY` | Cle privee SSH sans passphrase interactive. |
| `VPS_SSH_KNOWN_HOSTS` | Empreinte SSH connue du VPS. |
| `GHCR_USERNAME` | Compte GitHub autorise a lire l'image GHCR depuis le VPS. |
| `GHCR_READ_TOKEN` | PAT GitHub avec `read:packages` pour `docker pull` depuis le VPS. |

Variables GitHub optionnelles :

| Nom | Valeur par defaut | Description |
| --- | --- | --- |
| `VPS_DEPLOY_PATH` | `/opt/partitio` | Dossier de deploiement sur le VPS. |
| `DOCKER_PLATFORMS` | `linux/amd64` | Plateforme cible Buildx, par exemple `linux/amd64,linux/arm64`. |

Generer `VPS_SSH_KNOWN_HOSTS` depuis votre poste :

```bash
ssh-keyscan -H votre-vps.example.com
```

Pour GHCR, le workflow publie avec `GITHUB_TOKEN`. Le VPS tire l'image avec `GHCR_READ_TOKEN`, car le `GITHUB_TOKEN` n'existe pas en dehors de GitHub Actions.

## Premier deploiement

1. Pousser la branche `dev` pour publier `:dev` et demarrer `partitio-dev`.
2. Verifier les logs :

```bash
docker compose --env-file .env logs -f partitio-dev
```

3. Pousser ou merger dans `main` pour publier `:prod` et demarrer `partitio-prod`.

Le workflow utilise :

```bash
docker compose --env-file .env pull partitio-dev
docker compose --env-file .env up -d --no-deps partitio-dev
```

et l'equivalent pour `partitio-prod`. Cela evite de redemarrer l'autre environnement.

## Commandes utiles

```bash
docker compose --env-file .env ps
docker compose --env-file .env logs -f partitio-prod
docker compose --env-file .env restart partitio-dev
docker compose --env-file .env pull partitio-prod
docker compose --env-file .env up -d --no-deps partitio-prod
```

Pour supprimer uniquement l'environnement de developpement :

```bash
docker compose --env-file .env stop partitio-dev
docker compose --env-file .env rm -f partitio-dev
```

Les volumes `partitio-dev-uploads`, `partitio-prod-uploads`, `partitio-dev-postgres` et `partitio-prod-postgres` ne sont pas supprimes par ces commandes.
