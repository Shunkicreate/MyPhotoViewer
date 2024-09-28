import { useState, useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { ActionFunction } from "@remix-run/node";

interface UseBatchImageLoaderProps {
  files: string[];
  totalFiles: number;
  year: string;
  month: string;
  batchSize?: number;
}

interface UseBatchImageLoaderReturn {
  loadedFiles: string[];
  loadedImages: (string | null)[];
  hasMore: boolean;
}

export function useBatchImageLoader({
  files,
  totalFiles,
  year,
  month,
  batchSize = 10,
}: UseBatchImageLoaderProps): UseBatchImageLoaderReturn {
  const [loadedFiles, setLoadedFiles] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<(string | null)[]>([]);
  const fetcher = useFetcher<ActionFunction>();
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const isRetrying = useRef(false);

  // 画像をロードする関数
  const loadImages = () => {
    if (loadedFiles.length >= totalFiles) {
      setHasMore(false);
      return;
    }
    // 次のバッチをリクエスト
    const startIndex = currentBatch * batchSize;
    const nextFiles = files.slice(startIndex, startIndex + batchSize);
    const formData = new FormData();
    formData.append('year', year);
    formData.append('month', month);
    nextFiles.forEach((file) => formData.append('file', file));
    fetcher.submit(formData, { method: 'post', action: `/${year}/${month}` });
  };


  // currentBatchが変化したときにloadImagesを呼び出す
  useEffect(() => {
    if (currentBatch > 0) {
      loadImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBatch]);

  // fetcherの状態を監視してエラーハンドリングを行う
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (!fetcher.data.error) {
        // 成功時
        setLoadedFiles((prevLoadedFiles) => {
          const updatedFiles = [...prevLoadedFiles, ...fetcher.data.files];
          return updatedFiles;
        });

        setLoadedImages((prev) => [...prev, ...fetcher.data.images]);

        setRetryCount(0); // リトライ回数をリセット
        isRetrying.current = false;

        setCurrentBatch((prevBatch) => {
          const newBatch = prevBatch + 1;
          const loadedCount = (newBatch * batchSize);
          if (loadedCount >= totalFiles) {
            setHasMore(false);
          }
          return newBatch;
        });
      } else {
        // サーバーからのエラーがある場合
        handleRetryOrSkip();
      }
    } else if (fetcher.state === 'idle' && !fetcher.data && !isRetrying.current) {
      // fetcher.dataが存在しない場合（エラー）かつ、再試行中でない場合
      handleRetryOrSkip();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const handleRetryOrSkip = () => {
    if (retryCount < 3) {
      // 1秒待って再試行
      isRetrying.current = true;
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        loadImages();
      }, 1000);
    } else {
      // リトライ回数が最大に達した場合、エラーとして扱い次のバッチへ
      const startIndex = currentBatch * batchSize;
      const nextFiles = files.slice(startIndex, startIndex + batchSize);
      setLoadedFiles((prevLoadedFiles) => {
        const updatedFiles = [...prevLoadedFiles, ...nextFiles];
        return updatedFiles;
      });

      setLoadedImages((prev) => [...prev, ...Array(nextFiles.length).fill(null)]);

      setRetryCount(0);
      isRetrying.current = false;

      setCurrentBatch((prevBatch) => {
        const newBatch = prevBatch + 1;
        const loadedCount = (newBatch * batchSize);
        if (loadedCount >= totalFiles) {
          setHasMore(false);
        }
        return newBatch;
      });
    }
  };

  return {
    loadedFiles,
    loadedImages,
    hasMore,
  };
}
