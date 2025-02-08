function Header({ onLogout, userData, showResponseOptions, onToggleResponseOptions, isTalkbackEnabled, onToggleTalkback }) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        onLogout();
    };

    return (
        <div data-name="header" className="bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-50 text-white py-2 px-4 shadow">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-wave-square text-xl text-blue-400"></i>
                        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            WellWave
                        </h1>
                    </div>
                    <button
                        onClick={onToggleTalkback}
                        className={`px-3 py-1 text-xs rounded-full flex items-center space-x-2 transition-all
                            ${isTalkbackEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                        title={isTalkbackEnabled ? 'Disable voice feedback' : 'Enable voice feedback'}
                    >
                        <i className={`fas ${isTalkbackEnabled ? 'fa-volume-up' : 'fa-volume-mute'} text-xs`}></i>
                        <span>Voice {isTalkbackEnabled ? 'On' : 'Off'}</span>
                    </button>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 bg-opacity-20 bg-white rounded px-2 py-1 hover:bg-opacity-30 transition-all"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <i className="fas fa-user-circle text-white text-xs"></i>
                        </div>
                        <span className="text-xs text-gray-200">{userData?.objectData?.name}</span>
                        <i className={`fas fa-chevron-down text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-gray-800 bg-opacity-90 rounded shadow-lg py-1 z-50">
                            <div className="px-3 py-2 border-b border-gray-700 border-opacity-50">
                                <p className="text-xs text-gray-400">Signed in as</p>
                                <p className="text-xs text-white truncate">{userData?.objectData?.email}</p>
                            </div>
                            <button
                                onClick={handleLogoutClick}
                                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-gray-700 hover:bg-opacity-50 flex items-center space-x-2"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 bg-opacity-90 rounded p-4 max-w-sm w-full mx-4">
                        <h2 className="text-lg font-semibold text-white mb-3">Sign Out</h2>
                        <p className="text-sm text-gray-300 mb-4">Are you sure you want to sign out?</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
