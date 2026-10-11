-- ============================================
-- TRADUCCIONES MULTILINGÜES - PRODUCTOS
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- 1. Anua Heartleaf 77 Soothing Toner
UPDATE productos SET
  nombre_pt = 'Anua Heartleaf 77 Tônico Calmante',
  nombre_en = 'Anua Heartleaf 77 Soothing Toner',
  subtitle_pt = 'Tônico calmante com 77% Heartleaf',
  subtitle_en = 'Soothing toner with 77% Heartleaf',
  descripcion_pt = 'Tônico aquoso com 77% extrato de Houttuynia Cordata que acalma vermelhidão e equilibra a pele com tendência acneica sem ressecar. Prepara a pele para absorver melhor sérums e cremes.',
  descripcion_en = 'Watery toner with 77% Houttuynia Cordata extract that calms redness and balances acne-prone skin without drying. Prepares the skin to better absorb serums and creams.',
  key_ingredients_pt = ARRAY['77% extrato de Heartleaf','Textura aquosa de absorção imediata','Sem fragrância'],
  key_ingredients_en = ARRAY['77% Heartleaf extract','Immediate absorption watery texture','Fragrance-free'],
  skin_type_pt = 'Pele oleosa, mista ou sensível',
  skin_type_en = 'Oily, combination or sensitive skin',
  how_to_use_pt = 'Após a limpeza, aplicar com as mãos ou um algodão sobre rosto e pescoço com toques suaves até absorver. Manhã e noite.',
  how_to_use_en = 'After cleansing, apply with hands or cotton pad on face and neck with gentle pats until absorbed. Morning and night.',
  producto_beneficios_pt = '[{"titulo":"Calma imediata","descripcion":"O 77% de heartleaf alivia vermelhidão e sensibilidade desde a primeira aplicação.","orden":1},{"titulo":"Equilibra sem ressecar","descripcion":"Regula a oleosidade da zona T mantendo a hidratação natural.","orden":2},{"titulo":"Prepara a pele","descripcion":"Deixa o rosto receptivo para que sérums e cremes penetrem melhor.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Immediate relief","descripcion":"77% heartleaf relieves redness and sensitivity from the first application.","orden":1},{"titulo":"Balances without drying","descripcion":"Regulates T-zone oiliness while maintaining natural hydration.","orden":2},{"titulo":"Prepares the skin","descripcion":"Leaves face receptive for serums and creams to penetrate better.","orden":3}]'::jsonb
WHERE id = 'anua-heartleaf-77-toner';

-- 2. Anua Heartleaf Pore Control Cleansing Oil
UPDATE productos SET
  nombre_pt = 'Anua Heartleaf Pore Control Cleansing Oil',
  nombre_en = 'Anua Heartleaf Pore Control Cleansing Oil',
  subtitle_pt = 'Óleo limpa-poros',
  subtitle_en = 'Pore control cleansing oil',
  descripcion_pt = 'Óleo de limpeza leve com Heartleaf que dissolve protetor solar, maquiagem e sebo acumulado sem deixar resíduo oleoso. Ajuda a manter os poros limpos e menos visíveis.',
  descripcion_en = 'Light cleansing oil with Heartleaf that dissolves sunscreen, makeup and accumulated sebum without leaving greasy residue. Helps keep pores clean and less visible.',
  key_ingredients_pt = ARRAY['Extrato de Heartleaf','Óleos vegetais leves','Enxágua sem resíduo'],
  key_ingredients_en = ARRAY['Heartleaf extract','Light vegetable oils','Rinses without residue'],
  skin_type_pt = 'Pele oleosa ou mista',
  skin_type_en = 'Oily or combination skin',
  how_to_use_pt = 'Com o rosto seco, massajar 1 minuto e emulsificar com água morna. Retirar e seguir com um limpiador em base aquosa. Noite.',
  how_to_use_en = 'On dry face, massage for 1 minute and emulsify with warm water. Remove and follow with a water-based cleanser. Night.',
  producto_beneficios_pt = '[{"titulo":"Dissolve tudo","descripcion":"Retira maquiagem, protetor solar e sebo sem esfregar nem irritar.","orden":1},{"titulo":"Poros mais limpos","descripcion":"O heartleaf ajuda a manter os poros desobstruídos e menos visíveis.","orden":2},{"titulo":"Sem resíduo oleoso","descripcion":"Emulsifica com água e enxágua deixando a pele fresca.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Dissolves everything","descripcion":"Removes makeup, sunscreen and sebum without rubbing or irritating.","orden":1},{"titulo":"Cleaner pores","descripcion":"Heartleaf helps keep pores clear and less visible.","orden":2},{"titulo":"No greasy residue","descripcion":"Emulsifies with water and rinses leaving skin fresh.","orden":3}]'::jsonb
WHERE id = 'anua-heartleaf-cleansing-oil';

-- 3. Axis-Y Dark Spot Correcting Glow Serum
UPDATE productos SET
  nombre_pt = 'Axis-Y Dark Spot Correcting Glow Serum',
  nombre_en = 'Axis-Y Dark Spot Correcting Glow Serum',
  subtitle_pt = 'Sérum anti-manchas com 5% Niacinamida',
  subtitle_en = 'Anti-dark spot serum with 5% Niacinamide',
  descripcion_pt = 'Sérum corretor com 5% niacinamida e extrato de arroz que unifica o tom, atenua manchas escuras e marcas de acne, e devolve luminosidade com uso constante e protetor solar.',
  descripcion_en = 'Correcting serum with 5% niacinamide and rice extract that evens skin tone, fades dark spots and acne marks, and restores radiance with consistent use and sunscreen.',
  key_ingredients_pt = ARRAY['Niacinamida 5%','Extrato de farelo de arroz','Esqualano vegetal'],
  key_ingredients_en = ARRAY['5% Niacinamide','Rice bran extract','Vegetable squalane'],
  skin_type_pt = 'Todo tipo de pele com manchas ou tom irregular',
  skin_type_en = 'All skin types with dark spots or uneven tone',
  how_to_use_pt = 'Aplicar 2 a 3 gotas sobre o rosto limpo insistindo nas zonas com manchas. Manhã e noite, sempre com protetor solar de dia.',
  how_to_use_en = 'Apply 2 to 3 drops on clean face focusing on areas with dark spots. Morning and night, always with sunscreen during the day.',
  producto_beneficios_pt = '[{"titulo":"Atenua manchas","descripcion":"A niacinamida a 5% reduz manchas escuras e marcas de acne.","orden":1},{"titulo":"Unifica o tom","descripcion":"O extrato de arroz proporciona luminosidade uniforme ao rosto.","orden":2},{"titulo":"Hidrata leve","descripcion":"O esqualano suaviza sem sensação oleosa nem pesada.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Fades dark spots","descripcion":"5% niacinamide reduces dark spots and acne marks.","orden":1},{"titulo":"Evens skin tone","descripcion":"Rice extract provides even radiance to the face.","orden":2},{"titulo":"Light hydration","descripcion":"Squalane smooths without greasy or heavy feeling.","orden":3}]'::jsonb
