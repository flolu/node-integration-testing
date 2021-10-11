dev:
	docker-compose -f docker-compose.yaml up --build

test:
	yarn jasmine-ts --random=false index.test.ts