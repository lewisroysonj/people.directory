default: env up

env:
	rm -rf ./frontend/.env > /dev/null 2>&1
	rm -rf ./backend/.env > /dev/null 2>&1
	cp ./frontend/src/config/parameters/local.env ./frontend/.env
	cp ./backend/src/config/parameters/local.env ./backend/.env

env-production:
	rm -rf ./frontend/.env > /dev/null 2>&1
	rm -rf ./backend/.env > /dev/null 2>&1
	cp ./frontend/src/config/parameters/production.env ./frontend/.env
	cp ./backend/src/config/parameters/production.env ./backend/.env

up: env down
	docker-compose -f docker-compose.yml up -d

up-prod: env-production down
	docker-compose -f docker-compose.prod.yml up

start-frontend:
	docker-compose -f docker-compose.yml exec frontend sh -c \
    	"yarn start"

start-backend:
	docker-compose -f docker-compose.yml exec backend sh -c \
    	"yarn start:dev"

down: timeout
	docker ps -a -q | xargs -n 1 -P 8 -I {} docker stop {}
	docker builder prune --all --force
	docker system prune -f

timeout:
	export DOCKER_CLIENT_TIMEOUT=2000
	export COMPOSE_HTTP_TIMEOUT=2000

kill:
	docker-compose -f docker-compose.yml exec -T frontend sh -c \
	"killall node > /dev/null 2>&1"

lint-frontend:
	docker-compose -f docker-compose.yml exec frontend sh -c \
 	 "yarn eslint && yarn stylelint && yarn prettier && yarn typescript && ANALYZE=true yarn build"

lint-backend:
	docker-compose -f docker-compose.yml exec backend sh -c \
 	 "yarn eslint && yarn prettier && yarn typescript && ANALYZE=true yarn build"

ssh-frontend: timeout
	docker-compose -f docker-compose.yml exec frontend sh

ssh-backend: timeout
	docker-compose -f docker-compose.yml exec backend sh

build: down timeout
	docker-compose -f docker-compose.yml build
	docker-compose up -d --remove-orphans
	make down

build-prod: down timeout
	docker-compose -f docker-compose.prod.yml build
	docker-compose up -d --remove-orphans
	make down

package-all:
	make package-frontend
	make package-backend
	
package-frontend:
	docker-compose -f docker-compose.yml exec -T frontend sh -c \
	"yarn install"

package-backend:
	docker-compose -f docker-compose.yml exec -T backend sh -c \
	"yarn install"

bundle-frontend:
	docker-compose -f docker-compose.yml exec -T frontend sh -c \
	"yarn build"

bundle-backend:
	docker-compose -f docker-compose.yml exec -T backend sh -c \
	"yarn build"

# db
migration-generate:
	docker-compose -f docker-compose.yml exec backend sh -c \
  "yarn run migration:generate src/migrations/$(name)"

migration-create:
	docker-compose -f docker-compose.yml exec backend sh -c \
  "yarn run migration:create src/migrations/$(name)"

migration-run:
	docker-compose -f docker-compose.yml exec -T backend sh -c \
	"yarn run migration:run"

migration-revert:
	docker-compose -f docker-compose.yml exec backend sh -c \
	"yarn run migration:revert"
