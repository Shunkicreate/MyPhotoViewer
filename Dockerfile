# Node.jsの公式イメージをベースに使用
FROM node:22

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係のインストールに必要なファイルを先にコピー
COPY package*.json ./

# 開発依存関係も含めてインストール
RUN npm install

# アプリケーションコードをすべてコピー
COPY . .

# ポートを公開（例：3000ポートを利用）
EXPOSE 3000

# 開発用のデフォルトコマンド
CMD ["npm", "run", "dev"]
