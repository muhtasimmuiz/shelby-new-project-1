"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import {
  ShelbyClientProvider,
  useAccountBlobs,
  useBlobMetadata,
  useShelbyClient,
  useUploadBlobs,
} from "@shelby-protocol/react";
import type { BlobMetadata, ShelbyClient } from "@shelby-protocol/sdk/browser";
import { ShelbyClient as ShelbyBrowserClient } from "@shelby-protocol/sdk/browser";
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  addressToString,
  formatBytes,
  getShelbyRuntimeConfig,
  type ShelbyRuntimeConfig,
} from "../lib/shelby-runtime";

export type ShelbyBlobRecord = {
  name: string;
  size: number;
  owner: string;
  creationMicros?: number;
  expirationMicros?: number;
  isWritten: boolean;
  isDeleted: boolean;
  encoding?: {
    variant?: string;
    chunkSizeBytes?: number;
    erasure_k?: number;
    erasure_n?: number;
    erasure_d?: number;
  };
};

export type ShelbyActivityRecord = {
  id: string;
  level: "info" | "success" | "error";
  message: string;
  timestamp: string;
};

type ShelbyAppContextValue = {
  config: ShelbyRuntimeConfig;
  accountAddress: string | null;
  walletName: string | null;
  wallets: ReadonlyArray<{ name?: string }>;
  connected: boolean;
  blobs: ShelbyBlobRecord[];
  activeBlob: ShelbyBlobRecord | null;
  activity: ShelbyActivityRecord[];
  queue: File[];
  loadingBlobs: boolean;
  uploading: boolean;
  busyBlobName: string | null;
  error: string | null;
  setQueue: (files: File[]) => void;
  clearQueue: () => void;
  clearError: () => void;
  selectBlob: (blobName: string) => Promise<void>;
  refreshBlobs: () => Promise<void>;
  uploadQueue: () => Promise<void>;
  downloadBlob: (blobName?: string) => Promise<void>;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  totalBytes: number;
  totalFiles: number;
  estimatedShelbyUsd: number;
};

const ShelbyAppContext = createContext<ShelbyAppContextValue | null>(null);

function normalizeBlobRecord(blob: BlobMetadata): ShelbyBlobRecord {
  return {
    name: blob.name,
    size: blob.size,
    owner: addressToString(blob.owner),
    creationMicros: blob.creationMicros,
    expirationMicros: blob.expirationMicros,
    isWritten: blob.isWritten,
    isDeleted: Boolean(blob.isDeleted),
    encoding: blob.encoding,
  };
}

function createActivityRecord(
  message: string,
  level: ShelbyActivityRecord["level"] = "info",
): ShelbyActivityRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    message,
    timestamp: new Date().toLocaleTimeString(),
  };
}

async function readableStreamToBlob(readable: ReadableStream) {
  return await new Response(readable).blob();
}

function normalizeShelbyError(error: unknown) {
  const fallback = "Shelby request failed. Check your API key, wallet, and network setup.";

  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message;

  if (message.includes("Unauthorized: Anonymous requests are not allowed")) {
    return "Shelby API key was not sent or was rejected. Restart the app after saving .env.local, then verify the client key is active.";
  }

  if (message.includes("401")) {
    return "Shelby rejected the request with 401 Unauthorized. Verify your Shelby client key and restart the app.";
  }

  return message;
}