WHERE id = 'axis-y-dark-spot-serum';

-- 4. Beauty of Joseon Glow Serum (Propolis + Niacinamide)
UPDATE productos SET
  nombre_pt = 'Beauty of Joseon Glow Serum (Própoleis + Niacinamida)',
  nombre_en = 'Beauty of Joseon Glow Serum (Propolis + Niacinamide)',
  subtitle_pt = 'Sérum glow com Própoleis e Niacinamida',
  subtitle_en = 'Glow serum with Propolis and Niacinamide',
  descripcion_pt = 'Sérum com 60% própoleis e niacinamida que acalma, hidrata e devolve o glow à pele opaca ou com tendência acneica. Melhora textura e aparência dos poros sem sensação pesada.',
  descripcion_en = 'Serum with 60% propolis and niacinamide that calms, hydrates and restores glow to dull or acne-prone skin. Improves texture and pore appearance without heavy feeling.',
  key_ingredients_pt = ARRAY['Própoleis 60% + Niacinamida 2%','Betaina hidratante','Textura mel de rápida absorção'],
  key_ingredients_en = ARRAY['60% Propolis + 2% Niacinamide','Hydrating betaine','Fast-absorbing honey texture'],
  skin_type_pt = 'Pele oleosa, mista ou opaca',
  skin_type_en = 'Oily, combination or dull skin',
  how_to_use_pt = 'Aplicar 2 a 3 gotas sobre o rosto depois do tônico, manhã e noite, antes do creme.',
  how_to_use_en = 'Apply 2 to 3 drops on face after toner, morning and night, before cream.',
  producto_beneficios_pt = '[{"titulo":"Glow saudável","descripcion":"O 60% de própoleis devolve luminosidade à pele opaca.","orden":1},{"titulo":"Calma e equilibra","descripcion":"A niacinamida regula o sebo e melhora a aparência dos poros.","orden":2},{"titulo":"Textura mel","descripcion":"Nutre sem pesar, ideal mesmo com tendência acneica.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Healthy glow","descripcion":"60% propolis restores radiance to dull skin.","orden":1},{"titulo":"Calms and balances","descripcion":"Niacinamide regulates sebum and improves pore appearance.","orden":2},{"titulo":"Honey texture","descripcion":"Nourishes without heaviness, ideal even for acne-prone skin.","orden":3}]'::jsonb
WHERE id = 'boj-glow-serum-propolis';

