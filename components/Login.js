function Login({ onToggleAuth, onLogin }) {
    const [formData, setFormData] = React.useState({ email: '', password: '' });
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError('');

            const success = await onLogin(formData.email, formData.password);
            if (!success) {
                setError('Invalid email or password');
            }
        } catch (error) {
            reportError(error);
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div data-name="login-container" className="auth-container flex items-center justify-center px-4">
            <div className="auth-form w-full max-w-md p-8 rounded-2xl">
                <div className="text-center mb-8">
                    <i className="fas fa-wave-square text-4xl text-blue-400 mb-4"></i>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to WellWave</h1>
                    <p className="text-gray-400">Your Personal Medical Assistant</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="auth-input w-full px-4 py-3 rounded-lg text-white"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="auth-input w-full px-4 py-3 rounded-lg text-white"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`pulse-button w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={onToggleAuth}
                            className="text-blue-400 hover:text-blue-300"
                            disabled={isLoading}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
