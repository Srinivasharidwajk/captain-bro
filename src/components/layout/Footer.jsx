import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-neutral-light border-t border-neutral-border p-4 text-center text-xs text-neutral-dark/60 mt-auto mb-16">
      <p className="font-semibold">Mana Warangal Foods</p>
      <p className="mt-1">100% Fresh Meats & Vegetables Delivery</p>
      <p className="mt-0.5">© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
};
export default Footer;
