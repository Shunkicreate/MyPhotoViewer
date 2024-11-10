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

# 本番用ビルドを実行
RUN npm run build

# ポートを公開（例：5173ポートを利用）
EXPOSE 5173

# 開発用のデフォルトコマンド
CMD ["npm", "run", "start"]
