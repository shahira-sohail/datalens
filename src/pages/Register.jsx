import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import {
  BarChart3,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Registration failed."
        );
      }

      setSuccess("Account created successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
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

        {/* Register Card */}
        <div className="auth-card">

          <div className="auth-card-header">
            <h1>Create your account</h1>

            <p>
              Start analyzing and understanding your data
              with DataLens.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <div className="input-wrapper">
                <User size={17} />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="register-email">Email</label>

              <div className="input-wrapper">
                <Mail size={17} />

                <input
                  id="register-email"
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
              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-wrapper">
                <Lock size={17} />

                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
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

            {/* Success */}
            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </span>

              {!loading && <ArrowRight size={17} />}
            </button>

          </form>

          {/* Login link */}
          <div className="auth-footer">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
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

export default Register;