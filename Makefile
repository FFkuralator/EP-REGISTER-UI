ifeq ($(OS),Windows_NT)
	SLEEP := timeout
	RM_MIGR_VERSIONS := powershell -Command "Remove-Item -Recurse -Force core/src/migrations/versions/*"

else
	SLEEP := sleep
	RM_MIGR_VERSIONS := rm -rf ./core/src/migrations/versions/*

endif

merge:
	git checkout main
	git pull
	git merge dev
	git push
	git checkout dev

# dev
start-dev:
	docker compose -f docker-compose-dev.yaml up --build -d

update-ui-dev:
	npm run build:dev
	docker compose -f docker-compose-dev.yaml cp dist/. ep-register-ui:/usr/share/nginx/html

# prod
start-prod:
	docker compose -f docker-compose-prod.yaml up --build -d