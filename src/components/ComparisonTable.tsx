'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ModelComparisonData {
  id: number;
  name: string;
  slug: string;
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
      <div className="p-12 text-center border-2 border-dashed border-gray-200 text-gray-400 italic" role="status">
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
    { label: 'MMLU Score', key: 'mmlu_score', suffix: '%', isBenchmark: true },
    { label: 'GSM8K Score', key: 'gsm8k_score', suffix: '%', isBenchmark: true },
    { label: 'HumanEval', key: 'humaneval_score', suffix: '%', isBenchmark: true },
  ];

  const getValue = (model: ModelComparisonData, key: string) => {
    if (key.startsWith('specs.')) {
      const field = key.split('.')[1] as keyof NonNullable<ModelComparisonData['model_details']>['technical_specs'];
      return model.model_details?.technical_specs?.[field] || 'N/A';
    }
    return (model as unknown as Record<string, string | number>)[key] || 'N/A';
  };

  // Find the highest value for a benchmark row
  const getBestInRow = (key: string) => {
    const values = models.map(m => {
      const val = getValue(m, key);
      return typeof val === 'number' ? val : parseFloat(val.toString()) || 0;
    });
    return Math.max(...values);
  };

  return (
    <div className="compare-table-wrapper overflow-x-auto" role="region" aria-label="Tabla comparativa de modelos IA">
      <table className="compare-matrix w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 bg-gray-50 z-10 text-left border p-4 min-w-[150px]">Atributo</th>
            {models.map(model => (
              <th key={model.id} scope="col" className="border p-4 min-w-[200px] bg-white text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="compare-model-logo relative" aria-hidden="true">
                    {model.logo_url ? (
                      <Image 
                        src={model.logo_url} 
                        alt="" 
                        width={40} 
                        height={40} 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <span className="text-lg uppercase font-black">{model.name[0]}</span>
                    )}
                  </div>
                  <Link href={`/ai/${model.slug}`} className="font-bold text-blue-700 hover:underline tracking-tight">
                    {model.name}
                  </Link>
                  <button 
                    onClick={() => onRemove(model.id)}
                    className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700 p-1"
                    aria-label={`Quitar ${model.name} de la comparación`}
                  >
                    [Quitar]
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const bestValue = row.isBenchmark ? getBestInRow(row.key) : null;
            
            return (
              <tr key={row.key} className="hover:bg-gray-50 transition-colors">
                <th scope="row" className="sticky left-0 bg-gray-50 z-10 font-bold border p-3 text-xs uppercase text-gray-500 text-left">
                  {row.label}
                </th>
                {models.map(model => {
                  const val = getValue(model, row.key);
                  const isBest = row.isBenchmark && val === bestValue && bestValue > 0;
                  
                  return (
                    <td 
                      key={model.id} 
                      className={`border p-4 text-center text-sm ${isBest ? 'is-best' : ''}`}
                    >
                      <span className={isBest ? 'font-black' : ''}>
                        {val}{row.suffix ? row.suffix : ''}
                      </span>
                      {isBest && <span className="sr-only"> (Mejor valor en esta categoría)</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
