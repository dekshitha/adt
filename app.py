import json
import csv
from flask import Flask, jsonify, send_from_directory
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

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
        # Extract and split ingredients from the string
        ingredients_str = row[-2].strip('][').replace("'", "")  # Corrected index to point to the second-to-last column
        ingredients = [ingredient.strip() for ingredient in ingredients_str.split(',')]
        recipes.append({"name": name, "ingredients": ingredients})

# Convert recipes to strings
recipe_texts = [' '.join(recipe['ingredients']) for recipe in recipes]

# Fit TF-IDF Vectorizer
X = vectorizer.fit_transform(recipe_texts)

# Fit KMeans clustering
kmeans = KMeans(n_clusters=2, random_state=42)
kmeans.fit(X)

@app.route('/')
def index():
    return app.send_static_file('index.html')

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
            if len(matching_ingredients) >= 2:
                recommended_recipes.append({"name": recipes[idx]['name'], "ingredients": recipes[idx]['ingredients'], "matched_ingredients": len(matching_ingredients)})
                
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
