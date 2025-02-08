function SignUp({ onToggleAuth, onSignUp }) {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError('');

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const success = await onSignUp(formData.name, formData.email, formData.password);
            if (!success) {
                setError('Sign up failed. Email might already be registered.');
            }
        } catch (error) {
            reportError(error);
            setError('Sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div data-name="signup-container" className="auth-container flex items-center justify-center px-4">
            <div className="auth-form w-full max-w-md p-8 rounded-2xl">
                <div className="text-center mb-8">
                    <i className="fas fa-wave-square text-4xl text-blue-400 mb-4"></i>
                    <h1 className="text-3xl font-bold text-white mb-2">Join WellWave</h1>
                    <p className="text-gray-400">Create your medical assistant account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="auth-input w-full px-4 py-3 rounded-lg text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                disabled={isLoading}
                                required
                            />
                        </div>
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
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="auth-input w-full px-4 py-3 rounded-lg text-white"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={onToggleAuth}
                            className="text-blue-400 hover:text-blue-300"
                            disabled={isLoading}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
