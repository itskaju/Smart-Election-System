import OpenAI from 'openai';

/**
 * NVIDIA NIM Service
 */
export const generateNimResponse = async (prompt, apiKey, language = 'en-US') => {
  const openai = new OpenAI({
    apiKey,
    baseURL: `${window.location.origin}/nim-api`,
    dangerouslyAllowBrowser: true
  });

  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: `You are a voice-based assistant. Answer the user's question directly, strictly, and extremely briefly. IMPORTANT: You MUST reply entirely in ${targetLang}. ABSOLUTELY NO MARKDOWN.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('NIM Error Details:', error);
    throw new Error(`NVIDIA NIM: ${error.message || 'Connection failed'}`);
  }
};

/**
 * NVIDIA-only orchestrator.
 */
export const generateRobustAiResponse = async (prompt, nimKey, language = 'en-US') => {
  if (!nimKey) throw new Error('NVIDIA NIM API Key is missing.');
  return await generateNimResponse(prompt, nimKey, language);
};

/**
 * Generates a dynamic quiz using NVIDIA NIM.
 */
export const generateDynamicQuiz = async (nimKey, language = 'en-US') => {
  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  const prompt = `Generate a 5-question multiple choice quiz about Global and Indian Election processes.\nLanguage: ${targetLang}. Return ONLY a JSON array.\nExample: [{"question": "Text", "options": ["A", "B", "C", "D"], "correctAnswer": "B"}]`;

  try {
    const response = await generateNimResponse(prompt, nimKey, language);
    let content = response.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(content);
  } catch (err) {
    console.error('NIM Quiz failed:', err);
    return [{ question: 'Error generating quiz', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' }];
  }
};

/**
 * Generates an objective civic analysis based on user values.
 */
export const generateValuesAnalysis = async (answers, nimKey, language = 'en-US') => {
  const langNames = { 'en-US': 'English', 'es-ES': 'Spanish', 'fr-FR': 'French', 'hi-IN': 'Hindi' };
  const targetLang = langNames[language] || 'English';

  const prompt = `Based on these user values: ${JSON.stringify(answers)}, provide a 3-sentence objective civic policy alignment summary in ${targetLang}. Focus on policies, not parties.`;

  try {
    return await generateNimResponse(prompt, nimKey, language);
  } catch (error) {
    return 'Analysis unavailable.';
  }
};
