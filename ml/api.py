from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os

app = FastAPI(title="WhiteRose ML Recommendation API")

# Setup CORS for Next.js and Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any domain (Vercel, Netlify, localhost) to access the recommendations
    allow_credentials=False, # Must be False when allow_origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML data on startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(BASE_DIR, "products_for_ml.csv"))
similarity_matrix = joblib.load(os.path.join(BASE_DIR, "similarity_matrix.pkl"))

@app.get("/recommend/{product_id}")
def recommend(product_id: str):
    # Check if product exists
    if product_id not in df["product_id"].values:
        raise HTTPException(status_code=404, detail="Product not found in dataset")
        
    # Find the index of the product
    idx = df.index[df["product_id"] == product_id].tolist()[0]
    
    # Get similarity scores for this product
    sim_scores = list(enumerate(similarity_matrix[idx]))
    
    # Sort by similarity, descending
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top 4 recommendations (excluding itself)
    recommendations = []
    for i, score in sim_scores:
        if i == idx:
            continue
            
        rec_id = df.iloc[i]["product_id"]
        recommendations.append({
            "product_id": str(rec_id),
            "similarity": round(float(score), 2)
        })
        
        if len(recommendations) == 4:
            break
            
    return {
        "product_id": product_id,
        "recommendations": recommendations
    }
