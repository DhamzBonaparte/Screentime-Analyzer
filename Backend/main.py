from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel
from pathlib import Path

app = FastAPI(title="Screentime Analyzer")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent

clas_model_path = BASE_DIR / "Pickles" / "Classifier" / "xgb_model_classifier.pkl"
reg_model_path = BASE_DIR / "Pickles" / "Regression" / "xgb_regression_model.pkl"

clas_col_path = (
    BASE_DIR / "Pickles" / "Classifier" / "column_transformer_classifier.pkl"
)
reg_col_path = BASE_DIR / "Pickles" / "Regression" / "column_transformer_regressor.pkl"


clas_model = joblib.load(clas_model_path)
reg_model = joblib.load(reg_model_path)

reg_col = joblib.load(reg_col_path)
clas_col = joblib.load(clas_col_path)


class ScreentimeModelInput(BaseModel):
    age: int
    gender: str
    occupation_type: str
    chronotype: str
    bedtime_phone_minutes: int
    primary_bedtime_app: str
    screen_brightness_pct: int
    blue_light_filter_active: int
    caffeine_post_5pm_mg: int
    physical_activity_min: int
    sleep_latency_min: float
    total_sleep_hours: float
    deep_sleep_pct: float
    rem_sleep_pct: float
    morning_alarm_snoozes: int


@app.get("/")
def home():
    return {
        "message": "Welcome to the Screentime Analyzer API. Use the /predict endpoint to get predictions."
    }


@app.post("/regression-prediction")
def regression_prediction(input_data: ScreentimeModelInput):
    input_df = pd.DataFrame([input_data.dict()])
    transformed_input = reg_col.transform(input_df)
    prediction = reg_model.predict(transformed_input)
    prediction_value = (
        float(prediction.item())
        if hasattr(prediction, "item")
        else float(prediction[0])
    )
    return {"prediction": prediction_value}


@app.post("/classification-prediction")
def classification_prediction(input_data: ScreentimeModelInput):
    input_df = pd.DataFrame([input_data.dict()])
    input_df["is_Caffiene>0"] = (input_df["caffeine_post_5pm_mg"] > 0).astype(int)
    input_df["is_activity_0"] = (input_df["physical_activity_min"] == 0).astype(int)
    transformed_input = clas_col.transform(input_df)
    prediction = clas_model.predict(transformed_input)
    pred_val = (
        prediction.item() if hasattr(prediction, "item") else prediction[0]
    )
    if pred_val == 0:
        class_name = "Mild Deficit"
        status_message = "You have a slight sleep deficit. Consider winding down earlier."
        risk_level = "Moderate"
    elif pred_val == 1:
        class_name = "Moderate Debt"
        status_message = "Noticeable sleep debt building up. Try reducing late-night screen time."
        risk_level = "High"
    elif pred_val == 2:
        class_name = "Optimal Recovery"
        status_message = "Great job! Your schedule supports healthy sleep recovery."
        risk_level = "Low"
    elif pred_val == 3:
        class_name = "Severe Sleep Debt"
        status_message = "Critical sleep debt detected! Prioritize rest and limit caffeine post-5pm."
        risk_level = "Critical"
    else:
        class_name = "Unknown"
        status_message = "Sleep status analyzed successfully."
        risk_level = "Unknown"

    # Optional probability score
    probability = None
    if hasattr(clas_model, "predict_proba"):
        probability = float(clas_model.predict_proba(transformed_input).max())

    return {
        "predicted_index": int(pred_val),
        "predicted_class": class_name,
        "status_message": status_message,
        "risk_level": risk_level,
        "confidence": probability
    }
