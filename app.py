# import json
# import csv
# from flask import Flask, jsonify
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.cluster import KMeans

# app = Flask(__name__)

# # Initialize variables to store recipes and TF-IDF vectorizer
# recipes = []
# vectorizer = TfidfVectorizer(stop_words='english')

# # Read recipes from CSV and preprocess
# with open('recipes.csv', newline='', encoding='utf-8') as csvfile:
#     reader = csv.reader(csvfile)
#     next(reader)  # Skip header
#     for row in reader:
#         name = row[0]
#         ingredients_str = row[-2].strip('][').replace("'", "")  # Remove square brackets and quotes
#         ingredients = [ingredient.strip() for ingredient in ingredients_str.split(',')]
#         steps_str = row[-4].strip('][').replace("'", "")  # Remove square brackets and quotes
#         steps = [step.strip() for step in steps_str.split(',')]
#         recipes.append({"name": name, "ingredients": ingredients, "steps": steps})

# # Convert recipes to strings
# recipe_texts = [' '.join(recipe['ingredients']) for recipe in recipes]

# # Fit TF-IDF Vectorizer
# X = vectorizer.fit_transform(recipe_texts)

# # Fit KMeans clustering
# kmeans = KMeans(n_clusters=2, random_state=42)
# kmeans.fit(X)

# @app.route('/')
# def index():
#     return app.send_static_file('index.html')

# @app.route('/recommend', methods=['GET'])
# def recommend_recipes():
#     # Retrieve input from file
#     selected_ingredients = get_input_from_file('sample.json')
    
#     # Transform input into TF-IDF
#     input_recipe = ' '.join(selected_ingredients)
#     input_vec = vectorizer.transform([input_recipe])
    
#     # Predict cluster of input
#     input_cluster = kmeans.predict(input_vec)[0]
    
#     # Filter recipes based on the same cluster as input and ingredient matches
#     recommended_recipes = []
#     for idx, label in enumerate(kmeans.labels_):
#         if label == input_cluster:
#             matching_ingredients = [ingredient for ingredient in selected_ingredients if ingredient in recipes[idx]['ingredients']]
#             matching_count = len(matching_ingredients)
#             if matching_count >= 2:
#                 recommended_recipes.append({
#                     "name": recipes[idx]['name'],
#                     "ingredients": recipes[idx]['ingredients'],
#                     "steps": recipes[idx]['steps'],
#                     "match_count": matching_count
#                 })
    
#     # If no matching recipes found, return an empty list
#     if not recommended_recipes:
#         return jsonify([])
    
#     return jsonify(recommended_recipes)

# def get_input_from_file(filename):
#     with open(filename, 'r') as file:
#         data = json.load(file)
#         return data.get('ingredients', [])

# if __name__ == '__main__':
#     app.run(debug=True)
import json
import csv
from flask import Flask, jsonify, render_template, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import plotly.graph_objs as go
from datetime import datetime

app = Flask(__name__)

# Initialize variables to store recipes and TF-IDF vectorizer
recipes = []
vectorizer = TfidfVectorizer(stop_words='english')

# Read recipes from CSV and preprocess
with open('recipes.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)  # Skip header
    for row in reader:
        name = row[0]
        ingredients_str = row[-2].strip('][').replace("'", "")  # Remove square brackets and quotes
        ingredients = [ingredient.strip() for ingredient in ingredients_str.split(',')]
        steps_str = row[-4].strip('][').replace("'", "")  # Remove square brackets and quotes
        steps = [step.strip() for step in steps_str.split(',')]
        recipes.append({"name": name, "ingredients": ingredients, "steps": steps})

# Convert recipes to strings
recipe_texts = [' '.join(recipe['ingredients']) for recipe in recipes]

# Fit TF-IDF Vectorizer
X = vectorizer.fit_transform(recipe_texts)

# Fit KMeans clustering
kmeans = KMeans(n_clusters=2, random_state=42)
kmeans.fit(X)

# Sample grocery data
grocery_data = [
    {"name": "Milk", "expiry_date": "2024-01-04"},
    {"name": "Bread", "expiry_date": "2024-01-10"},
    {"name": "Cream-cheese", "expiry_date": "2024-01-15"},
]

# Convert expiry dates to datetime objects
for item in grocery_data:
    item['expiry_date'] = datetime.strptime(item['expiry_date'], '%Y-%m-%d')

@app.route('/')
def index():
    # Create traces for each grocery item
    data = []
    for i, item in enumerate(grocery_data):
        data.append(go.Bar(
            x=[item['expiry_date']],
            y=[i],
            orientation='h',
            text=item['name'],
            name=item['name']
        ))

    # Layout settings
    layout = go.Layout(
        title='Grocery Expiry Timeline',
        xaxis=dict(title='Expiry Date'),
        yaxis=dict(title='Products', tickvals=list(range(len(grocery_data))), ticktext=[item['name'] for item in grocery_data]),
        barmode='stack'
    )

    # Create figure
    fig = go.Figure(data=data, layout=layout)

    # Convert figure to JSON
    graph_json = fig.to_json()

    return render_template('index.html', graph_json=graph_json)

@app.route('/recommend', methods=['GET'])
def recommend_recipes():
    # Retrieve input from file
    selected_ingredients = get_input_from_file('sample.json')
    
    # Transform input into TF-IDF
    input_recipe = ' '.join(selected_ingredients)
    input_vec = vectorizer.transform([input_recipe])
    
    # Predict cluster of input
    input_cluster = kmeans.predict(input_vec)[0]
    
    # Filter recipes based on the same cluster as input and ingredient matches
    recommended_recipes = []
    for idx, label in enumerate(kmeans.labels_):
        if label == input_cluster:
            matching_ingredients = [ingredient for ingredient in selected_ingredients if ingredient in recipes[idx]['ingredients']]
            matching_count = len(matching_ingredients)
            if matching_count >= 2:
                recommended_recipes.append({
                    "name": recipes[idx]['name'],
                    "ingredients": recipes[idx]['ingredients'],
                    "steps": recipes[idx]['steps'],
                    "match_count": matching_count
                })
    # Sort recommended recipes based on match count and total ingredients
    recommended_recipes.sort(key=lambda x: (x['match_count'] / len(x['ingredients']), x['match_count']), reverse=True)

    # If no matching recipes found, return an empty list
    if not recommended_recipes:
        return jsonify([])
    
    return jsonify(recommended_recipes)

def get_input_from_file(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
        return data.get('ingredients', [])

if __name__ == '__main__':
    app.run(debug=True)
