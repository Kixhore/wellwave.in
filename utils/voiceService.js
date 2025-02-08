// Voice recognition service
async function setupVoiceRecognition() {
    try {
        if (!('webkitSpeechRecognition' in window)) {
            throw new Error('Voice recognition not supported in this browser');
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true; // Enable interim results for faster response
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        // Optimize for faster recognition
        recognition.interimResults = true;
        recognition.continuous = false;

        return recognition;
    } catch (error) {
        reportError(error);
        return null;
    }
}

// Speech synthesis service
function setupSpeechSynthesis() {
    try {
        if (!('speechSynthesis' in window)) {
            throw new Error('Speech synthesis not supported in this browser');
        }

        const synthesis = window.speechSynthesis;
        const voices = synthesis.getVoices();
        
        // Prefer a male voice with US English accent
        const preferredVoice = voices.find(voice => 
            (voice.name.includes('Male') || voice.name.includes('Google US English Male')) &&
            voice.lang.includes('en-US')
        ) || voices.find(voice => voice.lang.includes('en-US')) || voices[0];

        return { synthesis, preferredVoice };
    } catch (error) {
        reportError(error);
        return null;
    }
}

function speakText(text, onEnd = () => {}) {
    try {
        const { synthesis, preferredVoice } = setupSpeechSynthesis();
        if (!synthesis) return;

        // Clear any existing speech
        synthesis.cancel();

        // Split text into smaller chunks for more natural pauses
        const sentences = text.split(/[.!?]+\s/).filter(Boolean);
        let currentIndex = 0;

        const speakNextChunk = () => {
            if (currentIndex >= sentences.length) {
                onEnd();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(sentences[currentIndex] + '.');
            
            // Optimize voice settings for natural speech
            utterance.voice = preferredVoice;
            utterance.rate = 1.1;      // Slightly faster than default
            utterance.pitch = 1.0;     // Natural pitch
            utterance.volume = 1.0;    // Full volume
            
            // Add natural pauses between sentences
            if (currentIndex > 0) {
                utterance.pause = 0.3;  // Brief pause between sentences
            }

            utterance.onend = () => {
                currentIndex++;
                speakNextChunk();
            };

            // Add slight variation to speech parameters for more natural sound
            utterance.rate += Math.random() * 0.1 - 0.05;  // Small random variation in speed
            utterance.pitch += Math.random() * 0.1 - 0.05; // Small random variation in pitch

            synthesis.speak(utterance);
        };

        speakNextChunk();
    } catch (error) {
        reportError(error);
    }
}

function stopSpeaking() {
    try {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    } catch (error) {
        reportError(error);
    }
}

// Preload voices for faster initial response
function preloadVoices() {
    try {
        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            synthesis.getVoices(); // Initial load of voices
            
            // Handle dynamic voice loading
            if (synthesis.onvoiceschanged !== undefined) {
                synthesis.onvoiceschanged = () => {
                    synthesis.getVoices();
                };
            }
        }
    } catch (error) {
        reportError(error);
    }
}

// Initialize voice preloading
preloadVoices();
