import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';

export default function WalletPage() {
  const { wallet, paymentStatus, activeUpiPayment, createUpiPayment, confirmUpiPayment } = useApp();
  const [amount, setAmount] = useState('100');
  const [upiId, setUpiId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createUpiPayment({ amount, upiId });
  };

  return (
    <div className="stack">
      <SectionHeader title="Wallet" subtitle="Starter wallet view with summary cards and transaction history." />
      <div className="summary-grid">
        <div className="mini-card"><span>Total Balance</span><strong>Rs {wallet.balance}</strong></div>
        <div className="mini-card"><span>Bonus</span><strong>Rs {wallet.bonus}</strong></div>
        <div className="mini-card"><span>Winnings</span><strong>Rs {wallet.winnings}</strong></div>
      </div>

      <form className="card payment-form" onSubmit={handleSubmit}>
        <div>
          <p className="label">Add Cash With UPI</p>
          <h3>UPI top-up</h3>
        </div>
        <label>
          Amount
          <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" />
        </label>
        <label>
          Your UPI ID optional
          <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="name@bank" />
        </label>
        <button className="btn primary wide" type="submit">Create UPI Payment</button>
        {paymentStatus && <p className="status-text">{paymentStatus}</p>}
        {activeUpiPayment && (
          <div className="upi-box">
            <p className="small-text muted">Payment ID: {activeUpiPayment.id}</p>
            <a className="btn wide" href={activeUpiPayment.intentUrl}>Open UPI App</a>
            <button className="btn small" type="button" onClick={() => confirmUpiPayment(activeUpiPayment.id)}>
              Mark Paid in Demo
            </button>
          </div>
        )}
      </form>

      <div className="card">
        {wallet.transactions.map((txn) => (
          <div key={txn.id} className="leader-row">
            <div>
              <strong>{txn.type}</strong>
              <p className="small-text muted">{txn.date}</p>
            </div>
            <strong>{txn.amount > 0 ? `+Rs ${txn.amount}` : `-Rs ${Math.abs(txn.amount)}`}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
