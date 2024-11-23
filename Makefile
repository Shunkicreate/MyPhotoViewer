# Docker Compose files
MY_PHOTO_VIEWER_COMPOSE_FILES = -f docker-compose.yml -f docker-compose.prod.yml
PHOTO_VIEWER_COMPOSE_FILES = -f ../PhotoViewer/docker-compose.yml -f ../PhotoViewer/docker-compose.prod.yml

# MyPhotoViewerの本番セットアップ
build-my-photo-viewer:
	docker compose $(MY_PHOTO_VIEWER_COMPOSE_FILES) up -d --build

# ../PhotoViewerの本番セットアップ
build-photo-viewer:
	docker compose $(PHOTO_VIEWER_COMPOSE_FILES) up -d --build

# 全てのコンテナを起動
build-all: build-my-photo-viewer build-photo-viewer

# MyPhotoViewerのコンテナをcompose up
up-my-photo-viewer:
	docker compose $(MY_PHOTO_VIEWER_COMPOSE_FILES) up -d

# PhotoViewerのコンテナをcompose up
up-photo-viewer:
	docker compose $(PHOTO_VIEWER_COMPOSE_FILES) up -d

# cloud flareの設定を行う
setup-cloud-flare:
	@export $(cat .env | xargs) && docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token $$CLOUDFLARE_TOKEN

# 全てのコンテナをcompose up
up-all: up-my-photo-viewer up-photo-viewer

# MyPhotoViewerのコンテナを停止
down-my-photo-viewer:
	docker compose $(MY_PHOTO_VIEWER_COMPOSE_FILES) down

# PhotoViewerのコンテナを停止
down-photo-viewer:
	docker compose $(PHOTO_VIEWER_COMPOSE_FILES) down

# 全てのコンテナを停止
down-all: down-my-photo-viewer down-photo-viewer