-- 5. Beauty of Joseon Radiance Cleansing Balm
UPDATE productos SET
  nombre_pt = 'Beauty of Joseon Radiance Cleansing Balm',
  nombre_en = 'Beauty of Joseon Radiance Cleansing Balm',
  subtitle_pt = 'Bálsamo limpiador primeiro passo coreano',
  subtitle_en = 'Korean first-step cleansing balm',
  descripcion_pt = 'Bálsamo que derrete em óleo para dissolver maquiagem, protetor solar e excesso de sebo sem irritar. Deixa a pele limpa e macia, pronta para o segundo passo de limpeza.',
  descripcion_en = 'Balm that melts into oil to dissolve makeup, sunscreen and excess sebum without irritating. Leaves skin clean and soft, ready for the second cleansing step.',
  key_ingredients_pt = ARRAY['Base de óleos vegetais','Extrato de arroz','Retira com água sem resíduo'],
  key_ingredients_en = ARRAY['Vegetable oil base','Rice extract','Rinses with water without residue'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Com a pele seca, massajar até dissolver a maquiagem e emulsificar com água. Retirar e continuar com limpiador aquoso. Noite.',
  how_to_use_en = 'On dry skin, massage until makeup dissolves and emulsify with water. Remove and continue with water-based cleanser. Night.',
  producto_beneficios_pt = '[{"titulo":"Derrete a maquiagem","descripcion":"Dissolve base, máscara e protetor solar ao contato.","orden":1},{"titulo":"Limpeza sem tirantez","descripcion":"Limpa a fundo respeitando a hidratação natural.","orden":2},{"titulo":"Pele radiante","descripcion":"O extrato de arroz deixa o rosto macio e luminoso.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Melts makeup","descripcion":"Dissolves foundation, mask and sunscreen on contact.","orden":1},{"titulo":"Cleansing without tightness","descripcion":"Deep cleanses while respecting natural hydration.","orden":2},{"titulo":"Radiant skin","descripcion":"Rice extract leaves face soft and luminous.","orden":3}]'::jsonb
WHERE id = 'boj-radiance-cleansing-balm';

-- 6. Beauty of Joseon Relief Sun Rice + Probiotics SPF50+
UPDATE productos SET
  nombre_pt = 'Beauty of Joseon Relief Sun Rice + Probióticos SPF50+ PA++++',
  nombre_en = 'Beauty of Joseon Relief Sun Rice + Probiotics SPF50+ PA++++',
  subtitle_pt = 'Protetor solar SPF50+ com Arroz e Probióticos',
  subtitle_en = 'SPF50+ sunscreen with Rice and Probiotics',
  descripcion_pt = 'Protetor solar leve com extrato de arroz e probióticos que hidrata e acalma enquanto protege do sol. Acabado natural sem resíduo branco, ideal para uso diário.',
  descripcion_en = 'Lightweight sunscreen with rice extract and probiotics that hydrates and calms while protecting from the sun. Natural finish without white cast, ideal for daily use.',
  key_ingredients_pt = ARRAY['Filtros SPF50+ PA++++','Extrato de arroz','Probióticos calmantes'],
  key_ingredients_en = ARRAY['SPF50+ PA++++ filters','Rice extract','Soothing probiotics'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Como último passo da manhã, aplicar dois dedos de produto em rosto e pescoço. Reaplicar cada 3 horas se houver exposição direta.',
  how_to_use_en = 'As the last morning step, apply two fingers of product on face and neck. Reapply every 3 hours if there is direct exposure.',
  producto_beneficios_pt = '[{"titulo":"Proteção diária","descripcion":"Filtros SPF50+ PA++++ contra raios UVA e UVB.","orden":1},{"titulo":"Hidrata e acalma","descripcion":"O arroz e os probióticos confortam a pele exposta ao sol.","orden":2},{"titulo":"Sem resíduo branco","descripcion":"Textura leve de acabado natural para todos os tons.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Daily protection","descripcion":"SPF50+ PA++++ filters against UVA and UVB rays.","orden":1},{"titulo":"Hydrates and calms","descripcion":"Rice and probiotics comfort sun-exposed skin.","orden":2},{"titulo":"No white cast","descripcion":"Lightweight texture with natural finish for all skin tones.","orden":3}]'::jsonb
WHERE id = 'boj-relief-sun-rice';

-- 7. Beauty of Joseon Revive Eye Serum (Ginseng + Retinal)
UPDATE productos SET
  nombre_pt = 'Beauty of Joseon Revive Eye Serum (Ginseng + Retinal)',
  nombre_en = 'Beauty of Joseon Revive Eye Serum (Ginseng + Retinal)',
  subtitle_pt = 'Sérum de olhos com Ginseng e Retinal',
  subtitle_en = 'Eye serum with Ginseng and Retinal',
  descripcion_pt = 'Sérum para o contorno de olhos com ginseng e retinal que ajuda a suavizar linhas finas, olheiras e sinais de fadiga. Textura leve que se absorve sem pesadez.',
  descripcion_en = 'Eye contour serum with ginseng and retinal that helps smooth fine lines, dark circles and signs of fatigue. Light texture that absorbs without heaviness.',
  key_ingredients_pt = ARRAY['Extrato de ginseng','Retinal de ação suave','Niacinamida iluminadora'],
  key_ingredients_en = ARRAY['Ginseng extract','Gentle action retinal','Brightening niacinamide'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Aplicar uma gota em cada contorno com o dedo anelar, com toques suaves sem arrastar. À noite; de dia acompanhar com protetor solar.',
  how_to_use_en = 'Apply one drop on each contour with ring finger, with gentle pats without dragging. At night; during the day pair with sunscreen.',
  producto_beneficios_pt = '[{"titulo":"Suaviza linhas","descripcion":"O retinal ajuda a atenuar linhas finas do contorno.","orden":1},{"titulo":"Energiza o olhar","descripcion":"O ginseng revitaliza olheiras e sinais de fadiga.","orden":2},{"titulo":"Absorção leve","descripcion":"Absorve rápido sem deixar pesadez nem brilho.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Smooths lines","descripcion":"Retinal helps fade fine lines in the eye contour.","orden":1},{"titulo":"Energizes the gaze","descripcion":"Ginseng revitalizes dark circles and signs of fatigue.","orden":2},{"titulo":"Light absorption","descripcion":"Absorbs quickly without leaving heaviness or shine.","orden":3}]'::jsonb
WHERE id = 'boj-revive-eye-serum';

-- 8. COSRX Acne Pimple Master Patch
UPDATE productos SET
  nombre_pt = 'COSRX Acne Pimple Master Patch (Pack x24)',
  nombre_en = 'COSRX Acne Pimple Master Patch (Pack x24)',
  subtitle_pt = 'Parches hidrocoloides para granitos',
  subtitle_en = 'Hydrocolloid patches for pimples',
  descripcion_pt = 'Pack de 24 parches hidrocoloides em 3 tamanhos que protegem o granito, absorvem impurezas e aceleram sua recuperação. Quase invisíveis, usam-se de dia ou de noite.',
  descripcion_en = 'Pack of 24 hydrocolloid patches in 3 sizes that protect the pimple, absorb impurities and speed up recovery. Nearly invisible, can be worn day or night.',
  key_ingredients_pt = ARRAY['Hidrocoloide absorvente','3 tamanhos em um pack','Protege e evita tocar a zona'],
  key_ingredients_en = ARRAY['Absorbent hydrocolloid','3 sizes in one pack','Protects and prevents touching the area'],
  skin_type_pt = 'Pele com tendência acneica (tratamento pontual)',
  skin_type_en = 'Acne-prone skin (spot treatment)',
  how_to_use_pt = 'Sobre a pele limpa e seca, colar um parche do tamanho adequado sobre o granito. Deixar agir várias horas ou toda a noite e retirar.',
  how_to_use_en = 'On clean and dry skin, stick a patch of appropriate size on the pimple. Leave on for several hours or overnight and remove.',
  producto_beneficios_pt = '[{"titulo":"Acelera a recuperação","descripcion":"O hidrocoloide absorve impurezas e protege o granito.","orden":1},{"titulo":"Evita marcas","descripcion":"Cobre a zona para não tocar nem estourar.","orden":2},{"titulo":"Discreto","descripcion":"Quase invisível, pode-se usar de dia sob a maquiagem.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Speeds up recovery","descripcion":"Hydrocolloid absorbs impurities and protects the pimple.","orden":1},{"titulo":"Prevents marks","descripcion":"Covers the area to prevent touching or popping.","orden":2},{"titulo":"Discreet","descripcion":"Nearly invisible, can be worn during the day under makeup.","orden":3}]'::jsonb
WHERE id = 'cosrx-pimple-master-patch';

-- 9. COSRX Advanced Snail 92 All In One Cream
UPDATE productos SET
  nombre_pt = 'COSRX Advanced Snail 92 All In One Cream',
  nombre_en = 'COSRX Advanced Snail 92 All In One Cream',
  subtitle_pt = 'Creme reparador com 92% Mucina de Caracol',
  subtitle_en = 'Repair cream with 92% Snail Mucin',
  descripcion_pt = 'Creme com 92% mucina de caracol que nutre intensamente, repara a barreira e melhora elasticidade e marcas. Textura gel-creme que hidrata sem sensação oleosa.',
  descripcion_en = 'Cream with 92% snail mucin that intensely nourishes, repairs the barrier and improves elasticity and marks. Gel-cream texture that hydrates without greasy feeling.',
  key_ingredients_pt = ARRAY['92% mucina de caracol','Hialuronato de sódio','Alantoína calmante'],
  key_ingredients_en = ARRAY['92% snail mucin','Sodium hyaluronate','Soothing allantoin'],
  skin_type_pt = 'Todo tipo de pele, ideal seca ou desidratada',
  skin_type_en = 'All skin types, ideal for dry or dehydrated',
  how_to_use_pt = 'Aplicar como último passo antes do protetor de dia. Massajar até absorver. Manhã e noite.',
  how_to_use_en = 'Apply as the last step before daytime sunscreen. Massage until absorbed. Morning and night.',
  producto_beneficios_pt = '[{"titulo":"Repara intensamente","descripcion":"O 92% de mucina ajuda a regenerar a pele danificada.","orden":1},{"titulo":"Melhora a elasticidade","descripcion":"Proporciona firmeza e suaviza marcas e linhas finas.","orden":2},{"titulo":"Hidratação sem oleosidade","descripcion":"Textura gel-creme que nutre sem sensação pesada.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Intensely repairs","descripcion":"92% mucin helps regenerate damaged skin.","orden":1},{"titulo":"Improves elasticity","descripcion":"Provides firmness and smooths marks and fine lines.","orden":2},{"titulo":"Oil-free hydration","descripcion":"Gel-cream texture that nourishes without heavy feeling.","orden":3}]'::jsonb
WHERE id = 'cosrx-snail-92-cream';

-- 10. COSRX AHA/BHA Clarifying Treatment Toner
UPDATE productos SET
  nombre_pt = 'COSRX AHA/BHA Clarifying Treatment Toner',
  nombre_en = 'COSRX AHA/BHA Clarifying Treatment Toner',
  subtitle_pt = 'Tônico exfoliante suave de uso diário',
  subtitle_en = 'Gentle daily exfoliating toner',
  descripcion_pt = 'Tônico com AHA e BHA em baixa concentração que exfolia suavemente, destapa poros e refina a textura. Ajuda com pontos negros e marcas, deixando a pele mais lisa e luminosa.',
  descripcion_en = 'Toner with low concentration AHA and BHA that gently exfoliates, unclogs pores and refines texture. Helps with blackheads and marks, leaving skin smoother and brighter.',
  key_ingredients_pt = ARRAY['AHA + BHA em dose diária','Água de casca de salgueiro','Água de maçã calmante'],
  key_ingredients_en = ARRAY['Daily dose AHA + BHA','Willow bark water','Soothing apple water'],
  skin_type_pt = 'Pele oleosa ou mista',
  skin_type_en = 'Oily or combination skin',
  how_to_use_pt = 'Após a limpeza, aplicar com mãos ou algodão evitando olhos e lábios. Começar 2 a 3 noites por semana e aumentar conforme tolerância.',
  how_to_use_en = 'After cleansing, apply with hands or cotton avoiding eyes and lips. Start 2 to 3 nights per week and increase according to tolerance.',
  producto_beneficios_pt = '[{"titulo":"Exfoliação diária suave","descripcion":"AHA e BHA em dose baixa renovam sem irritar.","orden":1},{"titulo":"Destapa poros","descripcion":"Ajuda com pontos negros e granitos por acumulação.","orden":2},{"titulo":"Refina a textura","descripcion":"Com o uso contínuo a pele se vê mais lisa e uniforme.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Gentle daily exfoliation","descripcion":"Low dose AHA and BHA renew without irritating.","orden":1},{"titulo":"Unclogs pores","descripcion":"Helps with blackheads and pimples from buildup.","orden":2},{"titulo":"Refines texture","descripcion":"With continuous use skin looks smoother and more even.","orden":3}]'::jsonb
WHERE id = 'cosrx-aha-bha-toner';

-- 11. COSRX Low pH Good Morning Gel Cleanser
UPDATE productos SET
  nombre_pt = 'COSRX Low pH Good Morning Gel Cleanser',
  nombre_en = 'COSRX Low pH Good Morning Gel Cleanser',
  subtitle_pt = 'Gel limpiador pH baixo com Tea Tree',
  subtitle_en = 'Low pH gel cleanser with Tea Tree',
  descripcion_pt = 'Gel de limpeza com pH ligeiramente ácido e óleo de árvore de chá que limpa sem agredir a barreira cutânea. Ideal para a manhã ou como segundo passo em peles sensíveis.',
  descripcion_en = 'Cleansing gel with slightly acidic pH and tea tree oil that cleanses without harming the skin barrier. Ideal for morning or as a second step for sensitive skin.',
  key_ingredients_pt = ARRAY['Fórmula Low pH','Óleo de árvore de chá','Espuma suave tipo gel'],
  key_ingredients_en = ARRAY['Low pH formula','Tea tree oil','Gentle gel foam'],
  skin_type_pt = 'Pele oleosa, mista ou sensível',
  skin_type_en = 'Oily, combination or sensitive skin',
  how_to_use_pt = 'Massajar uma pequena quantidade sobre o rosto úmido e enxaguar com água morna. Manhã e noite como segundo passo de limpeza.',
  how_to_use_en = 'Massage a small amount on damp face and rinse with warm water. Morning and night as second cleansing step.',
  producto_beneficios_pt = '[{"titulo":"Limpeza equilibrada","descripcion":"Seu pH baixo limpa sem alterar a barreira cutânea.","orden":1},{"titulo":"Calma com tea tree","descripcion":"O óleo de árvore de chá refresca peles com tendência acneica.","orden":2},{"titulo":"Ideal todo dia","descripcion":"Espuma suave apta para manhã e noite.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Balanced cleansing","descripcion":"Low pH cleanses without altering skin barrier.","orden":1},{"titulo":"Calms with tea tree","descripcion":"Tea tree oil refreshes acne-prone skin.","orden":2},{"titulo":"Ideal every day","descripcion":"Gentle foam suitable for morning and night.","orden":3}]'::jsonb
WHERE id = 'cosrx-lowph-good-morning-gel';

-- 12. COSRX Salicylic Acid Daily Gentle Cleanser
UPDATE productos SET
  nombre_pt = 'COSRX Salicylic Acid Daily Gentle Cleanser',
  nombre_en = 'COSRX Salicylic Acid Daily Gentle Cleanser',
  subtitle_pt = 'Gel exfoliante diário para poros e acne',
  subtitle_en = 'Daily exfoliating gel for pores and acne',
  descripcion_pt = 'Limpiador em espuma formulado com óleo de árvore de chá e ácido salicílico. Para realizar uma limpeza purificante diária em peles com tendência acneica ou mistas a oleosas.',
  descripcion_en = 'Foaming cleanser formulated with tea tree oil and salicylic acid. For daily purifying cleansing on acne-prone or combination to oily skin.',
  key_ingredients_pt = ARRAY['Ácido salicílico','Óleo de árvore de chá','Espuma suave de uso diário'],
  key_ingredients_en = ARRAY['Salicylic acid','Tea tree oil','Gentle daily foam'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Misturar uma pequena quantidade com água nas palmas das mãos para gerar espuma. Massajar suavemente sobre o rosto prestando especial atenção à zona T. Enxaguar com água morna de maneira abundante.',
  how_to_use_en = 'Mix a small amount with water in palms to create foam. Gently massage on face paying special attention to T-zone. Rinse thoroughly with warm water.',
  producto_beneficios_pt = '[{"titulo":"Limpeza purificante","descripcion":"O ácido salicílico desobstrói poros diariamente.","orden":1},{"titulo":"Aliado contra o acne","descripcion":"Ajuda a reduzir granitos e pontos negros.","orden":2},{"titulo":"Refresca com tea tree","descripcion":"Deixa a pele limpa e mate sem ressecar em excesso.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Purifying cleansing","descripcion":"Salicylic acid unclogs pores daily.","orden":1},{"titulo":"Acne ally","descripcion":"Helps reduce pimples and blackheads.","orden":2},{"titulo":"Refreshes with tea tree","descripcion":"Leaves skin clean and matte without over-drying.","orden":3}]'::jsonb
WHERE id = 'cosrx-salicylic-gentle-cleanser';

-- 13. Illiyoon Ceramide Ato Concentrate Cream
UPDATE productos SET
  nombre_pt = 'Illiyoon Ceramide Ato Concentrate Cream',
  nombre_en = 'Illiyoon Ceramide Ato Concentrate Cream',
  subtitle_pt = 'Creme de ceramidas para barreira sensível',
  subtitle_en = 'Ceramide cream for sensitive barrier',
  descripcion_pt = 'Creme concentrado com ceramidas encapsuladas que reforça a barreira cutânea e alivia sequedad, tirantez e irritação. Favorita coreana para peles sensíveis e sensibilizadas.',
  descripcion_en = 'Concentrated cream with encapsulated ceramides that strengthens the skin barrier and relieves dryness, tightness and irritation. Korean favorite for sensitive and sensitized skin.',
  key_ingredients_pt = ARRAY['Ceramidas encapsuladas','Ácidos graxos essenciais','Fórmula hipoalergênica'],
  key_ingredients_en = ARRAY['Encapsulated ceramides','Essential fatty acids','Hypoallergenic formula'],
  skin_type_pt = 'Pele sensível ou seca',
  skin_type_en = 'Sensitive or dry skin',
  how_to_use_pt = 'Aplicar generosamente sobre rosto e zonas secas como último passo. Manhã e noite, mesmo em lábios e mãos.',
  how_to_use_en = 'Apply generously on face and dry areas as last step. Morning and night, even on lips and hands.',
  producto_beneficios_pt = '[{"titulo":"Reforça a barreira","descripcion":"As ceramidas encapsuladas reparam a proteção natural.","orden":1},{"titulo":"Alivia a sequedad","descripcion":"Calma tirantez, coceira e irritação por sequedad.","orden":2},{"titulo":"Tamanho generoso","descripcion":"Frasco de 200 ml ideal para rosto e corpo.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Strengthens barrier","descripcion":"Encapsulated ceramides repair natural protection.","orden":1},{"titulo":"Relieves dryness","descripcion":"Calms tightness, itching and irritation from dryness.","orden":2},{"titulo":"Generous size","descripcion":"200 ml bottle ideal for face and body.","orden":3}]'::jsonb
WHERE id = 'illiyoon-ceramide-ato-cream';

-- 14. Isntree Hyaluronic Acid Watery Sun Gel
UPDATE productos SET
  nombre_pt = 'Isntree Hyaluronic Acid Watery Sun Gel',
  nombre_en = 'Isntree Hyaluronic Acid Watery Sun Gel',
  subtitle_pt = 'Protetor solar aquoso com Ácido Hialurônico',
  subtitle_en = 'Watery sunscreen with Hyaluronic Acid',
  descripcion_pt = 'Protetor solar em gel aquoso com ácido hialurônico que hidrata enquanto protege. Absorve rápido, não deixa película branca e funciona perfeitamente sob a maquiagem.',
  descripcion_en = 'Watery gel sunscreen with hyaluronic acid that hydrates while protecting. Absorbs quickly, leaves no white cast and works perfectly under makeup.',
  key_ingredients_pt = ARRAY['Filtros SPF50+ PA++++','Ácido hialurônico','Niacinamida'],
  key_ingredients_en = ARRAY['SPF50+ PA++++ filters','Hyaluronic acid','Niacinamide'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Como último passo da manhã, aplicar generosamente em rosto e pescoço. Reaplicar cada 3 horas ante exposição direta ao sol.',
  how_to_use_en = 'As the last morning step, apply generously on face and neck. Reapply every 3 hours under direct sun exposure.',
  producto_beneficios_pt = '[{"titulo":"Proteção + hidratação","descripcion":"Filtros SPF50+ com ácido hialurônico em um só passo.","orden":1},{"titulo":"Textura aquosa","descripcion":"Gel fresco que absorve sem película branca.","orden":2},{"titulo":"Perfeito sob maquiagem","descripcion":"Acabado hidratado que não interfere na base.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Protection + hydration","descripcion":"SPF50+ filters with hyaluronic acid in one step.","orden":1},{"titulo":"Watery texture","descripcion":"Fresh gel that absorbs without white cast.","orden":2},{"titulo":"Perfect under makeup","descripcion":"Hydrating finish that doesn''t interfere with foundation.","orden":3}]'::jsonb
WHERE id = 'isntree-hyaluronic-sun-gel';

-- 15. Laneige Cream Skin Refiner
UPDATE productos SET
  nombre_pt = 'Laneige Cream Skin Refiner',
  nombre_en = 'Laneige Cream Skin Refiner',
  subtitle_pt = 'Tônico-creme 2 em 1 hidratação profunda',
  subtitle_en = '2-in-1 cream toner deep hydration',
  descripcion_pt = 'Refiner que combina tônico e creme em um só passo. Hidrata em profundidade, suaviza e deixa a pele flexível. Ideal para simplificar a rotina sem perder hidratação.',
  descripcion_en = 'Refiner that combines toner and cream in one step. Deeply hydrates, smooths and leaves skin flexible. Ideal to simplify routine without losing hydration.',
  key_ingredients_pt = ARRAY['White Leaf Tea Water','Aminoácidos hidratantes','Textura leite de rápida absorção'],
  key_ingredients_en = ARRAY['White Leaf Tea Water','Hydrating amino acids','Fast-absorbing milk texture'],
  skin_type_pt = 'Pele normal a seca',
  skin_type_en = 'Normal to dry skin',
  how_to_use_pt = 'Após a limpeza, aplicar uma quantidade moderada com as mãos dando toques até absorver. Manhã e noite, antes do sérum.',
  how_to_use_en = 'After cleansing, apply a moderate amount with hands patting until absorbed. Morning and night, before serum.',
  producto_beneficios_pt = '[{"titulo":"2 em 1","descripcion":"Tônico e creme em um só passo para rotinas simples.","orden":1},{"titulo":"Hidratação profunda","descripcion":"Recarrega a umidade e suaviza a pele áspera.","orden":2},{"titulo":"Pele flexível","descripcion":"Deixa o rosto elástico e confortável todo o dia.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"2-in-1","descripcion":"Toner and cream in one step for simple routines.","orden":1},{"titulo":"Deep hydration","descripcion":"Recharges moisture and smooths rough skin.","orden":2},{"titulo":"Flexible skin","descripcion":"Leaves face elastic and comfortable all day.","orden":3}]'::jsonb
WHERE id = 'laneige-cream-skin-refiner';

-- 16. Laneige Water Bank Blue Hyaluronic Cream
UPDATE productos SET
  nombre_pt = 'Laneige Water Bank Blue Hyaluronic Cream',
  nombre_en = 'Laneige Water Bank Blue Hyaluronic Cream',
  subtitle_pt = 'Creme hidratação intensa Ácido Hialurônico Azul',
  subtitle_en = 'Blue Hyaluronic intense hydration cream',
  descripcion_pt = 'Creme com ácido hialurônico azul de alta absorção que recarrega a hidratação e reforça a barreira. Pele flexível e luminosa por horas, sem sensação pesada.',
  descripcion_en = 'Cream with high-absorption blue hyaluronic acid that recharges hydration and strengthens the barrier. Flexible and radiant skin for hours, without heavy feeling.',
  key_ingredients_pt = ARRAY['Ácido hialurônico azul','Ceramidas de reforço','Textura creme-gel refrescante'],
  key_ingredients_en = ARRAY['Blue hyaluronic acid','Strengthening ceramides','Refreshing gel-cream texture'],
  skin_type_pt = 'Todo tipo de pele, ideal desidratada',
  skin_type_en = 'All skin types, ideal for dehydrated',
  how_to_use_pt = 'Aplicar como hidratante depois do sérum, manhã e noite. Em peles muito secas pode-se aplicar uma segunda camada.',
  how_to_use_en = 'Apply as moisturizer after serum, morning and night. On very dry skin, a second layer can be applied.',
  producto_beneficios_pt = '[{"titulo":"Hidratação intensa","descripcion":"O ácido hialurônico azul retém água por horas.","orden":1},{"titulo":"Reforça a barreira","descripcion":"As ceramidas protegem contra a perda de umidade.","orden":2},{"titulo":"Acabado fresco","descripcion":"Creme-gel leve que não deixa sensação pesada.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Intense hydration","descripcion":"Blue hyaluronic acid retains water for hours.","orden":1},{"titulo":"Strengthens barrier","descripcion":"Ceramides protect against moisture loss.","orden":2},{"titulo":"Fresh finish","descripcion":"Light gel-cream that doesn''t leave heavy feeling.","orden":3}]'::jsonb
WHERE id = 'laneige-water-bank-cream';

-- 17. Medicube Triple Collagen Serum
UPDATE productos SET
  nombre_pt = 'Medicube Triple Collagen Serum',
  nombre_en = 'Medicube Triple Collagen Serum',
  subtitle_pt = 'Sérum de firmeza com triplo colágeno',
  subtitle_en = 'Firming serum with triple collagen',
  descripcion_pt = 'Sérum avançado formulado com um complexo de triplo colágeno para máxima elasticidade. Para proporcionar uma dose intensa de colágeno e lograr uma pele mais lisa, jovem e luminosa.',
  descripcion_en = 'Advanced serum formulated with a triple collagen complex for maximum elasticity. To provide an intense collagen dose and achieve smoother, younger and more radiant skin.',
  key_ingredients_pt = ARRAY['Complexo triplo colágeno','Colágeno hidrolisado','Efeito elasticidade e firmeza'],
  key_ingredients_en = ARRAY['Triple collagen complex','Hydrolyzed collagen','Elasticity and firming effect'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Aplicar de 2 a 3 gotas de produto sobre o rosto limpo após usar o tônico ou os discos. Distribuir suavemente mediante massagens ascendentes até que se absorva completamente. Continuar com o creme hidratante para selar os nutrientes.',
  how_to_use_en = 'Apply 2 to 3 drops of product on clean face after using toner or pads. Distribute gently with upward massages until fully absorbed. Continue with moisturizer to seal nutrients.',
  producto_beneficios_pt = '[{"titulo":"Triplo colágeno","descripcion":"Proporciona firmeza e elasticidade à pele.","orden":1},{"titulo":"Efeito liso","descripcion":"Melhora a textura e suaviza linhas por desidratação.","orden":2},{"titulo":"Sem pegajosidade","descripcion":"Textura sérum que derrete e absorve rápido.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Triple collagen","descripcion":"Provides firmness and elasticity to skin.","orden":1},{"titulo":"Smooth effect","descripcion":"Improves texture and smooths dehydration lines.","orden":2},{"titulo":"Non-sticky","descripcion":"Serum texture that melts and absorbs quickly.","orden":3}]'::jsonb
WHERE id = 'medicube-triple-collagen-serum';

-- 18. Medicube Zero Pore Pad 2.0
UPDATE productos SET
  nombre_pt = 'Medicube Zero Pore Pad 2.0',
  nombre_en = 'Medicube Zero Pore Pad 2.0',
  subtitle_pt = 'Discos exfoliantes e tonificantes 2 em 1',
  subtitle_en = '2-in-1 exfoliating and toning pads',
  descripcion_pt = 'Discos exfoliantes de dupla face impregnados com extratos botânicos e AHA/BHA naturais. Para tonificar e exfoliar suavemente a pele em um só passo diário melhorando a textura dos poros.',
  descripcion_en = 'Dual-sided exfoliating pads infused with botanical extracts and natural AHA/BHA. To tone and gently exfoliate skin in one daily step improving pore texture.',
  key_ingredients_pt = ARRAY['AHA + BHA naturais','Extratos botânicos calmantes','Dupla face: relevo + lisa'],
  key_ingredients_en = ARRAY['Natural AHA + BHA','Soothing botanical extracts','Dual-sided: textured + smooth'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Usar o lado em relevo do disco para limpar suavemente o rosto recém-lavado evitando o contorno dos olhos. Virar o disco e utilizar o lado suave para retirar os restos de impurezas e alisar a pele. Não necessita enxágue; continuar com o sérum ou creme habitual.',
  how_to_use_en = 'Use the textured side of the pad to gently clean freshly washed face avoiding eye contour. Flip the pad and use the smooth side to remove impurities and smooth skin. No rinse needed; continue with usual serum or cream.',
  producto_beneficios_pt = '[{"titulo":"Exfolia e tonifica","descripcion":"AHA e BHA suaves em um só passo diário.","orden":1},{"titulo":"Refina poros","descripcion":"Com o uso constante os poros se veem mais fechados.","orden":2},{"titulo":"Dupla face","descripcion":"Lado relevo para limpar e lado liso para tonificar.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Exfoliates and tones","descripcion":"Gentle AHA and BHA in one daily step.","orden":1},{"titulo":"Refines pores","descripcion":"With constant use pores look more closed.","orden":2},{"titulo":"Dual-sided","descripcion":"Textured side to cleanse and smooth side to tone.","orden":3}]'::jsonb
WHERE id = 'medicube-zero-pore-pad';

-- 19. Skin1004 Madagascar Centella Ampoule
UPDATE productos SET
  nombre_pt = 'Skin1004 Madagascar Centella Ampoule',
  nombre_en = 'Skin1004 Madagascar Centella Ampoule',
  subtitle_pt = 'Calmante intensivo & reparação de barreira',
  subtitle_en = 'Intensive soothing & barrier repair',
  descripcion_pt = '100% extrato puro de Centella Asiática colhida em Madagascar. Calma instantaneamente vermelhidão, alivia a pele sensibilizada e restaura o equilíbrio hídrico sem sensação pesada nem pegajosa.',
  descripcion_en = '100% pure Centella Asiatica extract harvested in Madagascar. Instantly calms redness, relieves sensitized skin and restores moisture balance without heavy or sticky feeling.',
  key_ingredients_pt = ARRAY['100% Extrato de Centella Asiática de Madagascar','Madecassoside natural'],
  key_ingredients_en = ARRAY['100% Madagascar Centella Asiatica Extract','Natural madecassoside'],
  skin_type_pt = 'Todo tipo de pele, especialmente pele sensível ou irritada',
  skin_type_en = 'All skin types, especially sensitive or irritated skin',
  how_to_use_pt = 'Aplicar 2 a 3 gotas sobre rosto e pescoço limpos após o tônico. Dar suaves toques com as pontas dos dedos.',
  how_to_use_en = 'Apply 2 to 3 drops on clean face and neck after toner. Give gentle pats with fingertips.',
  producto_beneficios_pt = '[{"titulo":"Calma a irritação","descripcion":"Alivia imediatamente vermelhidão, sensibilidade ou inflamação na pele.","orden":1},{"titulo":"Repara a barreira cutânea","descripcion":"Restaura e fortalece a camada protetora para evitar o dano ambiental.","orden":2},{"titulo":"Hidratação leve","descripcion":"Proporciona umidade pura sem deixar sensação pesada nem obstruir os poros.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Calms irritation","descripcion":"Immediately relieves redness, sensitivity or inflammation on skin.","orden":1},{"titulo":"Repairs skin barrier","descripcion":"Restores and strengthens protective layer to prevent environmental damage.","orden":2},{"titulo":"Light hydration","descripcion":"Provides pure moisture without leaving heavy feeling or clogging pores.","orden":3}]'::jsonb
WHERE id = 'madagascar-centella-ampoule';

-- 20. Skin1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum
UPDATE productos SET
  nombre_pt = 'Skin1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum',
  nombre_en = 'Skin1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum',
  subtitle_pt = 'FPS 50+ PA++++ hidratação leve com acabado glow',
  subtitle_en = 'SPF 50+ PA++++ lightweight hydration with glow finish',
  descripcion_pt = 'Protetor solar químico com textura ultra aquosa que se absorve como um sérum hidratante. Combina extrato de Centella com Ácido Hialurônico sem deixar rastro branco nem sensação oleosa.',
  descripcion_en = 'Chemical sunscreen with ultra watery texture that absorbs like a hydrating serum. Combines Centella extract with Hyaluronic Acid without leaving white cast or oily feeling.',
  key_ingredients_pt = ARRAY['Fórmula Hyalu-Cica','Extrato de Centella Asiática','Brotes verdes antioxidantes'],
  key_ingredients_en = ARRAY['Hyalu-Cica formula','Centella Asiatica extract','Antioxidant green sprouts'],
  skin_type_pt = 'Todo tipo de pele, perfeito sob a maquiagem',
  skin_type_en = 'All skin types, perfect under makeup',
  how_to_use_pt = 'Como último passo da rotina matutina, aplicar uniformemente nas zonas expostas ao sol.',
  how_to_use_en = 'As the last step of morning routine, apply evenly on sun-exposed areas.',
  producto_beneficios_pt = '[{"titulo":"Proteção UV leve","descripcion":"Protege do sol com uma textura aquosa que se absorve sem deixar rastro branco.","orden":1},{"titulo":"Hidratação e calma","descripcion":"Combina ácido hialurônico e centella para refrescar a pele aquecida.","orden":2},{"titulo":"Acabado jugoso","descripcion":"Deixa um aspecto saudável e fresco sem sensação oleosa.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Light UV protection","descripcion":"Protects from sun with watery texture that absorbs without leaving white cast.","orden":1},{"titulo":"Hydration and calm","descripcion":"Combines hyaluronic acid and centella to refresh heated skin.","orden":2},{"titulo":"Juicy finish","descripcion":"Leaves a healthy and fresh look without oily feeling.","orden":3}]'::jsonb
WHERE id = 'centella-hyalu-cica-sun-serum';

-- 21. Skin1004 Madagascar Centella Light Cleansing Oil
UPDATE productos SET
  nombre_pt = 'Skin1004 Madagascar Centella Light Cleansing Oil',
  nombre_en = 'Skin1004 Madagascar Centella Light Cleansing Oil',
  subtitle_pt = 'Óleo limpiador leve com Centella',
  subtitle_en = 'Light cleansing oil with Centella',
  descripcion_pt = 'Óleo de limpeza leve com centella de Madagascar que retira maquiagem e protetor solar com suavidade. Emulsifica perfeitamente e não arde nos olhos.',
  descripcion_en = 'Light cleansing oil with Madagascar centella that removes makeup and sunscreen gently. Emulsifies perfectly and doesn''t sting eyes.',
  key_ingredients_pt = ARRAY['Extrato de centella asiática','Óleos vegetais leves','Apto olhos sensíveis'],
  key_ingredients_en = ARRAY['Centella asiatica extract','Light vegetable oils','Suitable for sensitive eyes'],
  skin_type_pt = 'Todo tipo de pele, mesmo sensível',
  skin_type_en = 'All skin types, even sensitive',
  how_to_use_pt = 'Com o rosto seco massajar 1 minuto, emulsificar com água morna e enxaguar. Seguir com limpiador aquoso. Noite.',
  how_to_use_en = 'On dry face massage for 1 minute, emulsify with warm water and rinse. Follow with water-based cleanser. Night.',
  producto_beneficios_pt = '[{"titulo":"Limpeza suave","descripcion":"Retira maquiagem e protetor sem esfregar nem arder os olhos.","orden":1},{"titulo":"Calma com centella","descripcion":"O extrato de Madagascar conforta enquanto limpa.","orden":2},{"titulo":"Enxágue perfeito","descripcion":"Emulsifica e retira sem deixar película oleosa.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Gentle cleansing","descripcion":"Removes makeup and sunscreen without rubbing or stinging eyes.","orden":1},{"titulo":"Calms with centella","descripcion":"Madagascar extract comforts while cleansing.","orden":2},{"titulo":"Perfect rinse","descripcion":"Emulsifies and removes without leaving oily film.","orden":3}]'::jsonb
WHERE id = 'skin1004-light-cleansing-oil';

-- 22. Skin1004 Madagascar Centella Poremizing Fresh Ampoule
UPDATE productos SET
  nombre_pt = 'Skin1004 Madagascar Centella Poremizing Fresh Ampoule',
  nombre_en = 'Skin1004 Madagascar Centella Poremizing Fresh Ampoule',
  subtitle_pt = '',
  subtitle_en = '',
  descripcion_pt = 'Ampola purificadora formulada com extrato de centella asiática e peptídeos para o cuidado dos poros. Para tratar os poros dilatados e melhorar a firmeza e textura geral do rosto.',
  descripcion_en = 'Purifying ampoule formulated with centella asiatica extract and peptides for pore care. To treat enlarged pores and improve firmness and overall face texture.',
  key_ingredients_pt = ARRAY['Extrato de Centella Asiática 50%','Sal Rosa do Himalaia puro','Complexo de 9 Peptídeos'],
  key_ingredients_en = ARRAY['50% Centella Asiatica Extract','Pure Himalayan Pink Salt','9 Peptide Complex'],
  skin_type_pt = 'Todo tipo de pele',
  skin_type_en = 'All skin types',
  how_to_use_pt = 'Tomar umas gotas com o aplicador sobre o rosto limpo e tonificado. Distribuir suavemente pelas zonas com maior concentração de poros abertos. Dar leves tapinhas para assegurar sua completa absorção.',
  how_to_use_en = 'Take a few drops with the applicator on clean and toned face. Distribute gently on areas with higher concentration of open pores. Give light pats to ensure complete absorption.',
  producto_beneficios_pt = '[{"titulo":"Fecha poros dilatados","descripcion":"Utiliza sal rosa do Himalaia para limpar e reduzir o tamanho visível dos poros.","orden":1},{"titulo":"Melhora a elasticidade","descripcion":"Reforça a firmeza da pele ao redor das zonas com poros caídos ou marcados.","orden":2},{"titulo":"Equilibra a oleosidade","descripcion":"Controla o excesso de sebo mantendo um nível ótimo de hidratação.","orden":3}]'::jsonb,
  producto_beneficios_en = '[{"titulo":"Tightens enlarged pores","descripcion":"Uses Himalayan pink salt to clean and reduce visible pore size.","orden":1},{"titulo":"Improves elasticity","descripcion":"Reinforces skin firmness around areas with sagging or marked pores.","orden":2},{"titulo":"Balances oiliness","descripcion":"Controls excess sebum while maintaining optimal hydration level.","orden":3}]'::jsonb
WHERE id = 'centella-poremizing-ampoule';

-- Verificación
SELECT id, nombre_pt, nombre_en FROM productos WHERE activo = true ORDER BY nombre;
