# MyPhotoViewerの本番セットアップ
build-my-photo-viewer:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# ../PhotoViewerの本番セットアップ
build-photo-viewer:
	docker-compose -f ../PhotoViewer/docker-compose.yml -f ../PhotoViewer/docker-compose.prod.yml up -d --build

# 全てのコンテナを起動
build-all:
	make build-my-photo-viewer
	make build-photo-viewer

# 全てのコンテナを停止
down-all:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
	docker-compose -f ../PhotoViewer/docker-compose.yml -f ../PhotoViewer/docker-compose.prod.yml down
