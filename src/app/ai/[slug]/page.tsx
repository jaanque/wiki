import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Model } from '@/types/database'




async function getModel(slug: string): Promise<Model | null> {
  const { data, error } = await supabase
    .from('models')
    .select(`
      *,
      model_categories (
        category:categories (id, name, slug)
      ),
      details:model_details (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as unknown as Model
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) return { title: 'Modelo no encontrado' }

  return {
    title: `${model.name} - Especificaciones Técnicas | wikIA`,
    description: model.description || `Ficha técnica completa de ${model.name}. Benchmarks, parámetros y casos de uso.`
  }
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) notFound()

  return (
    <div className="model-dashboard-container">


      <div className="dashboard-main-grid">
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="dashboard-content-area">
          <header className="model-premium-hero">
            <div className="model-branding">
              <div className="model-logo-circle">
                {model.logo_url ? (
                  <Image src={model.logo_url} alt="" width={64} height={64} unoptimized />
                ) : (
                  <span className="logo-placeholder">{model.name[0]}</span>
                )}
              </div>
              <div className="model-title-stack">
                <h1 className="model-name-display">{model.name}</h1>
                <div className="model-metatags">
                  <div className="flex flex-wrap gap-1">
                    {model.model_categories && model.model_categories.length > 0 ? (
                      model.model_categories.map((mc, idx) => mc.category ? (
                        <Link 
                          key={mc.category.id || idx} 
                          href={`/category/${mc.category.slug}`}
                          className={`badge badge-text ${getTypeClass(mc.category.name || model.type || '')}`}
                        >
                          {mc.category.name}
                        </Link>
                      ) : null)
                    ) : (
                      <span className={`badge badge-text ${getTypeClass(model.type || 'desconocido')}`}>
                        {model.type || 'DESCONOCIDO'}
                      </span>
                    )}
                  </div>
                  {model.developer && (
                    <span className="developer-tag">Desarrollado por <strong>{model.developer}</strong></span>
                  )}
                  {model.release_date && (
                    <span className="release-tag">Lanzamiento: {model.release_date}</span>
                  )}
                </div>
              </div>
            </div>
          </header>

          <section className="dashboard-section">
            <h3 className="section-label-technical">[DESCRIPCIÓN]</h3>
            <div className="model-description-box">
              <p>{model.description || 'Sin descripción técnica registrada.'}</p>
              {model.details?.full_description && (
                <div className="nested-full-description">
                  {model.details.full_description}
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-section">
            <h3 className="section-label-technical">[MÉTRICAS]</h3>
            <div className="benchmarks-dashboard-grid">
              <MetricCard label="MMLU" value={model.mmlu_score} sub="General Knowledge" />
              <MetricCard label="GSM8K" value={model.gsm8k_score} sub="Math Reasoning" />
              <MetricCard label="HumanEval" value={model.humaneval_score} sub="Coding Ability" />
            </div>
          </section>

          {(model.details?.use_cases || model.details?.limitations) && (
            <div className="details-two-col">
              {model.details?.use_cases && (
                <section className="dashboard-section">
                  <h3 className="section-label-technical">[CAPACIDADES]</h3>
                  <div className="technical-notes-box">
                    {model.details.use_cases}
                  </div>
                </section>
              )}
              {model.details?.limitations && (
                <section className="dashboard-section">
                  <h3 className="section-label-technical">[RESTRICCIONES]</h3>
                  <div className="technical-notes-box warning-box">
                    {model.details.limitations}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SPECS SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="technical-infobox-v2">
            <div className="infobox-table-header">Especificaciones Técnicas</div>
            <div className="infobox-grid">
              <InfoRow label="Parámetros" value={model.parameters} />
              <InfoRow label="Contexto" value={model.context_window} />
              <InfoRow label="Arquitectura" value={model.architecture} />
              <InfoRow label="Licencia" value={model.license} />
              <InfoRow label="Estado" value="PRODUCCIÓN" />
            </div>
            {model.documentation_url && (
              <div className="infobox-action">
                <Link href={model.documentation_url} target="_blank" className="btn-white-technical">
                  WHITEPAPER / DOCS
                </Link>
              </div>
            )}
          </div>

          {model.model_categories && model.model_categories.length > 0 && (
            <div className="sidebar-group">
              <h4 className="sidebar-label">Clasificación</h4>
              <div className="category-tags-list">
                {model.model_categories.map(mc => (
                  <Link key={mc.category.slug} href={`/category/${mc.category.slug}`} className="category-link-tag">
                    #{mc.category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub }: { label: string, value: number | null, sub: string }) {
  return (
    <div className="metric-card-v2">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value ? `${value}%` : 'N/A'}</span>
      </div>
      <div className="metric-bar-container">
        <div className="metric-bar-fill" style={{ width: `${value || 0}%` }} />
      </div>
      <span className="metric-subtext">{sub}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="info-row-v2">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  )
}

function getTypeClass(type: string) {
  const t = type.toLowerCase();
  if (t.includes('multimodal') || t.includes('multi-modal')) return 'tag-type-multimodal';
  return 'tag-type-text';
}

