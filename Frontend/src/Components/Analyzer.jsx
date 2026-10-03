import { useState } from "react";
import "./Analyzer.css";
import axios from "axios";

export default function Analyzer() {
  const [formData, setFormData] = useState({
    age: 25,
    gender: "Female",
    occupation_type: "Corporate 9-to-5",
    chronotype: "Morning Lark",
    bedtime_phone_minutes: 15,
    primary_bedtime_app: "Messaging / Chat",
    screen_brightness_pct: 20,
    blue_light_filter_active: 1,
    caffeine_post_5pm_mg: 0,
    physical_activity_min: 60,
    sleep_latency_min: 5.0,
    total_sleep_hours: 8.5,
    deep_sleep_pct: 25.0,
    rem_sleep_pct: 28.0,
    morning_alarm_snoozes: 0,
  });

  const [activeTab, setActiveTab] = useState("regression");
  const [regressionResult, setRegressionResult] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Age: 18 to 65
    if (formData.age < 18 || formData.age > 65) {
      errors.age = "Age must be between 18 and 65.";
    }

    // Screen Brightness: 10 to 100
    if (
      formData.screen_brightness_pct < 10 ||
      formData.screen_brightness_pct > 100
    ) {
      errors.screen_brightness_pct = "Brightness must be between 10% and 100%.";
    }

    // Blue light: 0 or 1
    if (
      formData.blue_light_filter_active !== 0 &&
      formData.blue_light_filter_active !== 1
    ) {
      errors.blue_light_filter_active = "Blue light filter must be 0 or 1.";
    }

    const positiveNumberRegex = /^\d+(\.\d+)?$/;
    if (
      !positiveNumberRegex.test(formData.bedtime_phone_minutes) ||
      formData.bedtime_phone_minutes < 0
    ) {
      errors.bedtime_phone_minutes = "Must be a valid positive number.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (activeTab === "regression") {
        const response = await axios.post(
          "http://127.0.0.1:8000/regression-prediction",
          formData,
        );
        setRegressionResult(response.data);
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/classification-prediction",
          formData,
        );
        setClassificationResult(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to connect to the backend server. Make sure FastAPI is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer-wrapper">
      <div className="analyzer-card">
        <header className="analyzer-header">
          <div className="header-badge">AI Health Intelligence</div>
          <h1>Screentime & Sleep Analyzer</h1>
          <p className="subtitle">
            Advanced behavioral insight and risk evaluation metrics
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            type="button"
            className={`tab-pill ${activeTab === "regression" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("regression");
              setError(null);
            }}
          >
            <span>📈</span> Regression Model
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === "classification" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("classification");
              setError(null);
            }}
          >
            <span>🏷️</span> Classification Model
          </button>
        </div>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-section-title">
            {activeTab === "regression"
              ? "Input Parameters for Screentime Prediction"
              : "Input Parameters for Sleep Debt Evaluation"}
          </div>

          <div className="input-grid">
            {/* Age */}
            <div className="input-group">
              <label>Age (18-65):</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="65"
              />
              {validationErrors.age && (
                <span className="field-error">{validationErrors.age}</span>
              )}
            </div>

            {/* Gender */}
            <div className="input-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>

            {/* Occupation Type */}
            <div className="input-group">
              <label>Occupation Type:</label>
              <select
                name="occupation_type"
                value={formData.occupation_type}
                onChange={handleChange}
              >
                <option value="Corporate 9-to-5">Corporate 9-to-5</option>
                <option value="Remote Tech">Remote Tech</option>
                <option value="Student">Student</option>
                <option value="Healthcare / Shift Worker">
                  Healthcare / Shift Worker
                </option>
                <option value="Freelance / Creative">
                  Freelance / Creative
                </option>
              </select>
            </div>

            {/* Chronotype */}
            <div className="input-group">
              <label>Chronotype:</label>
              <select
                name="chronotype"
                value={formData.chronotype}
                onChange={handleChange}
              >
                <option value="Intermediate">Intermediate</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Morning Lark">Morning Lark</option>
              </select>
            </div>

            {/* Bedtime Phone Minutes */}
            <div className="input-group">
              <label>Bedtime Phone Minutes:</label>
              <input
                type="number"
                name="bedtime_phone_minutes"
                value={formData.bedtime_phone_minutes}
                onChange={handleChange}
              />
              {validationErrors.bedtime_phone_minutes && (
                <span className="field-error">
                  {validationErrors.bedtime_phone_minutes}
                </span>
              )}
            </div>

            {/* Primary Bedtime App */}
            <div className="input-group">
              <label>Primary Bedtime App:</label>
              <select
                name="primary_bedtime_app"
                value={formData.primary_bedtime_app}
                onChange={handleChange}
              >
                <option value="TikTok / Reels">TikTok / Reels</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram / Reddit">Instagram / Reddit</option>
                <option value="Streaming (Netflix/Hulu)">
                  Streaming (Netflix/Hulu)
                </option>
                <option value="Messaging / Chat">Messaging / Chat</option>
              </select>
            </div>

            {/* Screen Brightness */}
            <div className="input-group">
              <label>Screen Brightness % (10-100):</label>
              <input
                type="number"
                name="screen_brightness_pct"
                value={formData.screen_brightness_pct}
                onChange={handleChange}
                min="10"
                max="100"
              />
              {validationErrors.screen_brightness_pct && (
                <span className="field-error">
                  {validationErrors.screen_brightness_pct}
                </span>
              )}
            </div>

            {/* Blue Light Filter */}
            <div className="input-group">
              <label>Blue Light Filter Active (0 or 1):</label>
              <select
                name="blue_light_filter_active"
                value={formData.blue_light_filter_active}
                onChange={handleChange}
              >
                <option value={0}>0 (Inactive)</option>
                <option value={1}>1 (Active)</option>
              </select>
            </div>

            {/* Caffeine Post-5PM */}
            <div className="input-group">
              <label>Caffeine Post-5PM (mg):</label>
              <input
                type="number"
                name="caffeine_post_5pm_mg"
                value={formData.caffeine_post_5pm_mg}
                onChange={handleChange}
              />
            </div>

            {/* Physical Activity */}
            <div className="input-group">
              <label>Physical Activity (min):</label>
              <input
                type="number"
                name="physical_activity_min"
                value={formData.physical_activity_min}
                onChange={handleChange}
              />
            </div>

            {/* Sleep Latency */}
            <div className="input-group">
              <label>Sleep Latency (min):</label>
              <input
                type="number"
                step="0.1"
                name="sleep_latency_min"
                value={formData.sleep_latency_min}
                onChange={handleChange}
              />
            </div>

            {/* Total Sleep Hours */}
            <div className="input-group">
              <label>Total Sleep Hours:</label>
              <input
                type="number"
                step="0.1"
                name="total_sleep_hours"
                value={formData.total_sleep_hours}
                onChange={handleChange}
              />
            </div>

            {/* Deep Sleep % */}
            <div className="input-group">
              <label>Deep Sleep %:</label>
              <input
                type="number"
                step="0.1"
                name="deep_sleep_pct"
                value={formData.deep_sleep_pct}
                onChange={handleChange}
              />
            </div>

            {/* REM Sleep % */}
            <div className="input-group">
              <label>REM Sleep %:</label>
              <input
                type="number"
                step="0.1"
                name="rem_sleep_pct"
                value={formData.rem_sleep_pct}
                onChange={handleChange}
              />
            </div>

            {/* Morning Alarm Snoozes */}
            <div className="input-group">
              <label>Morning Alarm Snoozes:</label>
              <input
                type="number"
                name="morning_alarm_snoozes"
                value={formData.morning_alarm_snoozes}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-action-btn"
          >
            {loading
              ? "Processing Inference..."
              : activeTab === "regression"
                ? "Calculate Screentime Projection"
                : "Evaluate Sleep Risk Category"}
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}

        {/* Results Console */}
        <div className="results-panel">
          <div className="results-header">
            <span className="console-dot"></span> Output Terminal
          </div>

          {activeTab === "regression" && (
            <div className="output-content">
              {regressionResult ? (
                <div className="metric-display animate-fade">
                  <span className="metric-label">
                    Predicted Screentime Target
                  </span>
                  <span className="metric-value">
                    {regressionResult.prediction?.toFixed(2)} <small>hrs</small>
                  </span>
                </div>
              ) : (
                <p className="placeholder-note">
                  Submit parameters above to execute the regression inference
                  pipeline.
                </p>
              )}
            </div>
          )}

          {activeTab === "classification" && (
            <div className="output-content">
              {classificationResult ? (
                <div className="classification-result-card animate-fade">
                  <div className="class-row">
                    <span className="metric-label">Predicted Status:</span>
                    <strong className="class-badge">
                      {classificationResult.predicted_class}
                    </strong>
                  </div>
                  <div className="class-row">
                    <span className="metric-label">Risk Tier:</span>
                    <span
                      className={`risk-badge risk-${classificationResult.risk_level?.toLowerCase()}`}
                    >
                      {classificationResult.risk_level}
                    </span>
                  </div>
                  <p className="status-description">
                    "{classificationResult.status_message}"
                  </p>
                </div>
              ) : (
                <p className="placeholder-note">
                  Submit parameters above to execute the risk classification
                  pipeline.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Professional Footer Credit */}
        <footer className="analyzer-footer-credit">
          Made with <span className="heart-icon">❤️</span> by{" "}
          <strong>
            <a
              href="https://www.linkedin.com/in/sulav-dhami/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Sulav Dhami
            </a>
          </strong>
        </footer>
      </div>
    </div>
  );
}
