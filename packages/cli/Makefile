lint:
	go vet ./...

format:
	go fmt ./...

build:
	go vet ./...
	go fmt ./...
	rm -rf ./bin
	go build -o ./bin/maps ./main.go

install:
	go vet ./...
	go fmt ./...
	rm -rf ./bin
	go build -o ./bin/maps ./main.go
	mkdir -p ~/bin
	cp ./bin/maps ~/bin/
	chmod +x ~/bin/maps
	export PATH="$(HOME)/bin:$(PATH)"
