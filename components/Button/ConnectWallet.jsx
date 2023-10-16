import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const ConnectWallet = ({
  wrong_network_btn = "Wrong Network",
  connect_wallet_btn = "Connect Wallet",
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={openConnectModal}
                      className="bg-blue-200 px-4 py-3 rounded-lg text-blue-500 hover:scale-95 transition duration-300"
                      type="button"
                    >
                      {connect_wallet_btn}
                    </button>
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-200 px-4 py-3 rounded-lg text-red-500 hover:scale-95 transition duration-300"
                    >
                      {wrong_network_btn}
                    </button>
                  </div>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-blue-200 px-4 py-3 rounded-lg text-blue-500 hover:scale-95 transition duration-300"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
