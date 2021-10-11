dev:
	docker-compose -f docker-compose.yml up --build

test:
	yarn jasmine-ts --random=false index.test.ts