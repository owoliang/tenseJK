from flask import Flask, render_template, request, jsonify, send_from_directory
from parser import load_story_from_txt
import os

app = Flask(__name__)

# 把故事txt利用parser.py拆分成dict
STORY = load_story_from_txt('story1.txt')

@app.route('/')
def index():
    return render_template('game.html')

# 載入節點內容
@app.route('/node')
def get_node():
    node_id = request.args.get('id', 'start')
    return jsonify(STORY[node_id])