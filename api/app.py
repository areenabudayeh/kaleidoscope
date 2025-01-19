import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from sklearn.preprocessing import LabelEncoder
from fastapi.middleware.cors import CORSMiddleware

# Import the processing functions from order_processing.py
from api.utils.order_processing import process_order


claasification_pipeline = joblib.load('././pipelines/classification_pipeline.pkl')
regression_pipeline = joblib.load('././pipelines/regression_pipeline.pkl')
label_encoder = joblib.load('././pipelines/label_encoder.pkl')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Pydantic model for request validation
class OrderRequest(BaseModel):
    order: List[str]


# Regression model
@app.post("/save-regression")
async def save_order(order_request: OrderRequest):

    try:
        order = order_request.order
        print(f"Received order: {order}")

        processed_order = process_order(order)

        if processed_order.empty:
            raise ValueError("Processed order DataFrame is empty")


        prediction = regression_pipeline.predict(processed_order) 
        prediction = prediction[0]


        return {
            "message": "Order processed successfully!",
            "prediction": {
                "drama": round(prediction[0], 3),
                "thriller": round(prediction[1], 3),
                "action": round(prediction[2], 3)
            },
            "order": processed_order,
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}
    

# Classification model
@app.post("/save-classification")
async def save_order(order_request: OrderRequest):

    try:
        order = order_request.order
        print(f"Received order: {order}")

        processed_order = process_order(order)
        print(f"Processed order: {processed_order}")

        if processed_order.empty:
            raise ValueError("Processed order DataFrame is empty")

        prediction = claasification_pipeline.predict(processed_order) 

        # Decode the prediction from the numeric label to the original class name
        decoded_prediction = label_encoder.inverse_transform(prediction)

        print(decoded_prediction)
        return {
            "message": "Order processed successfully!",
            "prediction": decoded_prediction.tolist(),
            "order": processed_order,
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": str(e)}

# To run with Uvicorn, run the command: 
# python -m uvicorn api.app:app --reload
