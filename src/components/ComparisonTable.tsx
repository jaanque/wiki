'use client'

import React from 'react';
import Link from 'next/link';

interface ModelComparisonData {
  id: number;
  name: string;
  developer: string;
  logo_url?: string;
  release_date: string;
  mmlu_score: number;
  gsm8k_score: number;
  humaneval_score: number;
  model_details?: {
    technical_specs: {
      parameters?: string;
      context_window?: string;
      license?: string;
    };
  };
}

interface Props {
  models: ModelComparisonData[];
  onRemove: (id: number) => void;
}

export default function ComparisonTable({ models, onRemove }: Props) {
  if (models.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-gray-200 text-gray-400 italic">
        No hay modelos seleccionados para comparar.
      </div>
    );
  }

  const rows = [
    { label: 'Desarrollador', key: 'developer' },
    { label: 'Lanzamiento', key: 'release_date' },
    { label: 'Parámetros', key: 'specs.parameters' },
    { label: 'Context Window', key: 'specs.context_window' },
    { label: 'Licencia', key: 'specs.license' },
    { label: 'MMLU Score', key: 'mmlu_score', suffix: '%' },
    { label: 'GSM8K Score', key: 'gsm8k_score', suffix: '%' },
    { label: 'HumanEval', key: 'humaneval_score', suffix: '%' },
  ];

  const getValue = (model: ModelComparisonData, key: string) => {
    if (key.startsWith('specs.')) {
      const field = key.split('.')[1] as keyof NonNullable<ModelComparisonData['model_details']>['technical_specs'];
      return model.model_details?.technical_specs?.[field] || 'N/A';
    }
    return (model as unknown as Record<string, string | number>)[key] || 'N/A';
  };

  return (
    <div className="compare-table-wrapper overflow-x-auto">
      <table className="compare-matrix w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-gray-50 z-10 text-left border p-4 min-w-[150px]">Atributo</th>
            {models.map(model => (
              <th key={model.id} className="border p-4 min-w-[200px] bg-white text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center font-bold text-blue-600 border">
                    {model.name[0]}
                  </div>
                  <Link href={`/ai/${model.name.toLowerCase().replace(/ /g, '-')}`} className="font-bold text-blue-700 hover:underline">
                    {model.name}
                  </Link>
                  <button 
                    onClick={() => onRemove(model.id)}
                    className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700"
                  >
                    [Quitar]
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key} className="hover:bg-gray-50 transition-colors">
              <td className="sticky left-0 bg-gray-50 z-10 font-bold border p-3 text-xs uppercase text-gray-500">
                {row.label}
              </td>
              {models.map(model => (
                <td key={model.id} className="border p-4 text-center text-sm">
                  {getValue(model, row.key)}{row.suffix ? row.suffix : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
