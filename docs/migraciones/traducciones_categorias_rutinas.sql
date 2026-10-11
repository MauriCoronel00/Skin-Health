-- ============================================
-- TRADUCCIONES MULTILINGÜES - CATEGORÍAS Y RUTINAS
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- 1. Agregar columnas multilingües a categorias
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS label_pt text;
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS label_en text;
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS description_pt text;
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS description_en text;

-- 2. Agregar columnas multilingües a skincare_routines
ALTER TABLE skincare_routines ADD COLUMN IF NOT EXISTS title_pt text;
ALTER TABLE skincare_routines ADD COLUMN IF NOT EXISTS title_en text;
ALTER TABLE skincare_routines ADD COLUMN IF NOT EXISTS instruction_text_pt text;
ALTER TABLE skincare_routines ADD COLUMN IF NOT EXISTS instruction_text_en text;
ALTER TABLE skincare_routines ADD COLUMN IF NOT EXISTS steps_pt jsonb;
ALTER TABLE skincare_routines ADD COLUMN IF NOT EXISTS steps_en jsonb;

-- ============================================
-- CATEGORÍAS
-- ============================================

UPDATE categorias SET
  label_pt = 'Catálogo completo',
  description_pt = 'Catálogo completo de dermocosmética',
  label_en = 'All',
  description_en = 'Complete dermocosmetics catalog'
WHERE id = 'all';

UPDATE categorias SET
  label_pt = 'Iluminar',
  description_pt = 'Vitamina C, exfoliantes e antioxidantes',
  label_en = 'Brighten',
  description_en = 'Vitamin C, exfoliants and antioxidants'
WHERE id = 'brighten';

UPDATE categorias SET
  label_pt = 'Acalmar',
  description_pt = 'Centella asiática e barreira cutânea',
  label_en = 'Calm',
  description_en = 'Centella asiatica and skin barrier'
WHERE id = 'calm';

UPDATE categorias SET
  label_pt = 'Limpar',
  description_pt = 'Limpeza purificante e controle de poros',
  label_en = 'Cleanse',
  description_en = 'Purifying cleansing and pore control'
WHERE id = 'cleanse';

UPDATE categorias SET
  label_pt = 'Hidratar',
  description_pt = 'Fórmulas para restaurar água e luminosidade',
  label_en = 'Hydrate',
  description_en = 'Formulas to restore moisture and radiance'
WHERE id = 'hydrate';

UPDATE categorias SET
  label_pt = 'Proteger',
  description_pt = 'Proteção solar avançada FPS 50+',
  label_en = 'Protect',
  description_en = 'Advanced sun protection SPF 50+'
WHERE id = 'protect';

-- ============================================
-- RUTINAS
-- ============================================

-- Rutina 01: Piel Grasa y Tendencia al Acné
UPDATE skincare_routines SET
  title_pt = 'Rotina para Pele Oleosa e Tendência a Acne',
  title_en = 'Routine for Oily & Acne-Prone Skin',
  instruction_text_pt = 'ORDEM: Limpeza profunda prévia, aplicar sérums do menor ao maior densidade e finalizar a rotina da manhã com o protetor solar.',
  instruction_text_en = 'ORDER: Deep cleansing first, apply serums from least to most dense and finish the morning routine with sunscreen.',
  steps_pt = '[{"label":"Limpeza Purificante","productId":"cosrx-lowph-good-morning-gel","stepNumber":1},{"label":"Tratamento Sebo & Poros","productId":"boj-glow-serum-propolis","stepNumber":2},{"label":"Condicionamento","productId":"anua-heartleaf-77-toner","stepNumber":3},{"label":"Proteção Solar","productId":"boj-relief-sun-rice","stepNumber":4}]'::jsonb,
  steps_en = '[{"label":"Purifying Cleanser","productId":"cosrx-lowph-good-morning-gel","stepNumber":1},{"label":"Sebum & Pore Treatment","productId":"boj-glow-serum-propolis","stepNumber":2},{"label":"Conditioning","productId":"anua-heartleaf-77-toner","stepNumber":3},{"label":"Sunscreen","productId":"boj-relief-sun-rice","stepNumber":4}]'::jsonb
WHERE id = 'c3f2dd21-e602-4120-a88a-bbe8681fc2bc';

-- Rutina 02: Piel Sensible y Barrera Cutánea
UPDATE skincare_routines SET
  title_pt = 'Rotina para Pele Sensível e Barreira Cutânea',
  title_en = 'Routine for Sensitive Skin & Skin Barrier',
  instruction_text_pt = 'IMPORTANTE: Se o creme de ceramidas for utilizado durante o dia, o protetor solar deve ficar como último passo. A rotina pode ser ajustada conforme a necessidade de hidratação e conforto.',
  instruction_text_en = 'IMPORTANT: If the ceramide cream is used during the day, sunscreen must be the last step. The routine can be adjusted based on hydration and comfort needs.',
  steps_pt = '[{"label":"Limpeza Reconfortante","productId":"boj-radiance-cleansing-balm","stepNumber":1},{"label":"Calmante Intensivo","productId":"madagascar-centella-ampoule","stepNumber":2},{"label":"Reparação de Barreira","productId":"illiyoon-ceramide-ato-cream","stepNumber":3},{"label":"Proteção Solar","productId":"centella-hyalu-cica-sun-serum","stepNumber":4}]'::jsonb,
  steps_en = '[{"label":"Comforting Cleanser","productId":"boj-radiance-cleansing-balm","stepNumber":1},{"label":"Intensive Soother","productId":"madagascar-centella-ampoule","stepNumber":2},{"label":"Barrier Repair","productId":"illiyoon-ceramide-ato-cream","stepNumber":3},{"label":"Sunscreen","productId":"centella-hyalu-cica-sun-serum","stepNumber":4}]'::jsonb
