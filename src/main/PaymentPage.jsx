import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faAngleUp, faAngleDown, faFire } from "@fortawesome/free-solid-svg-icons";

export default function PaymentPage() {
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [promotionExpanded, setPromotionExpanded] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  const basePoints = 200000;
  const basePrice = 70.49;

  const togglePromotion = (id) => {
    setSelectedPromotions(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const promotions = [
    { id: 1, label: '+60,000 PT', price: 14.99, points: 60000 },
    { id: 2, label: 'Buy 1 more, get 1 free!', price: 0, points: 0 }
  ];

  const calculateTotal = () => {
    let totalPoints = basePoints;
    let totalPrice = basePrice;
    selectedPromotions.forEach(id => {
      const promo = promotions.find(p => p.id === id);
      if (promo) {
        totalPoints += promo.points;
        totalPrice += promo.price;
      }
    });
    return { totalPoints, totalPrice };
  };

  const { totalPoints, totalPrice } = calculateTotal();

  return (
    <main className="w-full min-h-[80vh] py-8 px-4 sm:px-8">
      <div className="max-w-[520px] mx-auto">
        <div className="mb-6">
          <Link
            to="/Pricing"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Pricing
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Payment</h1>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Order List */}
          <div>
            <h3 className="font-semibold mb-2 text-sm text-gray-700">Order List</h3>
            <div className="border-2 border-transparent bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg p-[2px]">
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-gray-700 font-bold text-sm">P</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-purple-400 font-bold text-base">{basePoints.toLocaleString()} PT</p>
                    <p className="text-xs text-gray-500">Free NoAds 1 month</p>
                  </div>
                </div>
                <p className="text-cyan-400 font-bold text-base shrink-0 ml-2">{basePrice.toFixed(2)} USD</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold mb-2 text-sm text-gray-700">Select Payment Method</h3>
            <div className="border-2 border-blue-400 rounded-lg p-3 relative">
              <div className="absolute -top-1.5 -right-1.5 bg-blue-400 rounded-full w-5 h-5 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <FontAwesomeIcon icon={faCreditCard} className="text-gray-600" />
                <p className="font-semibold text-sm text-gray-700">Credit/Debit Card</p>
                <p className="text-xs text-gray-400">processing fee</p>
              </div>
            </div>
          </div>

          {/* Code Section */}
          <div>
            <button
              onClick={() => setCodeExpanded(!codeExpanded)}
              className="w-full flex items-center justify-between font-semibold mb-1 text-sm text-gray-700"
            >
              <span>Code</span>
              {codeExpanded ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
            </button>
            {codeExpanded && (
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter the code from various activities to get more points (Optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
              />
            )}
          </div>

          {/* Hottest Promotion */}
          <div>
            <button
              onClick={() => setPromotionExpanded(!promotionExpanded)}
              className="w-full flex items-center justify-between font-semibold mb-1 text-sm text-gray-700"
            >
              <span className="flex items-center gap-1.5">
                Hottest Promotion (Total) <FontAwesomeIcon icon={faFire} className="text-red-500 text-xs" />
              </span>
              {promotionExpanded ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
            </button>
            <p className="text-xs text-purple-500 mb-2">Earn extra points at the best value, Click now!</p>
            {promotionExpanded && (
              <div className="space-y-2">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="border-2 border-transparent bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg p-[2px] cursor-pointer"
                    onClick={() => togglePromotion(promo.id)}
                  >
                    <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedPromotions.includes(promo.id)}
                          onChange={() => togglePromotion(promo.id)}
                          className="w-4 h-4 rounded border-gray-300 text-gray-700 shrink-0"
                        />
                        <span className="font-semibold flex items-center gap-1.5 text-sm text-gray-700 truncate">
                          {promo.label} <FontAwesomeIcon icon={faFire} className="text-red-500 shrink-0" />
                        </span>
                      </div>
                      {promo.price > 0 && (
                        <span className="font-bold text-sm text-gray-700 shrink-0 ml-2">{promo.price.toFixed(2)} USD</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Summary */}
          <div className="border-t pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Total point</span>
              <span className="text-cyan-400 font-bold">{totalPoints.toLocaleString()} PTs</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-700">Operation Fee</span>
              <span className="text-gray-700">- USD</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span className="text-gray-700">Total payment</span>
              <span className="text-cyan-400">{totalPrice.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link
              to="/Pricing"
              className="flex-1 border-2 border-cyan-400 text-cyan-400 rounded-lg py-2.5 text-sm font-semibold hover:bg-cyan-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button className="flex-1 bg-cyan-400 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-cyan-500 transition-colors">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
