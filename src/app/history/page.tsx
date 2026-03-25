export default function HistoryPage() {
  return (
    <div className="history-container pb-20">
      <div className="wiki-notice mb-8">
        <strong>Referencia Histórica:</strong> Esta sección documenta los hitos técnicos, teóricos y arquitectónicos que han definido el desarrollo de la Inteligencia Artificial, desde la lógica formal hasta los modelos generativos contemporáneos.
      </div>

      <header className="ranking-page-header mb-12">
        <h1 className="tracking-tighter uppercase">Historia de la Inteligencia Artificial</h1>
        <p>Una cronología técnica del progreso computacional.</p>
      </header>

      <div className="history-timeline">
        {/* ERA 1 */}
        <div className="history-era">
          <div className="era-year">1950 — 1956</div>
          <h2 className="era-title">Los Cimientos: El Test de Turing y Dartmouth</h2>
          <div className="era-content">
            <p>Todo comenzó con la pregunta de Alan Turing: <em>&quot;¿Pueden pensar las máquinas?&quot;</em>. En 1950 publica &quot;Computing Machinery and Intelligence&quot;, proponiendo el famoso Test de Turing. En 1956, la Conferencia de Dartmouth marca el nacimiento oficial del término &quot;Inteligencia Artificial&quot; liderada por John McCarthy, Marvin Minsky y Claude Shannon.</p>
            <div className="historical-highlight">
              <span className="highlight-label">Hito Clave</span>
              <p className="font-bold">Logic Theorist (1955):</p>
              <p className="text-sm">Considerado el primer programa de IA, capaz de demostrar teoremas matemáticos complejos.</p>
            </div>
          </div>
        </div>

        {/* ERA 2 */}
        <div className="history-era">
          <div className="era-year">1960s — 1974</div>
          <h2 className="era-title">El Primer Optimismo y Eliza</h2>
          <div className="era-content">
            <p>Se desarrollan los primeros sistemas expertos y procesadores de lenguaje natural rudimentarios. ELIZA (1966) simula a un psicoterapeuta siendo el primer &quot;chatbot&quot; reconocido. Sin embargo, las limitaciones en la potencia de cálculo llevan al primer &quot;Invierno de la IA&quot;.</p>
          </div>
        </div>

        {/* ERA 3 */}
        <div className="history-era">
          <div className="era-year">1980 — 1987</div>
          <h2 className="era-title">El Auge de los Sistemas Expertos</h2>
          <div className="era-content">
            <p>Las empresas adoptan sistemas basados en reglas para la toma de decisiones. El algoritmo de <strong>Backpropagation</strong> (retropropagación) comienza a ser estudiado seriamente para entrenar redes neuronales artificiales.</p>
          </div>
        </div>

        {/* ERA 4 */}
        <div className="history-era">
          <div className="era-year">1997 — 2011</div>
          <h2 className="era-title">Grandes Datos y Deep Blue</h2>
          <div className="era-content">
            <p>En 1997, Deep Blue de IBM derrota a Garry Kasparov. Comienza el cambio hacia el Machine Learning estadístico. En 2011, Watson de IBM gana en Jeopardy!, demostrando la capacidad de procesar conocimiento a escala humana.</p>
          </div>
        </div>

        {/* ERA 5 */}
        <div className="history-era">
          <div className="era-year">2012 — 2017</div>
          <h2 className="era-title">La Revolución del Deep Learning</h2>
          <div className="era-content">
            <p>AlexNet (2012) rompe récords de visión por computador, validando el poder de las redes neuronales profundas y las GPUs. En 2016, AlphaGo derrota a Lee Sedol, un hito que se creía a décadas de distancia.</p>
          </div>
        </div>

        {/* ERA 6 */}
        <div className="history-era">
          <div className="era-year">2017 — PRESENTE</div>
          <h2 className="era-title">La Era del Transformer y LLMs</h2>
          <div className="era-content">
            <p>El paper &quot;Attention is All You Need&quot; (Google) introduce la arquitectura **Transformer**, permitiendo el entrenamiento masivo de modelos de lenguaje. La llegada de GPT-3 (2020) y ChatGPT (2022) democratiza la IA generativa, llevando al estado actual de wikIA: un ecosistema de modelos fronterizos capaces de razonar y crear.</p>
            <div className="historical-highlight border-blue-200 bg-blue-50/30">
              <span className="highlight-label text-blue-600">Estado Actual</span>
              <p className="font-bold">Multimodalidad y Razonamiento:</p>
              <p className="text-sm">Hoy, modelos como Claude 3.5, Gemini 1.5 y GPT-o1 no solo procesan texto, sino que integran visión, audio y capacidades de razonamiento lógico avanzado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
