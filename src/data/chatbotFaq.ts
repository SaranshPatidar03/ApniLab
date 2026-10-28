export interface FaqItem {
  id: string;
  questionKey: string;
  defaultQuestion: { en: string; hi: string };
  answer: { en: string; hi: string };
  keywords: string[];
  category: 'about' | 'navigation' | 'physics' | 'math' | 'chemistry' | 'biology';
  relatedRoute?: string;
}

export const CHATBOT_FAQ_DATABASE: FaqItem[] = [
  {
    id: 'what-is-apnilab',
    questionKey: 'assistant_faq_q1',
    defaultQuestion: {
      en: 'What is ApniLab?',
      hi: 'अपनीलैब (ApniLab) क्या है?',
    },
    answer: {
      en: 'ApniLab is a modern virtual science lab for secondary school students. It lets you simulate experiments, verify scientific laws like Ohm\'s Law, explore apparatus, and record practical observations right on your mobile phone.',
      hi: 'अपनीलैब माध्यमिक विद्यालय के विद्यार्थियों के लिए एक आधुनिक वर्चुअल विज्ञान लैब है। यहाँ आप मोबाइल पर ही प्रायोगिक सिमुलेशन चला सकते हैं, ओम के नियम जैसे वैज्ञानिक सिद्धांतों का सत्यापन कर सकते हैं और प्रेक्षण दर्ज कर सकते हैं।',
    },
    keywords: ['apnilab', 'what', 'about', 'app', 'purpose', 'kya', 'hai', 'intro', 'school', 'lab'],
    category: 'about',
  },
  {
    id: 'how-to-start-experiment',
    questionKey: 'assistant_faq_q2',
    defaultQuestion: {
      en: 'How do I start an experiment?',
      hi: 'प्रयोग कैसे शुरू करें?',
    },
    answer: {
      en: 'Go to the "Explore" tab to browse experiments by subject (Physics, Chemistry, Biology, Mathematics). Tap on any experiment card to view its apparatus, safety precautions, and tap "Start Experiment" or "Launch Simulation".',
      hi: '"एक्सप्लोर" (Explore) टैब पर जाएं और विषय (भौतिकी, रसायन विज्ञान, जीव विज्ञान, गणित) के अनुसार प्रयोग चुनें। किसी भी कार्ड पर टैप करके उपकरण व निर्देश देखें और "प्रयोग शुरू करें" पर क्लिक करें।',
    },
    keywords: ['start', 'experiment', 'begin', 'open', 'launch', 'kaise', 'shuru', 'explore'],
    category: 'navigation',
    relatedRoute: '/(tabs)/explore',
  },
  {
    id: 'ohms-law-guide',
    questionKey: 'assistant_faq_q3',
    defaultQuestion: {
      en: "How does the Ohm's Law experiment work?",
      hi: 'ओम का नियम प्रयोग कैसे काम करता है?',
    },
    answer: {
      en: "Ohm's Law states that V = I × R (Voltage = Current × Resistance). In the interactive lab, use the steppers to adjust DC Voltage and Resistor values. The ammeter displays the resulting current (I = V/R), and the light bulb changes brightness dynamically!",
      hi: 'ओम का नियम बताता है कि V = I × R (विभवांतर = विद्युत धारा × प्रतिरोध)। इंटरैक्टिव लैब में वोल्टेज और प्रतिरोध के मान बदलें। एमीटर तुरंत धारा (I = V/R) दिखाएगा और बल्ब की चमक भी बदलेगी!',
    },
    keywords: ['ohm', 'ohms', 'circuit', 'voltage', 'current', 'resistance', 'bulb', 'v=ir', 'v', 'i', 'r', 'ammeter', 'voltmeter'],
    category: 'physics',
    relatedRoute: '/lab/ohms-law',
  },
  {
    id: 'simple-pendulum-guide',
    questionKey: 'assistant_faq_q4',
    defaultQuestion: {
      en: 'What is a simple pendulum?',
      hi: 'सरल लोलक (Simple Pendulum) क्या है?',
    },
    answer: {
      en: 'A simple pendulum consists of a small heavy metallic bob suspended by a light thread. Its time period for small oscillations is T = 2π√(L/g). The period depends only on thread length (L) and gravitational acceleration (g), not on the bob mass.',
      hi: 'सरल लोलक में एक धागे से लटकी धातु की भारी गोली (बॉब) होती है। छोटे दोलनों के लिए इसका आवर्तकाल T = 2π√(L/g) होता है, जो केवल धागे की प्रभावी लंबाई (L) और गुरुत्वीय त्वरण (g) पर निर्भर करता है।',
    },
    keywords: ['pendulum', 'bob', 'oscillation', 'time', 'period', 'shm', 'length', 'gravity', 'lolak', 'dolan'],
    category: 'physics',
    relatedRoute: '/lab/simple-pendulum',
  },
  {
    id: 'binary-converter-guide',
    questionKey: 'assistant_faq_q5',
    defaultQuestion: {
      en: 'How do I convert decimal to binary?',
      hi: 'दशमलव संख्या को बाइनरी में कैसे बदलें?',
    },
    answer: {
      en: 'To convert decimal to binary, repeatedly divide the number by 2 and write down the remainders from bottom to top. In our Binary Converter lab, you can toggle individual bits (128, 64, 32, 16, 8, 4, 2, 1) or view the step-by-step successive division table!',
      hi: 'दशमलव को बाइनरी में बदलने के लिए संख्या को लगातार 2 से भाग दें और शेषफल को नीचे से ऊपर की ओर लिखें। हमारे बाइनरी कनवर्टर लैब में आप 8-बिट स्विच टॉगल कर सकते हैं या विभाजन की चरणबद्ध तालिका देख सकते हैं!',
    },
    keywords: ['binary', 'decimal', 'converter', 'bits', 'hex', 'octal', 'conversion', 'bainari', 'sankhya'],
    category: 'math',
    relatedRoute: '/lab/binary-converter',
  },
  {
    id: 'change-language',
    questionKey: 'assistant_faq_q6',
    defaultQuestion: {
      en: 'How do I change the language?',
      hi: 'भाषा कैसे बदलें?',
    },
    answer: {
      en: 'Open the "Profile" tab, scroll to the "App Preferences" section, and tap either "English" or "हिन्दी". The entire interface, scientific terms, and instructions will update instantly.',
      hi: '"प्रोफ़ाइल" (Profile) टैब खोलें, नीचे "ऐप प्राथमिकताएं" (App Preferences) सेक्शन में जाएं और "English" या "हिन्दी" पर टैप करें। पूरी ऐप तुरंत चुनी गई भाषा में बदल जाएगी।',
    },
    keywords: ['language', 'hindi', 'english', 'bhasha', 'translate', 'change', 'switch'],
    category: 'navigation',
    relatedRoute: '/(tabs)/profile',
  },
  {
    id: 'change-theme',
    questionKey: 'assistant_faq_q7',
    defaultQuestion: {
      en: 'How do I switch Light and Dark themes?',
      hi: 'लाइट और डार्क थीम कैसे बदलें?',
    },
    answer: {
      en: 'Navigate to the "Profile" tab and look for "Theme Mode". Tap "Light" for daytime study with a crisp slate background, or "Dark" for comfortable low-light laboratory simulation.',
      hi: '"प्रोफ़ाइल" टैब पर जाएं और "थीम मोड" देखें। दिन में स्पष्ट अध्ययन के लिए "Light" चुनें या कम रोशनी में आरामदायक उपयोग के लिए "Dark" पर टैप करें।',
    },
    keywords: ['theme', 'dark', 'light', 'mode', 'color', 'background', 'black', 'white'],
    category: 'navigation',
    relatedRoute: '/(tabs)/profile',
  },
  {
    id: 'check-learning-progress',
    questionKey: 'assistant_faq_q8',
    defaultQuestion: {
      en: 'How can I check my learning progress?',
      hi: 'अपनी सीखने की प्रगति कैसे देखें?',
    },
    answer: {
      en: 'Tap the "My Learning" tab in the bottom bar. There you will see your total completed practicals, practice hours, active streak days, and individual experiment quiz scores with review options.',
      hi: 'निचले बार में "मेरी पढ़ाई" (My Learning) टैब पर टैप करें। वहां आपको कुल पूर्ण किए गए प्रैक्टिकल, अध्ययन घंटे, स्ट्रीक के दिन और हर प्रयोग के क्विज़ स्कोर दिखेंगे।',
    },
    keywords: ['progress', 'learning', 'score', 'streak', 'hours', 'certificate', 'pragati', 'report', 'records'],
    category: 'navigation',
    relatedRoute: '/(tabs)/learning',
  },
];

/**
 * Searches the FAQ database given a user query and language.
 * Uses normalized keyword matching and returns matching FAQ item or null.
 */
export function searchFaq(
  query: string,
  _language: 'en' | 'hi' = 'en'
): FaqItem | null {
  const normalized = query
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .trim();

  if (!normalized) return null;

  const queryWords = normalized.split(/\s+/).filter((w) => w.length > 1);

  let bestMatch: FaqItem | null = null;
  let highestScore = 0;

  for (const item of CHATBOT_FAQ_DATABASE) {
    let score = 0;

    // Check exact question match
    const qEn = item.defaultQuestion.en.toLowerCase();
    const qHi = item.defaultQuestion.hi.toLowerCase();
    if (qEn.includes(normalized) || qHi.includes(normalized)) {
      score += 10;
    }

    // Check keyword intersections
    for (const word of queryWords) {
      if (item.keywords.some((k) => k === word || k.includes(word) || word.includes(k))) {
        score += 3;
      }
      if (qEn.includes(word) || qHi.includes(word)) {
        score += 2;
      }
    }

    if (score > highestScore && score >= 3) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}

