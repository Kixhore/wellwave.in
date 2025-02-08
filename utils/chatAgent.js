function chatAgent(question, chatHistory, userData) {
    try {
        const questionLower = question.toLowerCase().trim();

        // Process greetings and farewells
        const greetingResponse = processGreetings(questionLower, userData.name);
        if (greetingResponse) {
            return greetingResponse;
        }

        // Process gratitude expressions
        const gratitudeResponse = processGratitude(questionLower, userData.name);
        if (gratitudeResponse) {
            return gratitudeResponse;
        }

        // Check if the question is medical-related
        if (!isMedicalQuery(questionLower)) {
            return `I apologize, ${userData.name}, but I'm specifically designed to help with medical and health-related questions. Please feel free to ask me about any health concerns, symptoms, medications, or medical conditions.`;
        }

        // Process medical questions using enhanced medical knowledge base
        const medicalResponse = processMedicalQuery(question, chatHistory, userData);
        if (medicalResponse) {
            return medicalResponse;
        }

        // If no specific category is matched, use general medical AI response
        const systemPrompt = `You are Dr. WellWave, a compassionate and knowledgeable medical AI assistant with expertise strictly limited to healthcare, medicine, and medical conditions. You're having a conversation with ${userData.name}. 

IMPORTANT RESTRICTIONS:
1. Only answer questions related to medical topics, health, and healthcare
2. For non-medical questions, politely redirect the user to ask health-related questions
3. Never provide advice about non-medical topics
4. Stay within the scope of medical knowledge and healthcare

Key Medical Topics to Address:
1. Symptoms and conditions
2. Medications and treatments
3. Medical procedures and tests
4. Preventive healthcare
5. General health and wellness
6. Medical terminology explanations
7. First aid and emergency care
8. Healthcare navigation
9. Medical specialties
10. Public health information

Previous Conversation Context:
${JSON.stringify(chatHistory)}

Remember to:
- Only provide medical information
- Redirect non-medical queries
- Maintain medical accuracy
- Include appropriate disclaimers
- Encourage professional consultation when needed`;

        return invokeAIAgent(systemPrompt, question);
    } catch (error) {
        reportError(error);
        throw error;
    }
}

function isMedicalQuery(question) {
    const medicalKeywords = [
        // Symptoms and Conditions
        'pain', 'ache', 'sore', 'hurt', 'fever', 'cough', 'cold', 'flu', 'headache',
        'nausea', 'dizzy', 'tired', 'fatigue', 'rash', 'swelling', 'infection',
        'disease', 'condition', 'syndrome', 'disorder', 'illness',

        // Body Parts
        'head', 'chest', 'stomach', 'back', 'leg', 'arm', 'throat', 'nose', 'ear',
        'eye', 'skin', 'heart', 'lung', 'liver', 'kidney', 'bone', 'muscle', 'joint',

        // Medical Terms
        'doctor', 'hospital', 'clinic', 'emergency', 'ambulance', 'surgery', 'operation',
        'treatment', 'diagnosis', 'prognosis', 'symptom', 'prescription', 'exam',
        'test', 'scan', 'xray', 'mri', 'blood', 'urine',

        // Medications
        'medicine', 'medication', 'drug', 'pill', 'tablet', 'capsule', 'antibiotic',
        'vaccine', 'injection', 'dose', 'prescription', 'otc', 'pharmacy',

        // Health and Wellness
        'health', 'healthy', 'medical', 'wellness', 'diet', 'exercise', 'nutrition',
        'vitamin', 'supplement', 'immune', 'prevention', 'checkup', 'screening',

        // Mental Health
        'anxiety', 'depression', 'stress', 'mental health', 'therapy', 'counseling',
        'psychiatrist', 'psychologist',

        // Emergency Terms
        'emergency', 'urgent', '911', 'ambulance', 'critical', 'severe', 'acute',

        // Healthcare System
        'insurance', 'medicare', 'medicaid', 'healthcare', 'hospital', 'clinic',
        'specialist', 'referral', 'appointment'
    ];

    // Check if the question contains any medical keywords
    return medicalKeywords.some(keyword => question.includes(keyword));
}

