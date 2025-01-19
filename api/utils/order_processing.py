import pandas as pd
from api.utils.genre_updates import episode_position_changes

episode_info = pd.read_excel('api/utils/episode_info.xlsx')


import ast

def parse_genres(genre_str):

    genre_str = genre_str.replace("'", "\"")
    return ast.literal_eval(f"{{ {genre_str} }}")


def update_genres(order_df):

    for index, row in order_df.iterrows():
        for episode_index in range(1, 9):  
            episode_title = row[f'Episode {episode_index}'].capitalize()

            # Parse genres
            genres = parse_genres(row[f'Genres Episode {episode_index}'])

            # Check if there are changes for this episode title and its position
            if episode_title in episode_position_changes:
                position = episode_index  
                changes = episode_position_changes[episode_title].get(position, {})

                # Apply changes to genres
                for genre in changes:
                    genres[genre] = max(0, int(genres[genre].replace('%', '')) + changes[genre])

                # Normalize the genres to make sure they add up to 1
                total = sum(genres.values())
                if total > 0:
                    # Normalize each genre by dividing by the total and rounding it to 2 decimal places
                    genres = {k: round(v / total, 2) for k, v in genres.items()}

                # Update the DataFrame with the new genres
                order_df.at[index, f'Genres Episode {episode_index}'] = str(genres)

    if order_df.empty:
        print("update_genres generated an empty DataFrame")
        raise ValueError("Empty DataFrame created in update_genres")
    
    return order_df



def process_order(order):

    processed_data = {}
    
    for i, episode in enumerate(order):

        episode_name = episode.capitalize()
        
        # Retrieve the metadata for the episode
        episode_meta = episode_info[episode_info['Title'] == episode_name].iloc[0]
        
        # Add the metadata to the dictionary
        processed_data[f"Episode {i+1}"] = episode_meta['Title']
        processed_data[f"Time period Episode {i+1}"] = episode_meta['Time period']
        processed_data[f"Genres Episode {i+1}"] = episode_meta['Genres']
        

    # Convert the dictionary to a DataFrame with a single row
    user_order = pd.DataFrame([processed_data])

    update_genres(user_order)

    if user_order.empty:
        print("process_order generated an empty DataFrame")
        raise ValueError("Empty DataFrame created in process_order")

    return user_order