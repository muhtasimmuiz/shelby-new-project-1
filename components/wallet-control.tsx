"use client";

import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);

  const availableWallets = wallets.filter((wallet) => wallet.name);
  const connectedLabel = connected ? `${walletName ?? "APTOS"} LIVE` : "CONNECT APTOS WALLET";

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="wallet-zone">
      <div className="wallet-copy">
        <span>{shortAddress(accountAddress)}</span>
        <small>{connectedLabel}</small>
      </div>

      <button className="signal-button" type="button" aria-label="Wallet state">
        <span className={connected ? "is-live" : undefined} />
      </button>

      <div className="wallet-control" ref={menuRef}>
        <button
          className="wallet-button"
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
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
          {!connected ? <span aria-hidden="true">{open ? " -" : " +"}</span> : null}
        </button>

        {open && !connected ? (
          <div className="wallet-menu" role="menu">
            {availableWallets.length ? (
              availableWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  type="button"
                  className="wallet-menu-item"
                  role="menuitem"
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
