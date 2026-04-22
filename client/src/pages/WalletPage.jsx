import { useApp } from '../context/AppContext';
import SectionHeader from '../components/SectionHeader';

export default function WalletPage() {
  const { wallet } = useApp();
  return (
    <div className="stack">
      <SectionHeader title="Wallet" subtitle="Starter wallet view with summary cards and transaction history." />
      <div className="summary-grid">
        <div className="mini-card"><span>Total Balance</span><strong>₹{wallet.balance}</strong></div>
        <div className="mini-card"><span>Bonus</span><strong>₹{wallet.bonus}</strong></div>
        <div className="mini-card"><span>Winnings</span><strong>₹{wallet.winnings}</strong></div>
      </div>
      <div className="card">
        {wallet.transactions.map((txn) => (
          <div key={txn.id} className="leader-row">
            <div>
              <strong>{txn.type}</strong>
              <p className="small-text muted">{txn.date}</p>
            </div>
            <strong>{txn.amount > 0 ? `+₹${txn.amount}` : `-₹${Math.abs(txn.amount)}`}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
