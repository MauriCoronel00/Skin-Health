-- Traducciones PT/EN: Torriden DIVE-IN Cream, TIRTIR Milk Skin Toner (nuevos, sin traducir)
-- + subtitle PT/EN faltante de Skin1004 Poremizing Fresh Ampoule.

-- 1. Torriden - DIVE-IN Low Molecule Hyaluronic Acid Soothing Cream
update public.productos set
  nombre_pt = nombre,
  nombre_en = nombre,
  subtitle_pt = 'Creme-gel com 5 ácidos hialurônicos e complexo Cica',
  subtitle_en = 'Gel-cream with 5 hyaluronic acids and Cica complex',
  descripcion_pt = 'Creme-gel hidratante leve de rápida absorção com 5 tipos de ácido hialurônico de baixo peso molecular e complexo Cica. Acalma a irritação, refresca a pele e retém a umidade o dia todo sem obstruir os poros nem deixar sensação oleosa.',
  descripcion_en = 'Lightweight fast-absorbing hydrating gel-cream with 5 types of low molecular weight hyaluronic acid and Cica complex. Calms irritation, refreshes skin and locks in moisture all day without clogging pores or leaving a greasy feeling.',
  skin_type_pt = 'Ideal para peles mistas, oleosas, sensíveis ou desidratadas que buscam leveza e conforto.',
  skin_type_en = 'Ideal for combination, oily, sensitive or dehydrated skin looking for lightness and comfort.',
  how_to_use_pt = 'Como última etapa da sua rotina, aplique uma camada generosa no rosto e massageie suavemente até absorver. Reaplique nas áreas mais secas quando precisar.',
  how_to_use_en = 'As the last step of your routine, apply a generous layer over the face and massage gently until absorbed. Reapply on drier areas as needed.',
  key_ingredients_pt = ARRAY['5 tipos de ácido hialurônico', 'Complexo Cica'],
  key_ingredients_en = ARRAY['5 types of hyaluronic acid', 'Cica complex'],
  producto_beneficios_pt = '[]'::jsonb,
  producto_beneficios_en = '[]'::jsonb
where id = 'torriden-dive-in-cream';

-- 2. TIRTIR - Milk Skin Toner
update public.productos set
  nombre_pt = nombre,
  nombre_en = nombre,
  subtitle_pt = 'Tônico leitoso com arroz, ceramidas e niacinamida',
  subtitle_en = 'Milky toner with rice, ceramides and niacinamide',
  descripcion_pt = 'Tônico leitoso de textura rica e ultra hidratante com extrato de arroz, ceramidas e niacinamida. Proporciona hidratação profunda, reforça a barreira cutânea e ilumina o rosto na hora para um acabamento glass skin.',
  descripcion_en = 'Rich, ultra-hydrating milky toner with rice extract, ceramides and niacinamide. Delivers deep hydration, strengthens the skin barrier and instantly brightens the face for a glass skin finish.',
  skin_type_pt = 'Ideal para peles secas, desidratadas, opacas ou com tom irregular.',
  skin_type_en = 'Ideal for dry, dehydrated, dull or uneven-toned skin.',
  how_to_use_pt = 'Após limpar o rosto, aplique 2-3 camadas com as palmas das mãos sobre a pele levemente úmida e pressione suavemente até absorver. Use de dia e à noite, antes do hidratante.',
  how_to_use_en = 'After cleansing, apply 2-3 layers with your palms over slightly damp skin and press gently until absorbed. Use day and night, before moisturizer.',
  key_ingredients_pt = ARRAY['Extrato de arroz', 'Ceramidas', 'Niacinamida'],
  key_ingredients_en = ARRAY['Rice extract', 'Ceramides', 'Niacinamide'],
  producto_beneficios_pt = '[]'::jsonb,
  producto_beneficios_en = '[]'::jsonb
where id = 'tirtir-milk-skin-toner';

-- 3. Skin1004 Poremizing Fresh Ampoule: subtitle ES vacío, replicar vacío en PT/EN
update public.productos set
  subtitle_pt = '',
  subtitle_en = ''
where id = 'centella-poremizing-ampoule';
