workspaceFolder :=

# https://gist.github.com/sighingnow/deee806603ec9274fd47
ifneq ($(OS),Windows_NT)
	workspaceFolder = ./
endif

backend:
	@echo WIP

cli:
	@echo WIP

frontend:
	@echo WIP

all: backend cli frontend
