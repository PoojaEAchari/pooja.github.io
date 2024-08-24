from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# Connect to MySQL database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="groceries_list"
)

# Create cursor
mycursor = mydb.cursor()

# Create table if not exists
mycursor.execute("CREATE TABLE IF NOT EXISTS items (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), quantity INT)")

# Define routes
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to get all items
@app.route('/items', methods=['GET'])
def get_items():
    mycursor.execute("SELECT * FROM items")
    items = mycursor.fetchall()
    return jsonify(items)

# API endpoint to add an item
@app.route('/items', methods=['POST'])
def add_item():
    name = request.json['name']
    quantity = request.json['quantity']
    mycursor.execute("INSERT INTO items (name, quantity) VALUES (%s, %s)", (name, quantity))
    mydb.commit()
    return jsonify({'message': 'Item added successfully'})

# API endpoint to update an item
@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    name = request.json['name']
    quantity = request.json['quantity']
    mycursor.execute("UPDATE items SET name = %s, quantity = %s WHERE id = %s", (name, quantity, item_id))
    mydb.commit()
    return jsonify({'message': 'Item updated successfully'})

# API endpoint to delete an item
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    mycursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
    mydb.commit()
    return jsonify({'message': 'Item deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
