import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.js';

export default function ReportPage() {
  const { t } = useLanguage();

  const reportSections = [
    {
      title: 'Usage Report',
      items: [
        { label: 'Characters used this month', value: '12,450' },
        { label: 'Audio generated', value: '24 clips' },
        { label: 'Voice Studio projects', value: '3' }
      ]
    },
    {
      title: 'Points & Billing',
      items: [
        { label: 'Current balance', value: '100 PTs' },
        { label: 'Monthly points', value: '0 PTs' },
        { label: 'Last purchase', value: '—' }
      ]
    }
  ];

  return (
    <main className="w-full min-h-[80vh] py-8 px-4 sm:px-8">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("nav.report")}</h1>
        <p className="text-gray-600 text-sm mb-8">
          View your usage and billing summary.
        </p>

        <div className="space-y-6">
          {reportSections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {section.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
