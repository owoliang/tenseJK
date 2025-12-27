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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
