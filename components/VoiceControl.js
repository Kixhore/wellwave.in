function VoiceControl({ onVoiceInput, isListening, onToggleVoice, disabled }) {
    const [isProcessing, setIsProcessing] = React.useState(false);

    React.useEffect(() => {
        // Preload speech synthesis voices when component mounts
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    const handleVoiceToggle = async () => {
        try {
            setIsProcessing(true);
            await onToggleVoice();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div data-name="voice-control" className="flex items-center space-x-2">
            <button
                onClick={handleVoiceToggle}
                disabled={disabled || isProcessing}
                className={`p-2 rounded-full transition-all ${
                    disabled || isProcessing ? 'bg-gray-600 bg-opacity-50 cursor-not-allowed' :
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                title={disabled ? "Voice recognition unavailable" : isListening ? "Stop speaking" : "Start speaking"}
            >
                <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-white text-xs`}></i>
            </button>
            {isListening && (
                <div className="text-xs text-gray-400 animate-pulse">
                    Listening...
                </div>
            )}
            {isProcessing && !isListening && (
                <div className="text-xs text-gray-400">
                    Processing...
                </div>
            )}
        </div>
    );
}