WHERE id = 'e7b1a595-3a11-422c-9c1a-27de3fe75b94';

-- Rutina 03: Manchas, Hiperpigmentación y Luminosidad
UPDATE skincare_routines SET
  title_pt = 'Rotina para Manchas, Hiperpigmentação e Luminosidade',
  title_en = 'Routine for Dark Spots, Hyperpigmentation & Radiance',
  instruction_text_pt = 'IMPORTANTE: O tratamento despigmentante precisa de constância e protetor solar todos os dias; sem FPS as manchas voltam.',
  instruction_text_en = 'IMPORTANT: The depigmenting treatment needs consistency and daily sunscreen; without SPF the spots will return.',
  steps_pt = '[{"label":"Limpeza Suave","productId":"boj-radiance-cleansing-balm","stepNumber":1},{"label":"Tratamento Luminosidade","productId":"axis-y-dark-spot-serum","stepNumber":2},{"label":"Proteção Solar","productId":"boj-relief-sun-rice","stepNumber":3}]'::jsonb,
  steps_en = '[{"label":"Gentle Cleanser","productId":"boj-radiance-cleansing-balm","stepNumber":1},{"label":"Radiance Treatment","productId":"axis-y-dark-spot-serum","stepNumber":2},{"label":"Sunscreen","productId":"boj-relief-sun-rice","stepNumber":3}]'::jsonb
WHERE id = 'cda6a849-2c4e-489d-9861-927a51ca9295';

-- Rutina 04: Anti-Edad y Textura (Renovación)
UPDATE skincare_routines SET
  title_pt = 'Rotina Anti-Idade e Textura (Renovação)',
  title_en = 'Anti-Aging & Texture Routine (Renewal)',
  instruction_text_pt = 'IMPORTANTE: O esfoliante AHA/BHA deve ser incorporado progressivamente à noite. Durante o dia é indispensável aplicar protetor solar de amplo espectro.',
  instruction_text_en = 'IMPORTANT: The AHA/BHA exfoliant should be introduced progressively at night. During the day it is essential to apply broad-spectrum sunscreen.',
  steps_pt = '[{"label":"Limpeza Suave","productId":"skin1004-light-cleansing-oil","stepNumber":1},{"label":"Contorno de Olhos","productId":"boj-revive-eye-serum","stepNumber":2},{"label":"Tratamento Renovador","productId":"cosrx-aha-bha-toner","stepNumber":3},{"label":"Nutrição Intensiva","productId":"cosrx-snail-92-cream","stepNumber":4}]'::jsonb,
  steps_en = '[{"label":"Gentle Cleanser","productId":"skin1004-light-cleansing-oil","stepNumber":1},{"label":"Eye Contour","productId":"boj-revive-eye-serum","stepNumber":2},{"label":"Renewal Treatment","productId":"cosrx-aha-bha-toner","stepNumber":3},{"label":"Intensive Nutrition","productId":"cosrx-snail-92-cream","stepNumber":4}]'::jsonb
WHERE id = 'c01fc0f3-71d3-4e80-a458-0316b8c307d2';

-- Rutina 05: Básica de Hidratación Universal
UPDATE skincare_routines SET
  title_pt = 'Rotina Básica de Hidratação Universal',
  title_en = 'Universal Basic Hydration Routine',
  instruction_text_pt = 'ORDEM: Aplicar o refiner sobre a pele levemente úmida antes do creme para maximizar a retenção de água.',
  instruction_text_en = 'ORDER: Apply the refiner on slightly damp skin before the cream to maximize water retention.',
  steps_pt = '[{"label":"Limpeza Equilibrada","productId":"anua-heartleaf-cleansing-oil","stepNumber":1},{"label":"Sérum Hidratante","productId":"laneige-cream-skin-refiner","stepNumber":2},{"label":"Selante Hidratante","productId":"laneige-water-bank-cream","stepNumber":3},{"label":"Proteção Solar","productId":"isntree-hyaluronic-sun-gel","stepNumber":4}]'::jsonb,
  steps_en = '[{"label":"Balanced Cleanser","productId":"anua-heartleaf-cleansing-oil","stepNumber":1},{"label":"Hydrating Serum","productId":"laneige-cream-skin-refiner","stepNumber":2},{"label":"Moisture Seal","productId":"laneige-water-bank-cream","stepNumber":3},{"label":"Sunscreen","productId":"isntree-hyaluronic-sun-gel","stepNumber":4}]'::jsonb
WHERE id = '8c612509-4e24-4a1f-a789-35723eac0977';

-- Verificación
SELECT id, label, label_pt, label_en FROM categorias ORDER BY id;
SELECT number, title, title_pt, title_en FROM skincare_routines ORDER BY number;
