from flask import Flask, render_template, request
import plotly.graph_objs as go
from datetime import datetime

app = Flask(__name__)

# Sample grocery data
grocery_data = [
    {"name": "Milk", "expiry_date": "04-01-2024"},
    {"name": "Bread", "expiry_date": "10-01-2024"},
    {"name": "Cream-cheese", "expiry_date": "15-01-2024"},
    
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

    return render_template('manage.html', graph_json=graph_json)

if __name__ == '__main__':
    app.run(debug=True)
