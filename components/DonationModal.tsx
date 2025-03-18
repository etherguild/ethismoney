import { useEffect, useState } from "react";
import Icon from "./Icon";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: {
    price: string;
    title: string;
  };
}

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  tier,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("donate@etherguild.xyz");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const isHighValueTier = parseFloat(tier.price) >= 10;

  const getMintUrl = (tierTitle: string): string => {
    const tierUrls: Record<string, string> = {
      "Tier 1": "https://app.manifold.xyz/c/eth-is-money-tier1",
      "Tier 2": "https://app.manifold.xyz/c/eth-is-money-tier2",
    };

    return tierUrls[tierTitle] || "";
  };

  const handleMint = () => {
    const mintUrl = getMintUrl(tier.title);
    if (mintUrl) {
      window.open(mintUrl, "_blank");
    } else {
      console.error("Invalid tier:", tier.title);
    }
    onClose();
  };

  // Use animation classes instead of conditional rendering for smooth transitions
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // First mount the component
      setMounted(true);
      // Then trigger the animation after a small delay
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      // Start exit animation
      setAnimateIn(false);
      // Delay unmounting to allow exit animations to complete
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] flex items-center justify-center transition-opacity duration-300 ease-in-out ${animateIn ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      >
        {/* Modal Dialog */}
        <div
          className={`z-[101] bg-blue5 rounded-[20px] p-8 max-w-[500px] w-full mx-4 shadow-lg transition-all duration-300 ease-in-out ${animateIn
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-95"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue1 hover:opacity-80 transition-opacity"
          >
            <Icon icon="feather:x" className="w-6 h-6" />
          </button>

          {/* Title */}
          <div className="headline-md mb-4 text-blue2">
            {isHighValueTier ? "High-Value Donation" : "Confirm Donation"}
          </div>

          {/* Content */}
          <div className="text-md mb-6">
            {isHighValueTier ? (
              <>
                As a US-based non-profit, there are restrictions to the amount of
                anonymous donations.
                <br />
                <br />
                Please reach out to{" "}
                <span onClick={copyToClipboard} className="cursor-pointer">
                  <span className="text-blue1 hover:opacity-80 transition-opacity underline font-bold">
                    donate@etherguild.xyz
                  </span>{" "}
                  {/* copy icon */}
                  {isCopied ? (
                    <Icon icon="feather:check" className="w-4 h-4 inline-block" />
                  ) : (
                    <Icon
                      icon="feather:clipboard"
                      className="w-4 h-4 inline-block"
                    />
                  )}
                </span>{" "}
                to donate to this tier.
              </>
            ) : (
              <>
                You are about to donate {tier.price} ETH to mint the {tier.title}{" "}
                NFT. This will give you access to the exclusive Discord where you
                can help shape the ETH is Money movement.
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-blue1 text-blue1 hover:bg-blue1/10 transition-colors"
            >
              {isHighValueTier ? "Close" : "Cancel"}
            </button>
            {!isHighValueTier && (
              <button
                onClick={handleMint}
                className="px-6 py-2 rounded-full bg-[#B7DDE8] text-blue2 hover:opacity-90 transition-opacity"
              >
                Proceed to Mint
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationModal;
