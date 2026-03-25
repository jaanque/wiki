import { supabase } from "@/lib/supabase";

interface DictionaryTerm {
  id: number;
  term: string;
  definition: string;
  category?: string;
  slug: string;
}

export default async function DictionaryPage() {
  const { data: terms, error } = await supabase
    .from("dictionary")
    .select("*")
    .order("term", { ascending: true });

  if (error) {
    console.error("Error fetching dictionary:", error);
  }

  // Alphabetical Grouping
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const groupedTerms: Record<string, DictionaryTerm[]> = {};
  
  (terms as DictionaryTerm[])?.forEach((term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!groupedTerms[firstLetter]) groupedTerms[firstLetter] = [];
    groupedTerms[firstLetter].push(term);
  });

  return (
    <div className="dictionary-container pb-20">
      <div className="wiki-notice mb-8">
        <strong>Referencia Técnica:</strong> Glosario unificado de términos, conceptos y arquitecturas de Inteligencia Artificial. Haz clic en una letra para navegar rápidamente.
      </div>

      <header className="ranking-page-header mb-10">
        <h1 className="tracking-tighter uppercase">Diccionario de IA</h1>
        <p>Definiciones normativas y explicaciones técnicas de la era generativa.</p>
      </header>

      {/* A-Z Index */}
      <nav className="az-index">
        {alphabet.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className={`az-letter ${!groupedTerms[letter] ? "disabled" : ""}`}
          >
            {letter}
          </a>
        ))}
      </nav>

      {/* Dictionary Groups */}
      <div className="dictionary-content mt-12">
        {alphabet.map((letter) => {
          if (!groupedTerms[letter]) return null;
          return (
            <section key={letter} id={`letter-${letter}`} className="dictionary-group">
              <h2 className="dictionary-letter-header">{letter}</h2>
              <div className="terms-list">
                {groupedTerms[letter].map((entry) => (
                  <article key={entry.id} className="term-entry">
                    <div className="flex items-center group">
                      <span className="term-title">{entry.term}</span>
                      {entry.category && <span className="term-category">{entry.category}</span>}
                    </div>
                    <p className="term-definition mt-1">
                      {entry.definition}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {(!terms || terms.length === 0) && (
        <div className="technical-details mt-10">
          No se encontraron términos en el diccionario. Asegúrate de haber insertado datos en la tabla `dictionary` de Supabase.
        </div>
      )}
    </div>
  );
}
