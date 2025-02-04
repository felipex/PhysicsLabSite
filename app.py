from flask import Flask, render_template
import logging
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/agenda')
def schedule():
    return render_template('schedule.html')

@app.route('/disciplinas')
def courses():
    return render_template('courses.html')

@app.route('/recursos')
def resources():
    return render_template('resources.html')

@app.route('/simulacoes')
def simulations():
    return render_template('simulations.html')

@app.route('/simulacoes/pendulo')
def pendulum():
    return render_template('pendulum.html')

@app.route('/simulacoes/mcu-mhs')
def mcu_mhs():
    return render_template('mcu_mhs.html')

@app.route('/sobre')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)