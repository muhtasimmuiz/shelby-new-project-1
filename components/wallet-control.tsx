"use client";

import { useState } from "react";
import { useShelbyApp } from "../app/providers";

function shortAddress(address: string | null) {
  if (!address) {
    return "NO WALLET";
  }

  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletControl() {
  const {
    accountAddress,
    clearError,
    connectWallet,
    connected,
    disconnectWallet,
    walletName,
    wallets,
  } = useShelbyApp();
  const [open, setOpen] = useState(false);

  const availableWallets = wallets.filter((wallet) => wallet.name);

  return (
    <div className="wallet-zone">
      <div className="wallet-copy">
        <span>{shortAddress(accountAddress)}</span>
        <small>{connected ? `${walletName ?? "APTOS"} VERIFIED` : "CONNECT APTOS WALLET"}</small>
      </div>

      <button className="signal-button" type="button" aria-label="Wallet state">
        <span className={connected ? "is-live" : undefined} />
      </button>

      <div className="wallet-control">
        <button
          className="wallet-button"
          type="button"
          onClick={() => {
            clearError();

            if (connected) {
              void disconnectWallet();
              setOpen(false);
              return;
            }

            setOpen((current) => !current);
          }}
        >
          {connected ? "DISCONNECT" : "CONNECT WALLET"}
        </button>

        {open && !connected ? (
          <div className="wallet-menu">
            {availableWallets.length ? (
              availableWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  type="button"
                  className="wallet-menu-item"
                  onClick={() => {
                    setOpen(false);
                    void connectWallet(String(wallet.name));
                  }}
                >
                  {wallet.name}
                </button>
              ))
            ) : (
              <p className="wallet-empty">
                No Aptos wallet detected. Install Petra, Fewcha, or another Aptos wallet and reload.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
