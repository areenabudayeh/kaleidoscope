# Custom transformer for Genre columns
import pandas as pd
import ast
from sklearn.base import BaseEstimator, TransformerMixin
from datetime import datetime
from dateutil.relativedelta import relativedelta
import re

class GenresTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, columns):
        self.columns = columns

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_transformed = X.copy()

        for col in self.columns:
            try:
                # Parse and normalize the JSON-like strings
                expanded_col = pd.json_normalize(
                    X_transformed[col].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
                ).add_prefix(f'{col} ')
                
                # Ensure proper alignment
                expanded_col.index = X_transformed.index

                # Insert the new columns into the DataFrame
                col_index = X_transformed.columns.get_loc(col)
                for i, new_col in enumerate(expanded_col.columns):
                    X_transformed.insert(col_index + i, new_col, expanded_col[new_col])

                # Drop the original column
                X_transformed = X_transformed.drop(columns=[col])

            except Exception as e:
                print(f"Error processing column '{col}': {e}")
                print(X_transformed[col].head())  # Print the problematic rows
                raise

        return X_transformed



# Custom transformer for Time Period columns

class TimePeriodTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, columns, reference_date=datetime(2023, 1, 1)):

        # Custom transformer to convert time period descriptions to days relative to a reference date (The heist episode).

        self.columns = columns
        self.reference_date = reference_date

    def fit(self, X, y=None):
        # No fitting needed, as this transformer doesn't learn from data
        return self

    def transform(self, X):

        X_transformed = X.copy()

        for col in self.columns:
            if col not in X_transformed.columns:
                raise KeyError(f"Column {col} not found in the DataFrame!")

            # Apply the conversion function to the specified columns
            X_transformed[col] = X_transformed[col].apply(self._convert_to_days)

        return X_transformed

    def _convert_to_days(self, time_period):
        
        # Method to convert a single time period string to days.
        
        time_period = time_period.lower()
        delta_days = 0

        if 'the morning after' in time_period:
            delta_days = 1

        elif time_period.strip() == 'the heist':
            delta_days = 0

        else:
            # Extract number and unit using regex
            match = re.match(r'(\d+)\s*(months?|weeks?|days?|years?)\s*(before|after)', time_period)
            if match:
                num, unit, direction = match.groups()
                num = int(num)

                if 'month' in unit:
                    delta = relativedelta(months=num)
                elif 'week' in unit:
                    delta = relativedelta(weeks=num)
                elif 'day' in unit:
                    delta = relativedelta(days=num)
                elif 'year' in unit:
                    delta = relativedelta(years=num)

                if 'before' in direction:
                    target_date = self.reference_date - delta
                else:
                    target_date = self.reference_date + delta

                # Calculate days difference
                delta_days = (target_date - self.reference_date).days

        return delta_days
