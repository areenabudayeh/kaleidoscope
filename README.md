# Kaleidoscope: Exploring Genre Perception in Non-linear Narratives

## Overview
*Kaleidoscope*, a TV series known for its unique non-linear storytelling format, where
episodes can be viewed in any order, influencing the viewer's understanding of the overall
plot. This structure shows the relationship between episode sequencing and genre
classification, which results in varied perceptions of the storyline based on the sequence
chosen.  
The series consist of 8 episodes, each named after a color (e.g., Yellow, Blue,
Green).
An example would be watching the series in episode sequence such as “Yellow,” “Green,” “Blue,” “Orange,” “Violet,” “Pink,” “Red,” and 
“White” might yield a dominant classification of Action and genre probabilities like 40% 
action, 21% drama, and 39% thriller.  
This structure presents an interesting challenge of *how does the order of episodes affect
the perceived genre?*

By leveraging *Machine Learning*, the project explores:
- **Classification**: Identifying the dominant genre (action, drama, thriller) for a sequence.
- **Regression**: Predicting percentage contributions of each genre for a sequence.

## Key Features
- **Custom Dataset**: Includes unique episode orders derived from permutations of *Kaleidoscope* episodes, enriched with metadata from web scraping and APIs.
- **Machine Learning Models**:
  - **Classification**: Achieved 99.32% accuracy using a Random Forest Classifier.
  - **Regression**: Predicted genre distributions with an R² of 99.90% using a Random Forest Regressor.
- **Interactive Website**: Users can experiment with episode arrangements and view genre predictions and classifications dynamically.

## Dataset
- **Source**: Scraped from Netflix and integrated with additional metadata from TMDB API.
- **Structure**:
  - Episode Names (categorical)
  - Genre Weights (numeric)
  - Time Periods (categorical)
- **Preprocessing**:
  - Feature engineering for genre transformation, time period encoding, and episode name encoding.
  - Stratified data splitting for robust model evaluation.

## Methodology
1. **Feature Engineering**: Extracted meaningful patterns from episode sequencing and genre interactions.
2. **Models Used**:
   - Classification: Random Forest, Logistic Regression, K-Nearest Neighbors.
   - Regression: Random Forest Regressor, Decision Tree, Linear Regression.
3. **Evaluation Metrics**:
   - Classification: Accuracy, Precision, Recall, F1-Score.
   - Regression: R², Mean Squared Error (MSE).

## Results
- **Classification**:
  - Accuracy: 99.32%
  - Robust against overfitting.
- **Regression**:
  - R²: 99.90%
  - Accurate predictions with low error (MSE near 0.0000).
- **Visual Insights**: Confusion matrices and residual plots demonstrate model effectiveness.

## Interactive Website
The project includes a user-friendly website where users can:
1. Arrange episodes in any order using a drag-and-drop interface.
2. Analyze genre predictions and classifications dynamically.
3. Explore predefined viewing orders, such as Netflix-inspired arrangements.