function ShelbyStateProvider({ children }: PropsWithChildren) {
  const wallet = useWallet();
  const shelbyClient = useShelbyClient();
  const config = getShelbyRuntimeConfig();
  const hasShelbyKey = Boolean(config.shelbyApiKey);
  const [activity, setActivity] = useState<ShelbyActivityRecord[]>([]);
  const [queue, setQueueState] = useState<File[]>([]);
  const [selectedBlobName, setSelectedBlobName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [downloadingBlobName, setDownloadingBlobName] = useState<string | null>(null);

  const accountAddress = wallet.account?.address
    ? addressToString(wallet.account.address)
    : null;

  const blobsQuery = useAccountBlobs({
    account: accountAddress ?? "",
    enabled: Boolean(accountAddress && hasShelbyKey),
    pagination: { limit: 100, offset: 0 },
  });

  const metadataQuery = useBlobMetadata({
    account: accountAddress ?? "",
    name: selectedBlobName ?? "",
    enabled: Boolean(accountAddress && selectedBlobName && hasShelbyKey),
  });

  const uploadBlobs = useUploadBlobs({
    onSuccess: () => {
      setActivity((current) => [
        createActivityRecord("Shelby upload completed successfully.", "success"),
        ...current,
      ].slice(0, 12));
    },
    onError: (error) => {
      setActivity((current) => [
        createActivityRecord(error.message, "error"),
        ...current,
      ].slice(0, 12));
    },
  });

  const normalizedBlobs = (blobsQuery.data ?? []).map(normalizeBlobRecord);
  const activeBlobFromList =
    normalizedBlobs.find((blob) => blob.name === selectedBlobName) ?? normalizedBlobs[0] ?? null;
  const activeBlob = metadataQuery.data
    ? normalizeBlobRecord(metadataQuery.data)
    : activeBlobFromList;

  useEffect(() => {
    if (!normalizedBlobs.length) {
      setSelectedBlobName(null);
      return;
    }

    if (!selectedBlobName) {
      startTransition(() => {
        setSelectedBlobName(normalizedBlobs[0].name);
      });
      return;
    }

    const stillExists = normalizedBlobs.some((blob) => blob.name === selectedBlobName);

    if (!stillExists) {
      startTransition(() => {
        setSelectedBlobName(normalizedBlobs[0].name);
      });
    }
  }, [normalizedBlobs, selectedBlobName]);

  function log(message: string, level: ShelbyActivityRecord["level"] = "info") {
    setActivity((current) => [createActivityRecord(message, level), ...current].slice(0, 12));
  }

  async function refreshBlobs() {
    if (!hasShelbyKey) {
      setLocalError("Shelby API key missing. Restart the app after saving .env.local.");
      return;
    }

    setLocalError(null);
    await blobsQuery.refetch();

    if (selectedBlobName) {
      await metadataQuery.refetch();
    }
  }

  async function selectBlob(blobName: string) {
    if (!hasShelbyKey) {
      setLocalError("Shelby API key missing. Restart the app after saving .env.local.");
      return;
    }

    setLocalError(null);
    setSelectedBlobName(blobName);
  }

  async function uploadQueue() {
    if (!queue.length) {
      setLocalError("Choose at least one file before uploading.");
      return;
    }

    if (!wallet.connected || !accountAddress || !wallet.signAndSubmitTransaction) {
      setLocalError("Connect an Aptos wallet first so Shelby can upload with the official signer flow.");
      return;
    }

    if (!hasShelbyKey) {
      setLocalError("Shelby API key missing. Restart the app after saving .env.local.");
      return;
    }

    setLocalError(null);
    log(`Preparing ${queue.length} file(s) for Shelby upload...`);

    try {
      const blobs = await Promise.all(
        queue.map(async (file) => ({
          blobName: file.name,
          blobData: new Uint8Array(await file.arrayBuffer()),
        })),
      );

      await uploadBlobs.mutateAsync({
        signer: {
          account: accountAddress,
          signAndSubmitTransaction: wallet.signAndSubmitTransaction,
        },
        blobs,
        expirationMicros: Date.now() * 1000 + 30 * 24 * 60 * 60 * 1000 * 1000,
      });

      setQueueState([]);
      await refreshBlobs();
    } catch (caughtError) {
      const message = normalizeShelbyError(caughtError);
      setLocalError(message);
      log(message, "error");
    }
  }

  async function downloadBlob(blobName?: string) {
    if (!accountAddress) {
      setLocalError("Connect a wallet to download Shelby blobs.");
      return;
    }

    const target = blobName ?? activeBlob?.name;

    if (!target) {
      setLocalError("Pick a blob before downloading.");
      return;
    }

    setDownloadingBlobName(target);
    setLocalError(null);

    try {
      const shelbyBlob = await shelbyClient.rpc.getBlob({
        account: accountAddress,
        blobName: target,
      });
      const blob = await readableStreamToBlob(shelbyBlob.readable);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = target.split("/").pop() ?? target;
      link.click();
      URL.revokeObjectURL(objectUrl);
      log(`Downloaded ${target}.`, "success");
    } catch (caughtError) {
      const message = normalizeShelbyError(caughtError);
      setLocalError(message);
      log(message, "error");
    } finally {
      setDownloadingBlobName(null);
    }
  }

  async function connectWallet(walletName: string) {
    try {
      setLocalError(null);
      await Promise.resolve(wallet.connect(walletName));
      log(`Wallet connected: ${walletName}`, "success");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Wallet connection failed.";
      setLocalError(message);
      log(message, "error");
    }
  }

  async function disconnectWallet() {
    try {
      await Promise.resolve(wallet.disconnect());
      startTransition(() => {
        setQueueState([]);
        setSelectedBlobName(null);
      });
      log("Wallet disconnected.");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Wallet disconnect failed.";
      setLocalError(message);
      log(message, "error");
    }
  }

  const error =
    localError ??
    (uploadBlobs.error ? normalizeShelbyError(uploadBlobs.error) : null) ??
    (blobsQuery.error ? normalizeShelbyError(blobsQuery.error) : null) ??
    (metadataQuery.error ? normalizeShelbyError(metadataQuery.error) : null) ??
    null;

  const value: ShelbyAppContextValue = {
    config,
    accountAddress,
    walletName: wallet.wallet?.name ?? null,
    wallets: wallet.wallets,
    connected: wallet.connected,
    blobs: normalizedBlobs,
    activeBlob,
    activity,
    queue,
    loadingBlobs: blobsQuery.isLoading || blobsQuery.isFetching,
    uploading: uploadBlobs.isPending,
    busyBlobName: downloadingBlobName ?? (metadataQuery.isFetching ? selectedBlobName : null),
    error,
    setQueue: (files) => setQueueState(files),
    clearQueue: () => setQueueState([]),
    clearError: () => setLocalError(null),
    selectBlob,
    refreshBlobs,
    uploadQueue,
    downloadBlob,
    connectWallet,
    disconnectWallet,
    totalBytes: normalizedBlobs.reduce((sum, blob) => sum + blob.size, 0),
    totalFiles: normalizedBlobs.length,
    estimatedShelbyUsd: normalizedBlobs.length,
  };

  return <ShelbyAppContext.Provider value={value}>{children}</ShelbyAppContext.Provider>;
}

export function Providers({ children }: PropsWithChildren) {
  const config = getShelbyRuntimeConfig();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [shelbyClient] = useState<ShelbyClient>(
    () =>
      new ShelbyBrowserClient({
        network: config.network,
        apiKey: config.shelbyApiKey,
        rpc: {
          baseUrl: config.rpcBaseUrl,
          apiKey: config.shelbyApiKey,
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect
        dappConfig={{
          network: config.network as Network,
          aptosApiKeys: config.aptosApiKey
            ? {
                [config.network]: config.aptosApiKey,
              }
            : undefined,
        }}
        onError={(error) => {
          console.error("Wallet provider error", error);
        }}
      >
        <ShelbyClientProvider client={shelbyClient}>
          <ShelbyStateProvider>{children}</ShelbyStateProvider>
        </ShelbyClientProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}

export function useShelbyApp() {
  const context = useContext(ShelbyAppContext);

  if (!context) {
    throw new Error("useShelbyApp must be used within Providers.");
  }

  return context;
}

export function useShelbySummary() {
  const context = useShelbyApp();

  return {
    ...context,
    formattedBytes: formatBytes(context.totalBytes),
    usedPercent: Math.min(99, Math.round((context.totalBytes / 10 ** 12) * 100)),
  };
}
