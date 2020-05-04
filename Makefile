.PHONY: test contrib help
.DEFAULT_GOAL := help-short

MAKEFLAGS += --no-print-directory

DEBUG_PREFIX=" [DEBUG] "
DEBUG_ECHO=$(if $(MAKE_DEBUG),@echo ${DEBUG_PREFIX})

COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_NOTE = \033[33m

define OK
    @echo "$(COLOR_INFO)$(if $(filter 1,$(MAKE_DEBUG)),${DEBUG_PREFIX}) [OK] $1$(COLOR_RESET)"
endef
define FAIL
    @>&2 echo "$(if $(MAKE_DEBUG),${DEBUG_PREFIX}) [FAIL] $1$(COLOR_RESET)"
endef
define NOTE
    @echo "$(COLOR_NOTE)$(if $(MAKE_DEBUG),${DEBUG_PREFIX}) [NOTE] $1$(COLOR_RESET)"
endef

notify = $(DEBUG_ECHO) notify-send --urgency=low --expire-time=50 "Success!" "make $@"

help-short:
	@grep -E '^[a-zA-Z_-]+:[ a-zA-Z_-]+?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

contrib:
	$(DEBUG_ECHO) @cp -n -r contrib/.env contrib/* ./ || true

docker-hosts-updater:
	$(DEBUG_ECHO) docker pull grachev/docker-hosts-updater
	$(DEBUG_ECHO) docker rm -f docker-hosts-updater || true
	$(DEBUG_ECHO) docker run -d --restart=always --name docker-hosts-updater -v /var/run/docker.sock:/var/run/docker.sock -v /etc/hosts:/opt/hosts grachev/docker-hosts-updater

###> ALIASES ###
pull:
	$(DEBUG_ECHO) docker-compose pull
do-up: contrib pull npm composer permissions
	$(DEBUG_ECHO) docker-compose up --detach --remove-orphans --no-build
up: do-up migration ## Up project
	@$(notify)
latest: do-up backup-latest ## Up project with latest backup from server
	@$(notify)
cli: app-cli ## Get terminal inside php container

down: ## Stop and remove all containers, volumes and networks
	$(DEBUG_ECHO) docker-compose down -v --remove-orphans
###< ALIASES ###

###> NODE ###
NODE = $(DEBUG_ECHO) @docker-compose $(if $(EXEC),exec,run --rm )\
	$(if $(ENTRYPOINT),--entrypoint "$(ENTRYPOINT)" )\
	node

npm:
	$(NODE) npm install
###< NODE ###

###> APP ###
APP = $(DEBUG_ECHO) @docker-compose $(if $(EXEC),exec,run --rm )\
	$(if $(ENTRYPOINT),--entrypoint "$(ENTRYPOINT)" )\
	$(if $(APP_ENV),-e APP_ENV=$(APP_ENV) )\
	$(if $(APP_DEBUG),-e APP_DEBUG=$(APP_DEBUG) )\
	php-fpm

PERMISSIONS = chown $(shell id -u):$(shell id -g) -R . && chmod 777 -R var/
permissions: ## Fix file permissions in project
	$(APP) sh -c "$(PERMISSIONS) || true"
	$(call OK,"Permissions fixed.")

app-cli:
	$(APP) bash

composer: ### composer install
	$(APP) sh -c 'rm -rf var/cache/* && composer install'

migration: ## Run migrations
	$(APP) console doctrine:migration:migrate --allow-no-migration --no-interaction

migration-generate:  ## Generate empty migration
	$(APP) console doctrine:migrations:generate
	$(MAKE) php-cs-fixer

migration-rollback:latest = $(shell make app-cli CMD="console doctrine:migration:latest" | tr '\r' ' ')
migration-rollback:
	$(APP) console doctrine:migration:execute --down $(latest) --no-interaction

migration-diff:  ## Generate diff migrations
	$(APP) console doctrine:migration:diff --formatted --no-interaction
	@$(MAKE) php-cs-fixer
migration-diff-dry:
	$(APP) console doctrine:schema:update --dump-sql

migration-validate: ### Validate database schema
	$(APP) console doctrine:schema:validate

schema-update:
	$(APP) console doctrine:schema:update --force

test: APP_ENV=test
test: APP_DEBUG=1
test: php-cs-fixer cache phpstan psalm doctrine-ensure-production-settings database migration-validate fixtures paratest ## Run all checks and tests

php-cs-fixer: ### Fix coding style
	$(APP) sh -c 'php-cs-fixer fix $(if $(DRY),--dry-run) $(if $(DEBUG),-vvv); $(PERMISSIONS)'

phpstan: APP_ENV=test
phpstan: APP_DEBUG=1
phpstan: cache ### Run phpstan
	$(APP) phpstan analyse --configuration phpstan.neon $(if $(DEBUG),--debug -vvv)
phpstan-baseline: APP_ENV=test
phpstan-baseline: APP_DEBUG=1
phpstan-baseline: cache ### Update phpstan baseline
	$(APP) phpstan analyse --configuration phpstan.neon --generate-baseline

phpunit: APP_ENV=test
phpunit: APP_DEBUG=1
phpunit: ### Run phpunit
	$(APP) phpunit --stop-on-failure
paratest: APP_ENV=test
paratest: APP_DEBUG=1
paratest: ### Run paratest
	$(APP) paratest -p $(shell grep -c ^processor /proc/cpuinfo || 4) --stop-on-failure

requirements: APP_ENV=prod
requirements: ### Check symfony requirements
	$(APP) requirements-checker APP_ENV=prod APP_DEBUG=0

psalm: ### Run psalm
	$(APP) psalm --show-info=false
psalm-baseline: ### Update psalm baseline
	$(APP) psalm --update-baseline --set-baseline=psalm-baseline.xml

doctrine-ensure-production-settings: APP_ENV=prod
doctrine-ensure-production-settings: APP_DEBUG=0
doctrine-ensure-production-settings:
	$(APP) sh -c 'rm -rf var/cache/$$APP_ENV && console doctrine:ensure-production-settings'

cache-prod:
	@$(MAKE) APP_ENV=prod APP_DEBUG=0 cache
cache: ## Clear then warmup symfony cache
	$(APP) sh -c 'rm -rf var/cache/$$APP_ENV && console cache:warmup; $(PERMISSIONS)'

database: drop migration ### Drop database then restore from migrations

fixtures: APP_ENV=test
fixtures: ### Load fixtures
	$(APP) console doctrine:fixtures:load --no-interaction

drop: drop-connection do-drop ### Drop database
drop-connection:
	$(APP) console doctrine:query:sql "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'db$(if $(filter test,$(APP_ENV)),_test)' AND pid <> pg_backend_pid();" || true
do-drop:
	$(APP) sh -c "console doctrine:database:drop --if-exists --force && console doctrine:database:create"
###< APP ###
