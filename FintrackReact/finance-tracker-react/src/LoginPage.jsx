import { useEffect, useState } from "react";

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    useEffect(() => {
        generateCaptcha();
    }, []);

    function generateCaptcha() {
        const possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let newCaptcha = "";

        for (let i = 0; i < 6; i++) {
            newCaptcha += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }

        setCaptcha(newCaptcha);
        setCaptchaInput("");
    }

    function isValidPassword(pass) {
        const minLength = 8;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const numberRegex = /[0-9]/;

        if (pass.length < minLength) {
            return "Password must be at least 8 characters long.";
        }

        if (!specialCharRegex.test(pass)) {
            return "Password must contain at least one special character.";
        }

        if (!numberRegex.test(pass)) {
            return "Password must contain at least one number.";
        }

        return "";
    }

    function checkLogin() {
        const passwordError = isValidPassword(password);

        if (passwordError) {
            setLoginMessage(passwordError);
            return;
        }

        if (captchaInput !== captcha) {
            setLoginMessage("Invalid CAPTCHA. Please try again.");
            return;
        }

        if (username === "admin" && password === "admin@123") {
            setLoginMessage("");
            onLoginSuccess();
        } else {
            setLoginMessage("Invalid username or password. Please try again.");
        }
    }

    return (
        <div className="bg-light d-flex flex-column min-vh-100">
            <div className="container my-auto py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4 bg-white p-4 rounded shadow-sm">
                        <h1 className="text-center mb-4">Login- Wealth Wise</h1>

                        <form>
                            <div className="mb-3">
                                <label htmlFor="user" className="form-label">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    id="user"
                                    name="user"
                                    required
                                    className="form-control"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                            </div>

                            <div className="mb-3 position-relative">
                                <label htmlFor="pass" className="form-label">
                                    Password:
                                </label>

                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="pass"
                                        name="pass"
                                        required
                                        className="form-control"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />

                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <i className="fa-solid fa-eye-slash"></i>
                                        ) : (
                                            <i className="fa-solid fa-eye"></i>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="remember-me"
                                    name="remember-me"
                                />
                                <label className="form-check-label" htmlFor="remember-me">
                                    Remember Me
                                </label>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="captcha" className="form-label">
                                    Captcha:
                                </label>

                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="captcha"
                                        name="captcha"
                                        placeholder="Enter Captcha"
                                        required
                                        className="form-control"
                                        value={captchaInput}
                                        onChange={(event) => setCaptchaInput(event.target.value)}
                                    />

                                    <span className="input-group-text">{captcha}</span>

                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={generateCaptcha}
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            <div className="d-grid">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={checkLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        <div className="mt-4 text-center">
                            <h2>Social Media Login</h2>

                            <a href="#">
                                <i className="fa fa-envelope fa-2x social-icon"></i>
                            </a>

                            <a href="#">
                                <i className="fa-brands fa-twitter fa-2x social-icon"></i>
                            </a>

                            <a href="#">
                                <i className="fab fa-facebook fa-2x social-icon"></i>
                            </a>
                        </div>

                        {loginMessage && (
                            <p className="mt-3 text-center text-danger">{loginMessage}</p>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <p>&copy; 2025 Wealth Wise - Personal Finance Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LoginPage;