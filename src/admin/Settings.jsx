import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const Settings = () => {
  const [minOrder, setMinOrder] = useState('150');
  const [deliveryFee, setDeliveryFee] = useState('30');
  const [storeStatus, setStoreStatus] = useState('open');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div>
        <h2 className="text-lg font-bold text-neutral-dark">Store Settings</h2>
        <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Configure system thresholds</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-5 rounded-3xl border border-neutral-border flex flex-col gap-4 shadow-sm">
        <Input
          label="Minimum Order Value (INR)"
          type="number"
          value={minOrder}
          onChange={(e) => setMinOrder(e.target.value)}
        />

        <Input
          label="Standard Delivery Fee (INR)"
          type="number"
          value={deliveryFee}
          onChange={(e) => setDeliveryFee(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-neutral-dark opacity-85">
            Store Status
          </label>
          <select
            value={storeStatus}
            onChange={(e) => setStoreStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-border bg-neutral-light transition-all outline-none focus:border-primary focus:bg-white text-sm font-semibold"
          >
            <option value="open">🟢 Accepting Orders (Open)</option>
            <option value="closed">🔴 Temporarily Offline (Closed)</option>
          </select>
        </div>

        <Button type="submit" className="w-full mt-2">
          Save Configurations
        </Button>
      </form>
    </div>
  );
};
export default Settings;
