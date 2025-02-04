from flask import Flask, render_template
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

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

@app.route('/sobre')
def about():
    return render_template('about.html')