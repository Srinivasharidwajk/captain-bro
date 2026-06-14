import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loadState, saveState } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { FaMapMarkerAlt, FaPlus, FaTrash, FaCheck, FaHome, FaBriefcase, FaMap } from 'react-icons/fa';

export const AddressManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [type, setType] = useState('Home'); // Home, Work, Other

  const userKey = currentUser ? `addresses_${currentUser.uid}` : 'addresses_guest';

  useEffect(() => {
    // Load addresses from local state
    setAddresses(loadState(userKey, []));
  }, [currentUser]);

  const saveAddressesToDb = (newAddresses) => {
    setAddresses(newAddresses);
    saveState(userKey, newAddresses);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setName(currentUser?.fullName || '');
    setPhone(currentUser?.phone || '');
    setAddressLine('');
    setLandmark('');
    setType('Home');
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setName(addr.name);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setLandmark(addr.landmark || '');
    setType(addr.type);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updated = addresses.filter(a => a.id !== id);
      saveAddressesToDb(updated);
    }
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveAddressesToDb(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    let updatedList;
    if (editingAddress) {
      updatedList = addresses.map(a => 
        a.id === editingAddress.id 
          ? { ...a, name, phone, addressLine, landmark, type } 
          : a
      );
    } else {
      const isFirst = addresses.length === 0;
      const newAddr = {
        id: 'addr_' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        addressLine,
        landmark,
        type,
        isDefault: isFirst
      };
      updatedList = [...addresses, newAddr];
    }

    saveAddressesToDb(updatedList);
    setIsModalOpen(false);
  };

  const getAddressIcon = (addressType) => {
    switch (addressType) {
      case 'Home': return <FaHome className="text-primary" />;
      case 'Work': return <FaBriefcase className="text-indigo-600" />;
      default: return <FaMap className="text-teal-600" />;
    }
  };

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-lg font-bold text-neutral-dark">My Addresses</h2>
          <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Manage delivery address locations</p>
        </div>
        <Button onClick={openAddModal} size="sm" className="flex gap-1.5 py-1.5 px-3 text-xs">
          <FaPlus /> Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-float">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-neutral-dark/40 text-xl border border-neutral-border mb-4">
            <FaMapMarkerAlt />
          </div>
          <h3 className="text-sm font-bold text-neutral-dark">No Saved Addresses</h3>
          <p className="text-xs text-neutral-dark/60 font-semibold mt-1 max-w-[200px]">
            Configure saved locations for quicker checkout checks.
          </p>
          <Button onClick={openAddModal} className="mt-4" size="sm">
            Add Address
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`
                bg-white p-4 rounded-lg border flex flex-col gap-3 shadow-xs relative text-left transition-all
                ${addr.isDefault ? 'border-primary bg-primary-light/10' : 'border-neutral-border'}
              `}
            >
              {/* Header Info */}
              <div className="flex justify-between items-center pb-2 border-b border-neutral-border/50">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-neutral-light border border-neutral-border/40`}>
                    {getAddressIcon(addr.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-dark leading-none">{addr.type} Location</span>
                    <span className="text-[9px] text-neutral-dark/50 font-semibold mt-0.5">{addr.name} • {addr.phone}</span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="text-[10px] font-bold text-neutral-dark opacity-60 hover:opacity-100 hover:underline"
                  >
                    Edit
                  </button>
                  <span className="text-neutral-border text-xs">|</span>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="text-xs font-semibold text-neutral-dark leading-relaxed">
                <p>{addr.addressLine}</p>
                {addr.landmark && <p className="text-[10px] text-neutral-dark/50 mt-0.5">Landmark: {addr.landmark}</p>}
              </div>

              {/* Default Badge Actions */}
              <div className="flex justify-between items-center pt-1 mt-0.5">
                {addr.isDefault ? (
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-bold flex items-center gap-1">
                    <FaCheck /> Default Delivery Location
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[9px] font-bold text-primary hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal popup form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? 'Modify Address' : 'Create Location'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Recipient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={true}
            />

            <Input
              label="Contact Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={true}
            />
          </div>

          <Input
            label="Street Address / Details"
            placeholder="Flat no, building, colony road details..."
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            required={true}
          />

          <Input
            label="Landmark"
            placeholder="e.g. Near Hanamkonda Post Office"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />

          <div className="flex flex-col gap-1 text-left">
            <label className="text-sm font-semibold text-neutral-dark opacity-85">
              Address Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Work', 'Other'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`
                    py-2 rounded-md border font-bold text-xs transition-all text-center
                    ${type === t 
                      ? 'border-primary bg-primary-light text-primary' 
                      : 'border-neutral-border bg-neutral-light text-neutral-dark'}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">
            Save Address
          </Button>
        </form>
      </Modal>
    </div>
  );
};
export default AddressManagement;
