'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Model } from '@/types/database'

type RankingModel = Pick<Model, 'id' | 'name' | 'slug' | 'developer' | 'logo_url' | 'mmlu_score' | 'gsm8k_score' | 'humaneval_score'> & {
  power_score: number
}

export default function RankingPage() {
  const [models, setModels] = useState<RankingModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true)
      const { data, error } = await supabase
        .from('models')
        .select('id, name, slug, developer, logo_url, mmlu_score, gsm8k_score, humaneval_score')
      
      if (!error && data) {
        const withScores = data.map(m => {
          const power_score = (m.mmlu_score + m.gsm8k_score + m.humaneval_score) / 3
          return { ...m, power_score }
        })
        
        withScores.sort((a, b) => b.power_score - a.power_score)
        setModels(withScores)
      }
      setLoading(false)
    }

    fetchRanking()
  }, [])

  return (
    <div className="ranking-container">
      <div className="wiki-notice mb-8">
        <strong>Protocolo de Clasificación:</strong> El ranking de wikIA utiliza el <em>Power Score</em>, un promedio técnico balanceado entre los benchmarks fundamentales: <strong>MMLU</strong> (conocimiento general), <strong>GSM8K</strong> (razonamiento matemático) y <strong>HumanEval</strong> (capacidad de codificación).
      </div>

      <header className="ranking-page-header">
        <h1 className="tracking-tighter uppercase">Clasificación de Modelos</h1>
        <p>Índice técnico de potencias basado en rendimiento bruto verificado.</p>
      </header>

      {loading ? (
        <div className="p-12 text-center text-gray-400 italic">Sincronizando registros técnicos...</div>
      ) : (
        <div className="ranking-table-container">
          <table className="data-grid w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th style={{ width: '60px' }}>POS</th>
                <th className="text-left">Modelo / Desarrollador</th>
                <th>MMLU</th>
                <th>Razonamiento</th>
                <th>Código</th>
                <th className="bg-blue-50 text-blue-700">Power Score</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, index) => (
                <tr key={model.id} className={`ranking-row-item rank-${index + 1} border-b border-gray-100 last:border-0`}>
                  <td className="rank-cell">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${(index + 1).toString().padStart(2, '0')}`}
                  </td>
                  <td>
                    <div className="model-rank-info">
                      <div className="logo-table">
                        {model.logo_url ? (
                          <Image src={model.logo_url} alt="" width={36} height={36} unoptimized className="object-contain" />
                        ) : (
                          model.name[0]
                        )}
                      </div>
                      <div>
                        <Link href={`/ai/${model.slug}`} className="model-rank-name">
                          {model.name}
                        </Link>
                        <span className="model-rank-dev">{model.developer}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="benchmark-mini-group">
                      <div className="benchmark-label-row">
                        <span>Score</span>
                        <span className="benchmark-val-text">{model.mmlu_score}%</span>
                      </div>
                      <div className="benchmark-bar-container">
                        <div className="benchmark-bar-fill" style={{ width: `${model.mmlu_score}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="benchmark-mini-group">
                      <div className="benchmark-label-row">
                        <span>Score</span>
                        <span className="benchmark-val-text">{model.gsm8k_score}%</span>
                      </div>
                      <div className="benchmark-bar-container">
                        <div className="benchmark-bar-fill" style={{ width: `${model.gsm8k_score}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="benchmark-mini-group">
                      <div className="benchmark-label-row">
                        <span>Score</span>
                        <span className="benchmark-val-text">{model.humaneval_score}%</span>
                      </div>
                      <div className="benchmark-bar-container">
                        <div className="benchmark-bar-fill" style={{ width: `${model.humaneval_score}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center bg-blue-50/30">
                    <div className="rank-score-chip">
                      {model.power_score.toFixed(1)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
