function Sidebar({ onNewChat }) {
    return (
        <div data-name="sidebar" className="bg-gray-900 text-white w-64 p-4 h-screen">
            <button
                data-name="new-chat-button"
                onClick={onNewChat}
                className="w-full flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-3 mb-4"
            >
                <i className="fas fa-plus"></i>
                <span>New Chat</span>
            </button>
            <div data-name="sidebar-footer" className="absolute bottom-4 left-4 right-4">
                <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <i className="fas fa-user"></i>
                        </div>
                        <span>User</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
