function ChatInput({ onSendMessage, disabled }) {
    const [message, setMessage] = React.useState('');
    const [isListening, setIsListening] = React.useState(false);
    const [permissionError, setPermissionError] = React.useState('');
    const [hasInitialized, setHasInitialized] = React.useState(false);
    const recognitionRef = React.useRef(null);

    React.useEffect(() => {
        const initializeVoiceRecognition = async () => {
            try {
                if (hasInitialized) return;
                setHasInitialized(true);

                recognitionRef.current = await setupVoiceRecognition();
                
                if (recognitionRef.current) {
                    recognitionRef.current.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        setMessage(transcript);
                        handleSendVoiceMessage(transcript);
                    };

                    recognitionRef.current.onerror = (event) => {
                        let errorMessage = 'Speech recognition error occurred';
                        
                        switch (event.error) {
                            case 'not-allowed':
                                errorMessage = 'Please click the microphone icon to enable voice input';
                                break;
                            case 'no-speech':
                                errorMessage = 'No speech was detected. Please try again.';
                                break;
                            case 'network':
                                errorMessage = 'Network error occurred. Please check your connection.';
                                break;
                            default:
                                errorMessage = `Speech recognition error: ${event.error}`;
                        }
                        
                        setPermissionError(errorMessage);
                        setIsListening(false);
                    };

                    recognitionRef.current.onend = () => {
                        setIsListening(false);
                    };
                }
            } catch (error) {
                setPermissionError(error.message);
                reportError(error);
            }
        };

        initializeVoiceRecognition();
    }, [hasInitialized]);

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            if (message.trim() && !disabled) {
                onSendMessage(message);
                setMessage('');
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleKeyPress = (e) => {
        try {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const toggleVoiceInput = async () => {
        try {
            setPermissionError('');

            if (!recognitionRef.current) {
                setPermissionError('Voice recognition is not supported in your browser');
                return;
            }

            if (isListening) {
                recognitionRef.current.stop();
                setIsListening(false);
            } else {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                    setPermissionError('');
                } catch (error) {
                    setPermissionError('Please allow microphone access when prompted');
                    reportError(error);
                }
            }
        } catch (error) {
            setPermissionError('An error occurred while accessing the microphone');
            reportError(error);
        }
    };

    const handleSendVoiceMessage = (transcript) => {
        try {
            if (transcript.trim() && !disabled) {
                onSendMessage(transcript);
                setMessage('');
            }
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <div data-name="chat-input" className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-50 border-t border-gray-700 border-opacity-50">
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-2">
                {permissionError && (
                    <div className="mb-2 p-2 bg-blue-500 bg-opacity-20 text-blue-200 rounded text-xs">
                        <i className="fas fa-info-circle mr-2"></i>
                        {permissionError}
                    </div>
                )}
                <div className="relative flex items-center space-x-2">
                    <VoiceControl
                        onVoiceInput={handleSendVoiceMessage}
                        isListening={isListening}
                        onToggleVoice={toggleVoiceInput}
                        disabled={disabled}
                    />
                    <div className="flex-1 relative">
                        <textarea
                            data-name="message-textarea"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Describe your medical concerns or symptoms..."
                            className="w-full p-2 pr-12 rounded bg-white bg-opacity-10 border border-gray-600 border-opacity-50 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 text-sm"
                            rows="1"
                            disabled={disabled}
                        />
                        <button
                            data-name="send-button"
                            type="submit"
                            disabled={!message.trim() || disabled}
                            className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded 
                                ${!message.trim() || disabled ? 'bg-gray-600 bg-opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'} 
                                text-white transition-colors`}
                        >
                            <i className="fas fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
