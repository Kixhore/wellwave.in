function ChatMessage({ message, isAi, userName, showResponseOptions }) {
    const [selectedOption, setSelectedOption] = React.useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const renderResponseOptions = () => {
        const options = [
            { id: 'helpful', label: 'Helpful', icon: 'fa-check' },
            { id: 'unclear', label: 'Unclear', icon: 'fa-question' },
            { id: 'incorrect', label: 'Incorrect', icon: 'fa-times' }
        ];

        return (
            <div className="mt-2 flex space-x-2">
                {options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1
                            ${selectedOption === option.id 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        <i className={`fas ${option.icon} text-xs`}></i>
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div data-name="chat-message" className={`p-3 ${isAi ? 'bg-opacity-10 bg-blue-900' : 'bg-opacity-10 bg-purple-900'} relative z-10`}>
            <div className="max-w-3xl mx-auto flex space-x-3">
                {isAi ? (
                    <div data-name="doctor-avatar" className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <i className="fas fa-user-md text-white text-lg"></i>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-400 animate-pulse opacity-50"></div>
                    </div>
                ) : (
                    <div data-name="user-avatar" className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                        <i className="fas fa-user text-white text-sm"></i>
                    </div>
                )}
                <div data-name="message-content" className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm ${isAi ? 'text-blue-400' : 'text-purple-400'}`}>
                            {isAi ? 'Dr. WellWave' : userName}
                        </span>
                        {isAi && (
                            <span className="bg-blue-500 bg-opacity-20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                                Medical AI
                            </span>
                        )}
                    </div>
                    <p className="text-gray-100 text-sm whitespace-pre-wrap">{message}</p>
                    {isAi && (
                        <div className="mt-2 text-xs text-gray-400 flex items-center">
                            <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-30 rounded-full px-3 py-1">
                                <i className="fas fa-shield-alt text-blue-400"></i>
                                <span>Medical information for guidance only</span>
                            </div>
                        </div>
                    )}
                    {showResponseOptions && isAi && renderResponseOptions()}
                </div>
            </div>
        </div>
    );
}
