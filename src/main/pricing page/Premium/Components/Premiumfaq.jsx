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
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <h2 className="text-3xl font-black text-center mb-12 tracking-tight text-slate-900">
        {t('faq.title') ?? 'Frequently Asked Questions'}
      </h2>

      {/* FAQ Items */}
      <div className="space-y-5">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 overflow-hidden shadow-sm hover:border-white transition-all"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-8 py-5 flex items-center justify-between text-left group"
            >
              <span className="font-bold text-slate-700 pr-4">
                {item.question}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-slate-400 text-lg transition-all duration-300 shrink-0 group-hover:text-indigo-600 ${
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
              <div className="px-8 pb-6 pt-0.5">
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
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