function processGreetings(questionLower, userName) {
    const greetings = {
        hello: [`Hello ${userName}! I'm Dr. WellWave, your medical AI assistant. How can I help you with your health today?`],
        hi: [`Hi ${userName}! I'm here to help with any medical questions or concerns you might have.`],
        hey: [`Hey ${userName}! How can I assist you with your health today?`],
        good: {
            morning: [`Good morning ${userName}! I hope you're having a healthy start to your day. What medical concerns can I help you with?`],
            afternoon: [`Good afternoon ${userName}! How can I assist you with your health today?`],
            evening: [`Good evening ${userName}! I'm here to help with any medical questions you might have.`],
            night: [`Good night ${userName}! Before you retire for the day, how can I help with your health concerns?`]
        }
    };

    // Check for simple greetings
    for (const [greeting, responses] of Object.entries(greetings)) {
        if (questionLower.includes(greeting) && !questionLower.includes('good')) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Check for time-specific greetings
    if (questionLower.includes('good')) {
        for (const [timeOfDay, responses] of Object.entries(greetings.good)) {
            if (questionLower.includes(timeOfDay)) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }

    return null;
}

function processGratitude(questionLower, userName) {
    const gratitudeKeywords = {
        'thank': [
            `You're welcome, ${userName}! I'm glad I could help. Don't hesitate to ask if you have any other health-related questions.`,
            `It's my pleasure, ${userName}! Remember, I'm here 24/7 for any medical concerns you might have.`,
            `You're most welcome, ${userName}! Your health is my priority. Feel free to return anytime with more questions.`
        ],
        'appreciate': [
            `I appreciate your trust, ${userName}. Please don't hesitate to reach out with any other medical questions.`,
            `Thank you for your kind words, ${userName}. I'm here to help you maintain optimal health.`,
            `I'm glad I could be of assistance, ${userName}. Your health and well-being are important to me.`
        ],
        'bye': [
            `Take care, ${userName}! Remember to prioritize your health, and don't hesitate to return if you need any medical advice.`,
            `Goodbye, ${userName}! Stay healthy, and feel free to come back anytime with health-related questions.`,
            `Farewell, ${userName}! Remember, I'm available 24/7 for any medical concerns you might have.`
        ]
    };

    for (const [keyword, responses] of Object.entries(gratitudeKeywords)) {
        if (questionLower.includes(keyword)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    return null;
}

function processMedicalQuery(question, chatHistory, userData) {
    try {
        // Check if it's a medicine-related question
        const medicineKeywords = [
            'medicine', 'medication', 'drug', 'pill', 'tablet', 'capsule',
            'prescription', 'dose', 'dosage', 'side effect', 'interaction',
            'treatment', 'cure', 'remedy', 'pharmacy', 'pharmacist',
            'generic', 'brand', 'over the counter', 'otc', 'antibiotic',
            'painkiller', 'supplement', 'vitamin', 'mineral', 'herbal'
        ];

        const isMedicineQuestion = medicineKeywords.some(keyword => 
            question.toLowerCase().includes(keyword)
        );

        if (isMedicineQuestion) {
            const medicinePrompt = `You are Dr. WellWave, a pharmaceutical expert and medical AI assistant. ${userData.name} has asked about medication. Provide detailed, accurate information about medicines while emphasizing:

1. Proper usage and dosage guidelines
2. Common and serious side effects
3. Drug interactions
4. When to seek medical attention
5. Important precautions and warnings

Previous conversation context:
${JSON.stringify(chatHistory)}

Remember to:
- Always recommend consulting a healthcare provider for prescription medications
- Explain both benefits and risks
- Use clear, understandable language
- Include relevant warnings and disclaimers
- Emphasize the importance of following prescribed dosages
- Only discuss medical topics and medications`;

            return invokeAIAgent(medicinePrompt, question);
        }

        return null;
    } catch (error) {
        reportError(error);
        return null;
    }
}
