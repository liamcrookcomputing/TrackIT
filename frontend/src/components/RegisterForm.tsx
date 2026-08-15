import { useState } from "react";

function RegisterForm({
        onRegister,
        onLogin,
        onClose
    }: {
        onRegister: () => void;
        onLogin: () => void;
        onClose: () => void;
    }) {

    const API_URL = import.meta.env.VITE_API_URL;
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/register`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Unable to register");
                return;
            }

            onRegister();

        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm"
            >
                <h1 className="text-3xl font-bold text-gray-900">
                    Create an account
                </h1>

                <p className="mt-2 text-gray-500">
                    Create your TrackIT account.
                </p>

                {error && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                <div className="mt-6">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-1 w-full rounded-lg border bg-white px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-1 w-full rounded-lg border bg-white px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                <button
                    type="button"
                    onClick={onLogin}
                    className="mt-4 w-full text-sm text-blue-500 hover:text-blue-600"
                >
                    Already have an account? Login
                </button>
            </form>
        </main>
    );
}

export default RegisterForm;