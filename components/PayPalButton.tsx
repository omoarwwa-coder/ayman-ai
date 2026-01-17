
import React, { useState } from 'react';

interface PayPalButtonProps {
  amount: string;
  onSuccess: () => void;
  disabled?: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, disabled }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate PayPal window delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      alert('Payment successful! Your account has been upgraded to PREMIUM.');
    }, 2000);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
        isProcessing ? 'bg-slate-200 text-slate-400' : 'bg-[#ffc439] hover:bg-[#f2ba36] text-[#2c2e2f]'
      }`}
    >
      {isProcessing ? (
        <><i className="fas fa-circle-notch fa-spin"></i> Processing...</>
      ) : (
        <>
          <i className="fab fa-paypal text-xl"></i>
          <span>Pay with PayPal</span>
        </>
      )}
    </button>
  );
};

export default PayPalButton;
