import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://sosika-backend.onrender.com/api/auth/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('admin_token', data.token);

            // Success animation before redirect
            setIsLoading(false);
            showSuccessMessage();
            window.location.href = '/dashboard'; // Redirect to dashboard
        } catch (err: any) {
            console.error('Login error', err);
            setIsLoading(false);
            showErrorMessage(err.message);
        }
    };

    const showSuccessMessage = () => {
        const notification: any = document.getElementById('notification');
        notification.textContent = 'Login successful! Redirecting to dashboard...';
        notification.className = 'bg-green-500 text-white px-4 py-2 rounded-md fixed top-4 shadow-lg transition-opacity duration-500 opacity-100';

        setTimeout(() => {
            notification.className += ' opacity-0';
        }, 2000);
    };

    const showErrorMessage = (message: any) => {
        const notification: any = document.getElementById('notification');
        notification.textContent = message || 'Something went wrong. Please try again.';
        notification.className = 'bg-red-500 text-white px-4 py-2 rounded-md fixed top-4 shadow-lg transition-opacity duration-500 opacity-100';

        setTimeout(() => {
            notification.className += ' opacity-0';
        }, 3000);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4">
            <div id="notification" className="opacity-0"></div>

            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="flex justify-center mb-2">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center text-white tracking-wide">SOSIKA ADMIN</h1>
                    <p className="text-center text-blue-200 mt-1">Secure Operations System</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-700 block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-100"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-gray-700 block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-100"
                                placeholder="••••••••"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="focus:outline-none text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${isLoading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2"></div>

                    <div className="text-center text-xs text-gray-500">
                        <p>System access restricted to authorized personnel only</p>
                        <p className="mt-1">Unauthorized access attempts will be logged and reported</p>
                    </div>
                </form>
            </div>

            {/* Animated background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
};

export default Login;