from flask import Flask, request, redirect, url_for, render_template, make_response
from werkzeug.utils import secure_filename
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limite de 16 MB

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'cadastros'
}

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT * FROM users')
    items = cursor.fetchall()

    # Adiciona um timestamp atual para cada item
    current_time = int(datetime.now().timestamp())  # Gera um timestamp
    
    for item in items:
        item['timestamp'] = current_time  # Adiciona o timestamp a cada item

    cursor.close()
    conn.close()

    return render_template('index.html', items=items)


@app.route('/cadastro')
def cadastro():
    response = make_response(render_template('cadastro.html'))
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response

@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    descrip = request.form['descrip']
    price = request.form['price']
    image = request.files.get('image')

    if image and allowed_file(image.filename):
        image_filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image.save(image_path)
    else:
        image_filename = None  # Ou retorne um erro informando que a extensão não é permitida

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute('''INSERT INTO users (name, descrip, price, image) VALUES (%s, %s, %s, %s)''', 
                   (name, descrip, price, image_filename))

    conn.commit()
    cursor.close()
    conn.close()

    return redirect(url_for('data'))

@app.route('/data')
def data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('data.html', users=users)


if __name__ == '__main__':
    app.run(debug=True)
