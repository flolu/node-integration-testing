dev:
	docker-compose -f docker-compose.yml up --build

test:
	yarn ts-node node_modules/jasmine/bin/jasmine --random=false index.test.ts