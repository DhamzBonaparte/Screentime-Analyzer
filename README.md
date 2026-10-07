# 🌙 Screentime & Sleep Analyzer

An AI-powered full-stack web application designed to evaluate behavioral metrics, project screen time usage, and classify sleep debt risk tiers using machine learning models and FastAPI backend.

---

## ✨ Features

- **Dual-Model Inference Dashboard:** Switch seamlessly between a **Regression Model** (to predict next day fatigue score) and a **Classification Model** (to evaluate sleep health risk tiers).
- **Comprehensive Behavioral Metrics:** Analyzes 15 distinct user parameters including age, occupation, chronotype, bedtime phone usage, app preferences, screen brightness, blue light filter status, caffeine intake, physical activity, and sleep architecture percentages.
- **Strict Frontend Validation:** Built-in constraints and validation rules for secure, accurate user inputs.
- **Modern Dark-Mode UI:** Designed with a sleek, tech-forward aesthetic, smooth transitions, and responsive layout styling.

---

## 🛠️ Tech Stack

### **Frontend**
- **React** (with Vite)
- **Axios** for API requests
- Custom **CSS** (Modern CSS variables, Flexbox/Grid, glowing accents)
 
### **Backend**
- **FastAPI** (Python framework for high-performance API endpoints)
- **Uvicorn** (ASGI Server)
- **scikit-learn** / **XGBoost** (Machine Learning Pipelines)
- **Joblib** (Model serialization) 
- **Pickle** (Model serializaton)
 
---

## 📁 Project Structure

```text
screentime-sleep-analyzer/
├── backend/                  # FastAPI Backend
│   ├── main.py               # API endpoints & ML inference logic
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── Analyzer.jsx      # Main application component with tabs
│   │   └── Analyzer.css      # Professional styling & animations
│   ├── package.json          # Node dependencies
│   └── vite.config.js
├── Pickles/                  # Model weights & preprocessors
│   ├── Classifier/
│   │   ├── xgb_model_classifier.pkl
│   │   └── column_transformer_classifier.pkl
│   └── Regression/
│       ├── xgb_regression_model.pkl
│       └── column_transformer_regressor.pkl
└── README.md
``` 