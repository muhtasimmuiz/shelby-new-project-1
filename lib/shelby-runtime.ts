import { Network } from "@aptos-labs/ts-sdk";

export type ShelbyCompatibleNetwork =
  | Network.LOCAL
  | Network.TESTNET
  | Network.SHELBYNET;

export type ShelbyRuntimeConfig = {
  network: ShelbyCompatibleNetwork;
  networkLabel: string;
  rpcBaseUrl: string;
  shelbyApiKey?: string;
  aptosApiKey?: string;
  docsUrl: string;
};

const networkMap: Record<string, ShelbyCompatibleNetwork> = {
  LOCAL: Network.LOCAL,
  TESTNET: Network.TESTNET,
  SHELBYNET: Network.SHELBYNET,
};

function resolveNetworkLabel() {
  const raw = process.env.NEXT_PUBLIC_SHELBY_NETWORK?.trim().toUpperCase();

  if (raw && raw in networkMap) {
    return raw;
  }

  return "SHELBYNET";
}

export function getShelbyRuntimeConfig(): ShelbyRuntimeConfig {
  const networkLabel = resolveNetworkLabel();

  return {
    network: networkMap[networkLabel],
    networkLabel,
    rpcBaseUrl:
      process.env.NEXT_PUBLIC_SHELBY_RPC_BASE_URL?.trim() ??
      "https://api.shelbynet.shelby.xyz/shelby",
    shelbyApiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY?.trim() || undefined,
    aptosApiKey: process.env.NEXT_PUBLIC_APTOS_API_KEY?.trim() || undefined,
    docsUrl: "https://docs.shelby.xyz",
  };
}

export function addressToString(address: unknown) {
  if (typeof address === "string") {
    return address;
  }

  if (address && typeof address === "object" && "toString" in address) {
    return String(address.toString());
  }

  return "";
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatMicros(micros?: number) {
  if (!micros) {
    return "Unknown";
  }

  return new Date(Math.floor(micros / 1000)).toLocaleString();
}

export function encodeBlobPath(blobName: string) {
  return blobName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function formatBlobDisplayName(blobName: string) {
  const normalized = blobName.trim();

  if (!normalized) {
    return "Unnamed blob";
  }

  const tail = normalized.split("/").pop();

  return tail && tail.trim() ? tail : normalized;
}
