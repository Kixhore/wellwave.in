// Natural language datasets for medical conversations
const medicalLanguageDataset = {
    greetings: {
        'en': ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        'es': ['hola', 'buenos días', 'buenas tardes', 'buenas noches'],
        'fr': ['bonjour', 'salut', 'bonsoir'],
        'de': ['hallo', 'guten morgen', 'guten tag', 'guten abend'],
        'hi': ['नमस्ते', 'नमस्कार']
    },
    symptoms: {
        'en': {
            'headache': ['head pain', 'migraine', 'head hurts', 'head ache'],
            'fever': ['temperature', 'hot', 'feeling warm', 'chills'],
            'cough': ['coughing', 'chest cough', 'dry cough', 'wet cough'],
            'stomach': ['stomach pain', 'abdominal pain', 'belly pain', 'tummy ache']
        }
    },
    responses: {
        'en': {
            greetings: {
                morning: [
                    "Good morning! I'm Dr. WellWave. How can I assist you today?",
                    "Good morning! What brings you in today?",
                    "Hello! How are you feeling this morning?"
                ],
                afternoon: [
                    "Good afternoon! What health concerns can I help you with?",
                    "Hello! How can I assist you this afternoon?",
                    "Good afternoon! What seems to be troubling you today?"
                ],
                evening: [
                    "Good evening! How can I help you tonight?",
                    "Hello! What health concerns bring you here this evening?",
                    "Good evening! How are you feeling?"
                ]
            },
            symptomatic: {
                initial: [
                    "I understand you're experiencing {symptom}. How long has this been going on?",
                    "I see you're having trouble with {symptom}. When did this start?",
                    "Tell me more about your {symptom}. When did you first notice it?"
                ],
                followUp: [
                    "Have you noticed any other symptoms along with {symptom}?",
                    "Does anything make your {symptom} better or worse?",
                    "On a scale of 1-10, how would you rate your {symptom}?"
                ]
            }
        }
    }
};

function detectLanguage(text) {
    try {
        // Check against each language's greetings
        for (const [lang, greetings] of Object.entries(medicalLanguageDataset.greetings)) {
            if (greetings.some(greeting => text.toLowerCase().includes(greeting))) {
                return lang;
            }
        }
        return 'en'; // Default to English
    } catch (error) {
        reportError(error);
        return 'en';
    }
}

function identifySymptoms(text, language = 'en') {
    try {
        const symptoms = medicalLanguageDataset.symptoms[language] || medicalLanguageDataset.symptoms['en'];
        const identifiedSymptoms = [];

        for (const [symptom, variations] of Object.entries(symptoms)) {
            if (variations.some(variation => text.toLowerCase().includes(variation))) {
                identifiedSymptoms.push(symptom);
            }
        }

        return identifiedSymptoms;
    } catch (error) {
        reportError(error);
        return [];
    }
}

function generateResponse(context, language = 'en') {
    try {
        const responses = medicalLanguageDataset.responses[language] || medicalLanguageDataset.responses['en'];
        const { type, time, symptom } = context;

        if (type === 'greeting') {
            const timeResponses = responses.greetings[time] || responses.greetings.morning;
            return timeResponses[Math.floor(Math.random() * timeResponses.length)];
        }

        if (type === 'symptomatic' && symptom) {
            const symptomResponses = responses.symptomatic.initial;
            const response = symptomResponses[Math.floor(Math.random() * symptomResponses.length)];
            return response.replace('{symptom}', symptom);
        }

        return null;
    } catch (error) {
        reportError(error);
        return null;
    }
}

function processUserInput(text, userData) {
    try {
        const language = detectLanguage(text);
        const symptoms = identifySymptoms(text, language);
        const timeOfDay = new Date().getHours();
        let time = 'morning';
        
        if (timeOfDay >= 12 && timeOfDay < 18) {
            time = 'afternoon';
        } else if (timeOfDay >= 18) {
            time = 'evening';
        }

        // Check if it's a greeting
        if (medicalLanguageDataset.greetings[language].some(greeting => 
            text.toLowerCase().includes(greeting))) {
            return generateResponse({ type: 'greeting', time }, language);
        }

        // Process symptoms if found
        if (symptoms.length > 0) {
            return generateResponse({ 
                type: 'symptomatic', 
                symptom: symptoms[0],
                time 
            }, language);
        }

        return null;
    } catch (error) {
        reportError(error);
        return null;
    }
}
