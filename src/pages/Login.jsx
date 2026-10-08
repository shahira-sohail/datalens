import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart3, Mail, Lock, ArrowRight } from "lucide-react";
import "./Login.css";
import API_BASE_URL from "../config";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed.");
      }

      sessionStorage.setItem("datalensToken", result.token);

      sessionStorage.setItem(
        "datalensUser",
        JSON.stringify(result.user)
      );

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <BarChart3 size={22} />
          </div>

          <div>
            <strong>DataLens</strong>
            <span>Analytics workspace</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="auth-card">

          <div className="auth-card-header">
            <h1>Welcome back</h1>

            <p>
              Sign in to continue to your DataLens workspace.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <div className="input-wrapper">
                <Mail size={17} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <Lock size={17} />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && <ArrowRight size={17} />}
            </button>

          </form>

          {/* Register */}
          <div className="auth-footer">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create an account
            </Link>
          </div>

        </div>

        <p className="auth-copyright">
          DataLens · Automated data analysis and visualization
        </p>

      </div>
    </div>
  );
}

export default Login;