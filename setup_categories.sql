-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla de relación muchos-a-muchos (un modelo puede tener varias categorías)
CREATE TABLE IF NOT EXISTS model_categories (
    model_id INTEGER REFERENCES models(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (model_id, category_id)
);

-- 3. Insertar categorías base
INSERT INTO categories (name, slug, description) VALUES
('Texto (LLM)', 'text', 'Modelos de lenguaje masivo especializados en razonamiento y generación de texto.'),
('Imagen', 'image', 'Modelos de difusión y generativos para la creación y edición de imágenes.'),
('Video', 'video', 'IAs especializadas en la generación y procesamiento de secuencias de video.'),
('Audio', 'audio', 'Modelos de síntesis de voz, música y procesamiento de audio.'),
('Multimodal', 'multimodal', 'Modelos capaces de procesar múltiples tipos de datos (texto, imagen, audio) simultáneamente.'),
('Open Source', 'open-source', 'Modelos con pesos abiertos o código fuente disponible para la comunidad.'),
('Proprietary', 'proprietary', 'Modelos de código cerrado accesibles únicamente vía API o plataformas oficiales.');

-- 4. Script de migración automática inicial
-- Vinculamos los modelos existentes a sus categorías basándonos en el campo 'type' actual
DO $$
DECLARE
    m RECORD;
    cat_id_text INTEGER;
    cat_id_image INTEGER;
    cat_id_os INTEGER;
    cat_id_prop INTEGER;
BEGIN
    SELECT id INTO cat_id_text FROM categories WHERE slug = 'text';
    SELECT id INTO cat_id_image FROM categories WHERE slug = 'image';
    SELECT id INTO cat_id_os FROM categories WHERE slug = 'open-source';
    SELECT id INTO cat_id_prop FROM categories WHERE slug = 'proprietary';

    FOR m IN SELECT id, type, license FROM models LOOP
        -- Categoría por Tipo
        IF m.type = 'Texto' THEN
            INSERT INTO model_categories (model_id, category_id) VALUES (m.id, cat_id_text) ON CONFLICT DO NOTHING;
        ELSIF m.type = 'Imagen' THEN
            INSERT INTO model_categories (model_id, category_id) VALUES (m.id, cat_id_image) ON CONFLICT DO NOTHING;
        END IF;

        -- Categoría por Licencia
        IF m.license ILIKE '%Apache%' OR m.license ILIKE '%MIT%' OR m.license ILIKE '%Llama%' THEN
            INSERT INTO model_categories (model_id, category_id) VALUES (m.id, cat_id_os) ON CONFLICT DO NOTHING;
        ELSE
            INSERT INTO model_categories (model_id, category_id) VALUES (m.id, cat_id_prop) ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- 5. Consulta de verificación
SELECT m.name as modelo, c.name as categoria
FROM models m
JOIN model_categories mc ON m.id = mc.model_id
JOIN categories c ON c.id = mc.category_id
ORDER BY m.name;
