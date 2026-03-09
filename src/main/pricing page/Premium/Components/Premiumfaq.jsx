import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../../hooks/useLanguage';

export default function Premiumfaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useLanguage();

  const faqData = [
    {
      question: t('Premiumfaq.questions.tryBefore.question'),
      answer: t('Premiumfaq.questions.tryBefore.answer')
    },
    {
      question: t('Premiumfaq.questions.paymentMethods.question'),
      answer: t('Premiumfaq.questions.paymentMethods.answer')
    },
    {
      question: t('Premiumfaq.questions.cancelAddOn.question'),
      answer: t('Premiumfaq.questions.cancelAddOn.answer')
    },
    {
      question: t('Premiumfaq.questions.taxInvoice.question'),
      answer: t('Premiumfaq.questions.taxInvoice.answer')
    }
  ];


  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* Title */}
      <h5 className="text-xl sm:text-3xl font-bold text-center mb-12 text-black">FAQ</h5>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg sm:text-xl font-semibold text-gray-900 pr-4">
                {item.question}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-gray-400 text-lg transition-transform duration-300 flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 sm:px-8 pb-6 pt-2">
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
