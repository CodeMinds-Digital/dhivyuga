-- Demo Multi-Language Mantra Data
-- This script creates comprehensive demo data with mantras in multiple languages
-- Run this AFTER the basic migration script

-- First, let's add more languages to our existing set
INSERT INTO languages (code, name, native_name, direction, sort_order) VALUES
('te', 'Telugu', 'తెలుగు', 'ltr', 5),
('kn', 'Kannada', 'ಕನ್ನಡ', 'ltr', 6),
('ml', 'Malayalam', 'മലയാളം', 'ltr', 7),
('gu', 'Gujarati', 'ગુજરાતી', 'ltr', 8),
('bn', 'Bengali', 'বাংলা', 'ltr', 9),
('or', 'Odia', 'ଓଡ଼ିଆ', 'ltr', 10)
ON CONFLICT (code) DO NOTHING;

-- Create a demo mantra: Om Gam Ganapataye Namaha
-- First, let's create the basic mantra entry
INSERT INTO mantras (id, title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT 
    'demo-ganesha-001'::uuid,
    'Om Gam Ganapataye Namaha',
    'ॐ गं गणपतये नमः',
    c.id,
    d.id,
    rc.id,
    rt.id,
    150
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name ILIKE '%obstacle%' 
AND d.name = 'Ganesha'
AND rc.count_value = 108
AND rt.name ILIKE '%morning%'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Now add translations for this mantra in all languages
DO $$
DECLARE
    mantra_uuid UUID := 'demo-ganesha-001'::uuid;
    lang_en UUID;
    lang_sa UUID;
    lang_ta UUID;
    lang_hi UUID;
    lang_te UUID;
    lang_kn UUID;
    lang_ml UUID;
    lang_gu UUID;
    lang_bn UUID;
    lang_or UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO lang_en FROM languages WHERE code = 'en';
    SELECT id INTO lang_sa FROM languages WHERE code = 'sa';
    SELECT id INTO lang_ta FROM languages WHERE code = 'ta';
    SELECT id INTO lang_hi FROM languages WHERE code = 'hi';
    SELECT id INTO lang_te FROM languages WHERE code = 'te';
    SELECT id INTO lang_kn FROM languages WHERE code = 'kn';
    SELECT id INTO lang_ml FROM languages WHERE code = 'ml';
    SELECT id INTO lang_gu FROM languages WHERE code = 'gu';
    SELECT id INTO lang_bn FROM languages WHERE code = 'bn';
    SELECT id INTO lang_or FROM languages WHERE code = 'or';

    -- English Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_en,
        '<p><strong>Om Gam Ganapataye Namaha</strong></p><p>ॐ गं गणपतये नमः</p>',
        'Om Gam Ganapataye Namaha',
        'Om (AUM) - Gam (GAHM) - Ga-na-pa-ta-ye (Gah-nah-pah-tah-yeh) - Na-ma-ha (Nah-mah-hah)',
        '<p>Salutations to Lord Ganesha, the remover of obstacles and patron of arts and sciences. This powerful mantra invokes the blessings of Ganesha for success in new endeavors and removal of barriers in life.</p><p><strong>Gam</strong> is the seed syllable (bija mantra) of Lord Ganesha, containing his divine energy and power.</p>',
        ARRAY['Removes obstacles in life', 'Brings success in new ventures', 'Enhances wisdom and intelligence', 'Provides divine protection', 'Improves concentration and focus', 'Grants good fortune in business'],
        '<p><strong>Best Time:</strong> Early morning before starting any new work</p><p><strong>Repetitions:</strong> 108 times using a rudraksha mala</p><p><strong>Posture:</strong> Sit facing east in a clean, peaceful environment</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Sanskrit Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_sa,
        '<p><strong>ॐ गं गणपतये नमः</strong></p><p>गणानां पतिं गणेशं प्रणमामि</p>',
        'Om Gaṃ Gaṇapataye Namaḥ',
        'ॐ (प्रणव) - गं (गकार बीज) - गणपतये (गणपतिदेवाय) - नमः (प्रणाम)',
        '<p>गणपति देवस्य मूल मन्त्रम्। विघ्नहर्ता गणेशस्य आशीर्वादार्थं जपनीयम्।</p><p><strong>गं</strong> इति गणेशस्य बीजमन्त्रम्, सर्वविघ्ननाशकम्।</p>',
        ARRAY['विघ्ननाश', 'नवकार्यसिद्धि', 'बुद्धिवर्धन', 'दिव्यरक्षा', 'एकाग्रता', 'व्यापारवृद्धि'],
        '<p><strong>उत्तमकाल:</strong> प्रातःकाले नवकार्यारम्भे</p><p><strong>जपसंख्या:</strong> रुद्राक्षमाला द्वारा १०८ वारम्</p><p><strong>आसन:</strong> पूर्वमुखी होकर शुद्धस्थाने</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Tamil Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_ta,
        '<p><strong>ஓம் கம் கணபதயே நமஹ</strong></p><p>விநாயகப் பெருமானுக்கு வணக்கம்</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ஓம் (பிரணவம்) - கம் (கணேச பீஜம்) - கணபதயே (கணபதி தேவனுக்கு) - நமஹ (வணக்கம்)',
        '<p>விக்னேஸ்வரன் விநாயகனின் மூல மந்திரம். தடைகளை நீக்கி, புதிய காரியங்களில் வெற்றி தரும்.</p><p><strong>கம்</strong> என்பது கணேசனின் பீஜ மந்திரம், அனைத்து தடைகளையும் நீக்கும்.</p>',
        ARRAY['தடைகள் நீங்கும்', 'புதிய காரியங்களில் வெற்றி', 'புத்தி வளர்ச்சி', 'தெய்வீக பாதுகாப்பு', 'கவனம் அதிகரிக்கும்', 'வியாபார வளர்ச்சி'],
        '<p><strong>சிறந்த நேரம்:</strong> காலையில் புதிய வேலை தொடங்கும் முன்</p><p><strong>எண்ணிக்கை:</strong> ருத்ராட்ச மாலையில் 108 முறை</p><p><strong>திசை:</strong> கிழக்கு நோக்கி தூய்மையான இடத்தில்</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Hindi Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_hi,
        '<p><strong>ॐ गं गणपतये नमः</strong></p><p>गणेश भगवान को प्रणाम</p>',
        'Om Gam Ganapataye Namah',
        'ॐ (ओम्) - गं (गम्) - गणपतये (गणपति जी को) - नमः (प्रणाम)',
        '<p>भगवान गणेश का मूल मंत्र। विघ्न हरने वाले गणपति बप्पा की कृपा पाने के लिए इस मंत्र का जाप करते हैं।</p><p><strong>गं</strong> गणेश जी का बीज मंत्र है जो सभी बाधाओं को दूर करता है।</p>',
        ARRAY['बाधाओं का नाश', 'नए काम में सफलता', 'बुद्धि का विकास', 'दैवीय सुरक्षा', 'एकाग्रता में वृद्धि', 'व्यापार में उन्नति'],
        '<p><strong>उत्तम समय:</strong> सुबह नया काम शुरू करने से पहले</p><p><strong>जाप संख्या:</strong> रुद्राक्ष की माला से 108 बार</p><p><strong>दिशा:</strong> पूर्व दिशा की ओर मुंह करके स्वच्छ स्थान पर</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Telugu Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_te,
        '<p><strong>ఓం గం గణపతయే నమః</strong></p><p>వినాయక దేవునికి నమస్కారం</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ఓం (ప్రణవం) - గం (గణేశ బీజం) - గణపతయే (గణపతి దేవునికి) - నమః (నమస్కారం)',
        '<p>విఘ్నేశ్వర వినాయకుని మూల మంత్రం. అడ్డంకులను తొలగించి, కొత్త పనులలో విజయం ఇస్తుంది.</p><p><strong>గం</strong> అనేది గణేశుని బీజ మంత్రం, అన్ని అడ్డంకులను తొలగిస్తుంది.</p>',
        ARRAY['అడ్డంకుల నివారణ', 'కొత్త పనులలో విజయం', 'బుద్ధి వృద్ధి', 'దైవిక రక్షణ', 'దృష్టి పెరుగుట', 'వ్యాపార అభివృద్ధి'],
        '<p><strong>ఉత్తమ సమయం:</strong> ఉదయం కొత్త పని మొదలుపెట్టే ముందు</p><p><strong>జప సంఖ్య:</strong> రుద్రాక్ష మాలతో 108 సార్లు</p><p><strong>దిశ:</strong> తూర్పు వైపు చూచి పవిత్రమైన చోట</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Kannada Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_kn,
        '<p><strong>ಓಂ ಗಂ ಗಣಪತಯೇ ನಮಃ</strong></p><p>ವಿನಾಯಕ ದೇವರಿಗೆ ನಮಸ್ಕಾರ</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ಓಂ (ಪ್ರಣವ) - ಗಂ (ಗಣೇಶ ಬೀಜ) - ಗಣಪತಯೇ (ಗಣಪತಿ ದೇವರಿಗೆ) - ನಮಃ (ನಮಸ್ಕಾರ)',
        '<p>ವಿಘ್ನೇಶ್ವರ ವಿನಾಯಕನ ಮೂಲ ಮಂತ್ರ. ಅಡ್ಡಿಗಳನ್ನು ತೊಲಗಿಸಿ, ಹೊಸ ಕೆಲಸಗಳಲ್ಲಿ ಯಶಸ್ಸು ನೀಡುತ್ತದೆ.</p><p><strong>ಗಂ</strong> ಎಂಬುದು ಗಣೇಶನ ಬೀಜ ಮಂತ್ರ, ಎಲ್ಲಾ ಅಡ್ಡಿಗಳನ್ನು ತೊಲಗಿಸುತ್ತದೆ.</p>',
        ARRAY['ಅಡ್ಡಿಗಳ ನಿವಾರಣೆ', 'ಹೊಸ ಕೆಲಸಗಳಲ್ಲಿ ಯಶಸ್ಸು', 'ಬುದ್ಧಿ ವೃದ್ಧಿ', 'ದೈವಿಕ ರಕ್ಷಣೆ', 'ಏಕಾಗ್ರತೆ ಹೆಚ್ಚಳ', 'ವ್ಯಾಪಾರ ಅಭಿವೃದ್ಧಿ'],
        '<p><strong>ಉತ್ತಮ ಸಮಯ:</strong> ಬೆಳಿಗ್ಗೆ ಹೊಸ ಕೆಲಸ ಪ್ರಾರಂಭಿಸುವ ಮುಂಚೆ</p><p><strong>ಜಪ ಸಂಖ್ಯೆ:</strong> ರುದ್ರಾಕ್ಷ ಮಾಲೆಯಿಂದ 108 ಬಾರಿ</p><p><strong>ದಿಕ್ಕು:</strong> ಪೂರ್ವ ದಿಕ್ಕಿನ ಕಡೆಗೆ ಮುಖ ಮಾಡಿ ಪವಿತ್ರ ಸ್ಥಳದಲ್ಲಿ</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Malayalam Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_ml,
        '<p><strong>ഓം ഗം ഗണപതയേ നമഃ</strong></p><p>വിനായക ദേവന് നമസ്കാരം</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ഓം (പ്രണവം) - ഗം (ഗണേശ ബീജം) - ഗണപതയേ (ഗണപതി ദേവന്) - നമഃ (നമസ്കാരം)',
        '<p>വിഘ്നേശ്വരൻ വിനായകന്റെ മൂല മന്ത്രം. തടസ്സങ്ങൾ നീക്കി, പുതിയ കാര്യങ്ങളിൽ വിജയം നൽകുന്നു.</p><p><strong>ഗം</strong> എന്നത് ഗണേശന്റെ ബീജ മന്ത്രം, എല്ലാ തടസ്സങ്ങളും നീക്കുന്നു.</p>',
        ARRAY['തടസ്സങ്ങളുടെ നിവാരണം', 'പുതിയ കാര്യങ്ങളിൽ വിജയം', 'ബുദ്ധി വൃദ്ധി', 'ദൈവിക സംരക്ഷണം', 'ഏകാഗ്രത വർദ്ധനവ്', 'വ്യാപാര അഭിവൃദ്ധി'],
        '<p><strong>ഉത്തമ സമയം:</strong> രാവിലെ പുതിയ ജോലി തുടങ്ങുന്നതിന് മുമ്പ്</p><p><strong>ജപ സംഖ്യ:</strong> രുദ്രാക്ഷ മാലയിൽ 108 തവണ</p><p><strong>ദിശ:</strong> കിഴക്ക് ദിശയിലേക്ക് മുഖം തിരിച്ച് വിശുദ്ധമായ സ്ഥലത്ത്</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Gujarati Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_gu,
        '<p><strong>ૐ ગં ગણપતયે નમઃ</strong></p><p>વિનાયક ભગવાનને નમસ્કાર</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ૐ (પ્રણવ) - ગં (ગણેશ બીજ) - ગણપતયે (ગણપતિ ભગવાનને) - નમઃ (નમસ્કાર)',
        '<p>વિઘ્નહર્તા વિનાયકનું મૂળ મંત્ર. અડચણો દૂર કરીને, નવા કામોમાં સફળતા આપે છે.</p><p><strong>ગં</strong> એ ગણેશનું બીજ મંત્ર છે, જે બધી અડચણો દૂર કરે છે.</p>',
        ARRAY['અડચણોનું નિવારણ', 'નવા કામોમાં સફળતા', 'બુદ્ધિ વૃદ્ધિ', 'દૈવી સુરક્ષા', 'એકાગ્રતા વધારો', 'વ્યાપાર વૃદ્ધિ'],
        '<p><strong>ઉત્તમ સમય:</strong> સવારે નવું કામ શરૂ કરતા પહેલા</p><p><strong>જપ સંખ્યા:</strong> રુદ્રાક્ષ માળાથી 108 વાર</p><p><strong>દિશા:</strong> પૂર્વ દિશા તરફ મુખ કરીને પવિત્ર સ્થળે</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Bengali Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_bn,
        '<p><strong>ওম গং গণপতয়ে নমঃ</strong></p><p>বিনায়ক দেবের প্রণাম</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ওম (প্রণব) - গং (গণেশ বীজ) - গণপতয়ে (গণপতি দেবের) - নমঃ (প্রণাম)',
        '<p>বিঘ্নহর্তা বিনায়কের মূল মন্ত্র। বাধা দূর করে, নতুন কাজে সফলতা দেয়।</p><p><strong>গং</strong> হল গণেশের বীজ মন্ত্র, যা সব বাধা দূর করে।</p>',
        ARRAY['বাধা নিবারণ', 'নতুন কাজে সফলতা', 'বুদ্ধি বৃদ্ধি', 'দৈবিক সুরক্ষা', 'একাগ্রতা বৃদ্ধি', 'ব্যবসায়িক উন্নতি'],
        '<p><strong>উত্তম সময়:</strong> সকালে নতুন কাজ শুরুর আগে</p><p><strong>জপ সংখ্যা:</strong> রুদ্রাক্ষ মালায় ১০৮ বার</p><p><strong>দিক:</strong> পূর্ব দিকে মুখ করে পবিত্র স্থানে</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Odia Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        mantra_uuid,
        lang_or,
        '<p><strong>ଓଁ ଗଂ ଗଣପତଯେ ନମଃ</strong></p><p>ବିନାୟକ ଦେବଙ୍କୁ ପ୍ରଣାମ</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ଓଁ (ପ୍ରଣବ) - ଗଂ (ଗଣେଶ ବୀଜ) - ଗଣପତଯେ (ଗଣପତି ଦେବଙ୍କୁ) - ନମଃ (ପ୍ରଣାମ)',
        '<p>ବିଘ୍ନହର୍ତା ବିନାୟକଙ୍କ ମୂଳ ମନ୍ତ୍ର। ବାଧା ଦୂର କରି, ନୂତନ କାର୍ଯ୍ୟରେ ସଫଳତା ଦିଏ।</p><p><strong>ଗଂ</strong> ହେଉଛି ଗଣେଶଙ୍କ ବୀଜ ମନ୍ତ୍ର, ଯାହା ସବୁ ବାଧା ଦୂର କରେ।</p>',
        ARRAY['ବାଧା ନିବାରଣ', 'ନୂତନ କାର୍ଯ୍ୟରେ ସଫଳତା', 'ବୁଦ୍ଧି ବୃଦ୍ଧି', 'ଦୈବିକ ସୁରକ୍ଷା', 'ଏକାଗ୍ରତା ବୃଦ୍ଧି', 'ବ୍ୟବସାୟିକ ଉନ୍ନତି'],
        '<p><strong>ଉତ୍ତମ ସମୟ:</strong> ସକାଳେ ନୂତନ କାମ ଆରମ୍ଭ କରିବା ପୂର୍ବରୁ</p><p><strong>ଜପ ସଂଖ୍ୟା:</strong> ରୁଦ୍ରାକ୍ଷ ମାଳାରେ ୧୦୮ ଥର</p><p><strong>ଦିଗ:</strong> ପୂର୍ବ ଦିଗ ଆଡ଼କୁ ମୁହଁ କରି ପବିତ୍ର ସ୍ଥାନରେ</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

END $$;

-- Create second demo mantra: Om Shreem Mahalakshmiyei Namaha
INSERT INTO mantras (id, title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'demo-lakshmi-001'::uuid,
    'Om Shreem Mahalakshmiyei Namaha',
    'ॐ श्रीं महालक्ष्म्यै नमः',
    c.id,
    d.id,
    rc.id,
    rt.id,
    200
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name ILIKE '%wealth%'
AND d.name = 'Lakshmi'
AND rc.count_value = 108
AND rt.name ILIKE '%evening%'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Add key translations for Lakshmi mantra (English, Sanskrit, Tamil, Hindi)
DO $$
DECLARE
    lakshmi_uuid UUID := 'demo-lakshmi-001'::uuid;
    lang_en UUID;
    lang_sa UUID;
    lang_ta UUID;
    lang_hi UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO lang_en FROM languages WHERE code = 'en';
    SELECT id INTO lang_sa FROM languages WHERE code = 'sa';
    SELECT id INTO lang_ta FROM languages WHERE code = 'ta';
    SELECT id INTO lang_hi FROM languages WHERE code = 'hi';

    -- English Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid,
        lang_en,
        '<p><strong>Om Shreem Mahalakshmiyei Namaha</strong></p><p>ॐ श्रीं महालक्ष्म्यै नमः</p>',
        'Om Shreem Mahalakshmiyei Namaha',
        'Om (AUM) - Shreem (SHREEM) - Ma-ha-lak-shmi-yei (Mah-hah-lahk-shmee-yay) - Na-ma-ha (Nah-mah-hah)',
        '<p>Salutations to Goddess Mahalakshmi, the divine mother of wealth, prosperity, and abundance. This sacred mantra invokes the blessings of Lakshmi for material and spiritual prosperity.</p><p><strong>Shreem</strong> is the powerful seed syllable (bija mantra) of Goddess Lakshmi, containing her divine energy for abundance.</p>',
        ARRAY['Attracts wealth and prosperity', 'Brings financial stability', 'Enhances business success', 'Grants material abundance', 'Improves family harmony', 'Bestows spiritual wealth'],
        '<p><strong>Best Time:</strong> Friday evenings, especially during Lakshmi Puja</p><p><strong>Repetitions:</strong> 108 times with a lotus seed mala</p><p><strong>Direction:</strong> Face north or east, light a ghee lamp</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Sanskrit Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid,
        lang_sa,
        '<p><strong>ॐ श्रीं महालक्ष्म्यै नमः</strong></p><p>धनधान्यादि समृद्ध्यै लक्ष्मीदेव्यै प्रणामः</p>',
        'Om Śrīṃ Mahālakṣmyai Namaḥ',
        'ॐ (प्रणव) - श्रीं (लक्ष्मी बीज) - महालक्ष्म्यै (महालक्ष्मी देव्यै) - नमः (प्रणाम)',
        '<p>श्रीलक्ष्मी देव्याः मूलमन्त्रम्। धनैश्वर्यप्राप्त्यर्थं सर्वसमृद्धिदायिनी महालक्ष्म्याः आराधना।</p><p><strong>श्रीं</strong> इति लक्ष्मीदेव्याः बीजमन्त्रम्, सर्वसम्पत्प्रदम्।</p>',
        ARRAY['धनसम्पत्प्राप्ति', 'आर्थिकस्थिरता', 'व्यापारवृद्धि', 'गृहसमृद्धि', 'पारिवारिकसुख', 'आध्यात्मिकसम्पत्'],
        '<p><strong>उत्तमकाल:</strong> शुक्रवासरे सायंकाले, लक्ष्मीपूजाकाले</p><p><strong>जपसंख्या:</strong> कमलबीजमाला द्वारा १०८ वारम्</p><p><strong>दिशा:</strong> उत्तर अथवा पूर्वमुखी होकर घृतदीप प्रज्वलित्य</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Tamil Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid,
        lang_ta,
        '<p><strong>ஓம் ஶ்ரீம் மஹாலக்ஷ்மியை நமஹ</strong></p><p>திருமகள் லக்ஷ்மி தேவிக்கு வணக்கம்</p>',
        'Om Śrīm Mahālakṣmiyai Namaḥ',
        'ஓம் (பிரணவம்) - ஶ்ரீம் (லக்ஷ்மி பீஜம்) - மஹாலக்ஷ்மியை (மஹாலக்ஷ்மி தேவிக்கு) - நமஹ (வணக்கம்)',
        '<p>செல்வத்தின் அதிபதியான மஹாலக்ஷ்மி தேவியின் மூல மந்திரம். செல்வம், செழிப்பு, வளம் அனைத்தையும் அருளும்.</p><p><strong>ஶ்ரீம்</strong> என்பது லக்ஷ்மி தேவியின் பீஜ மந்திரம், அனைத்து வளங்களையும் அருளும்.</p>',
        ARRAY['செல்வ வளம் பெருகும்', 'பொருளாதார நிலைமை மேம்படும்', 'வியாபார வளர்ச்சி', 'குடும்ப நலம்', 'வீட்டில் செழிப்பு', 'ஆன்மீக செல்வம்'],
        '<p><strong>சிறந்த நேரம்:</strong> வெள்ளிக்கிழமை மாலை, லக்ஷ்மி பூஜை நேரம்</p><p><strong>எண்ணிக்கை:</strong> தாமரை விதை மாலையில் 108 முறை</p><p><strong>திசை:</strong> வடக்கு அல்லது கிழக்கு நோக்கி நெய் விளக்கு ஏற்றி</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Hindi Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid,
        lang_hi,
        '<p><strong>ॐ श्रीं महालक्ष्म्यै नमः</strong></p><p>माता लक्ष्मी को प्रणाम</p>',
        'Om Shreem Mahalakshmiyei Namah',
        'ॐ (ओम्) - श्रीं (श्रीम्) - महालक्ष्म्यै (महालक्ष्मी माता को) - नमः (प्रणाम)',
        '<p>धन की देवी महालक्ष्मी का मूल मंत्र। संपत्ति, समृद्धि और वैभव की प्राप्ति के लिए इस मंत्र का जाप करते हैं।</p><p><strong>श्रीं</strong> लक्ष्मी जी का बीज मंत्र है जो सभी प्रकार की संपत्ति देता है।</p>',
        ARRAY['धन संपत्ति की प्राप्ति', 'आर्थिक स्थिरता', 'व्यापार में वृद्धि', 'घर में समृद्धि', 'पारिवारिक सुख', 'आध्यात्मिक संपदा'],
        '<p><strong>उत्तम समय:</strong> शुक्रवार की शाम, लक्ष्मी पूजा के समय</p><p><strong>जाप संख्या:</strong> कमल गट्टे की माला से 108 बार</p><p><strong>दिशा:</strong> उत्तर या पूर्व दिशा की ओर मुंह करके घी का दीपक जलाकर</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

END $$;

-- Create third demo mantra: Om Namah Shivaya
INSERT INTO mantras (id, title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'demo-shiva-001'::uuid,
    'Om Namah Shivaya',
    'ॐ नमः शिवाय',
    c.id,
    d.id,
    rc.id,
    rt.id,
    350
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name ILIKE '%universal%'
AND d.name = 'Shiva'
AND rc.count_value = 108
AND rt.name ILIKE '%anytime%'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Add translations for Shiva mantra (English, Sanskrit, Tamil)
DO $$
DECLARE
    shiva_uuid UUID := 'demo-shiva-001'::uuid;
    lang_en UUID;
    lang_sa UUID;
    lang_ta UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO lang_en FROM languages WHERE code = 'en';
    SELECT id INTO lang_sa FROM languages WHERE code = 'sa';
    SELECT id INTO lang_ta FROM languages WHERE code = 'ta';

    -- English Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        shiva_uuid,
        lang_en,
        '<p><strong>Om Namah Shivaya</strong></p><p>ॐ नमः शिवाय</p><p><em>The Universal Mantra of Lord Shiva</em></p>',
        'Om Namah Shivaya',
        'Om (AUM) - Na-mah (Nah-mah) - Shi-va-ya (Shee-vah-yah)',
        '<p>The most sacred and universal mantra of Lord Shiva. This five-syllable mantra (Panchakshari) represents the five elements and is considered one of the most powerful mantras in Hinduism.</p><p>It means "I bow to Shiva" - the auspicious one, the transformer, and the supreme consciousness.</p>',
        ARRAY['Spiritual awakening and growth', 'Inner peace and tranquility', 'Purification of mind and soul', 'Protection from negative energies', 'Enhanced meditation and focus', 'Liberation from worldly attachments'],
        '<p><strong>Best Time:</strong> Can be chanted anytime, especially during meditation</p><p><strong>Repetitions:</strong> 108 times or continuous chanting</p><p><strong>Special:</strong> This mantra can be chanted without any specific rituals or restrictions</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Sanskrit Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        shiva_uuid,
        lang_sa,
        '<p><strong>ॐ नमः शिवाय</strong></p><p>पञ्चाक्षरी महामन्त्रम्</p>',
        'Om Namaḥ Śivāya',
        'ॐ (प्रणव) - नमः (प्रणाम) - शिवाय (शिवाय देवाय)',
        '<p>भगवान् शिवस्य पञ्चाक्षरी महामन्त्रम्। पञ्चतत्त्वात्मकं सर्वोत्कृष्टं मन्त्रम्।</p><p>शिवाय नमः इति अर्थः - कल्याणकारिणे परमेश्वराय प्रणामः।</p>',
        ARRAY['आध्यात्मिकोन्नति', 'चित्तशान्ति', 'मनःशुद्धि', 'नकारात्मकशक्तिनिवारण', 'ध्यानसाधना', 'मोक्षप्राप्ति'],
        '<p><strong>उत्तमकाल:</strong> सर्वकालं जप्यम्, विशेषतः ध्यानकाले</p><p><strong>जपसंख्या:</strong> १०८ वारम् अथवा निरन्तरजपः</p><p><strong>विशेषता:</strong> निर्बन्धं सर्वत्र जप्यम्</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Tamil Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        shiva_uuid,
        lang_ta,
        '<p><strong>ஓம் நமஃ சிவாய</strong></p><p>பஞ்சாக்ஷர மஹா மந்திரம்</p>',
        'Om Namaḥ Śivāya',
        'ஓம் (பிரணவம்) - நமஃ (வணக்கம்) - சிவாய (சிவ பெருமானுக்கு)',
        '<p>சிவ பெருமானின் பஞ்சாக்ஷர மஹா மந்திரம். ஐந்து எழுத்துக்களால் ஆன இந்த மந்திரம் பஞ்ச பூதங்களையும் குறிக்கிறது.</p><p>"சிவனுக்கு வணக்கம்" என்பது பொருள் - மங்களகரமானவனுக்கு, பரம்பொருளுக்கு நமஸ்காரம்.</p>',
        ARRAY['ஆன்மீக வளர்ச்சி', 'மன அமைதி', 'மனத் தூய்மை', 'எதிர்மறை சக்திகள் விலகல்', 'தியான ஆழம்', 'முக்தி பெறுதல்'],
        '<p><strong>சிறந்த நேரம்:</strong> எந்த நேரமும் ஜபிக்கலாம், குறிப்பாக தியான நேரத்தில்</p><p><strong>எண்ணிக்கை:</strong> 108 முறை அல்லது தொடர்ச்சியாக</p><p><strong>சிறப்பு:</strong> எந்த கட்டுப்பாடும் இல்லாமல் எங்கும் ஜபிக்கலாம்</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

END $$;

-- Verification queries to check the demo data
-- Uncomment these to verify the data after running the script

/*
-- Check all mantras with their translation counts
SELECT
    m.title,
    m.view_count,
    COUNT(mt.id) as translation_count,
    STRING_AGG(l.name, ', ' ORDER BY l.sort_order) as available_languages
FROM mantras m
LEFT JOIN mantra_translations mt ON m.id = mt.mantra_id
LEFT JOIN languages l ON mt.language_id = l.id
WHERE m.id IN ('demo-ganesha-001', 'demo-lakshmi-001', 'demo-shiva-001')
GROUP BY m.id, m.title, m.view_count
ORDER BY m.view_count DESC;

-- Check specific translations for Ganesha mantra
SELECT
    l.name as language,
    l.native_name,
    LENGTH(mt.text) as text_length,
    CASE WHEN mt.transliteration IS NOT NULL THEN 'Yes' ELSE 'No' END as has_transliteration,
    CASE WHEN mt.meaning IS NOT NULL THEN 'Yes' ELSE 'No' END as has_meaning,
    ARRAY_LENGTH(mt.benefits, 1) as benefit_count
FROM mantra_translations mt
JOIN languages l ON mt.language_id = l.id
WHERE mt.mantra_id = 'demo-ganesha-001'
ORDER BY l.sort_order;

-- Test the mantras_with_translations view
SELECT
    title,
    JSON_ARRAY_LENGTH(translations) as translation_count
FROM mantras_with_translations
WHERE id IN ('demo-ganesha-001', 'demo-lakshmi-001', 'demo-shiva-001');
*/
