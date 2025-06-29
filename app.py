from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# VPN data
VPN_DATA = [
    {
        "provider": "NordVPN Premium",
        "features": [
            "Military-grade encryption",
            "No logs policy",
            "5500+ servers worldwide",
            "6 simultaneous connections"
        ],
        "credentials": {
            "username": "nordvpn_premium",
            "password": "NordVPN2024!"
        },
        "download": "#",
        "image": "https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "provider": "ExpressVPN Premium",
        "features": [
            "Fastest VPN speeds",
            "160 server locations",
            "Split tunneling",
            "24/7 customer support"
        ],
        "credentials": {
            "username": "express_premium",
            "password": "Express2024!"
        },
        "download": "#",
        "image": "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "provider": "Surfshark Premium",
        "features": [
            "Unlimited devices",
            "CleanWeb™ feature",
            "Whitelister™",
            "MultiHop connections"
        ],
        "credentials": {
            "username": "surfshark_premium",
            "password": "Surfshark2024!"
        },
        "download": "#",
        "image": "https://images.pexels.com/photos/5474295/pexels-photo-5474295.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "provider": "CyberGhost Premium",
        "features": [
            "7000+ servers",
            "7 simultaneous connections",
            "Automatic kill switch",
            "DNS leak protection"
        ],
        "credentials": {
            "username": "cyberghost_premium",
            "password": "CyberGhost2024!"
        },
        "download": "#",
        "image": "https://images.pexels.com/photos/5474282/pexels-photo-5474282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
]

# VPN endpoint
@app.route('/api/vpn', methods=['GET'])
def get_vpn_data():
    try:
        return jsonify({"success": True, "data": VPN_DATA}), 200
    except Exception as e:
        print("Error fetching VPN data:", e)
        return jsonify({"success": False, "error": "Unable to retrieve data"}), 500

# File to store posts data
POSTS_FILE = 'data/posts.json'

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Initialize posts file if it doesn't exist
if not os.path.exists(POSTS_FILE):
    with open(POSTS_FILE, 'w') as f:
        json.dump([], f)

def load_posts():
    try:
        with open(POSTS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_posts(posts):
    with open(POSTS_FILE, 'w') as f:
        json.dump(posts, f, indent=2)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = load_posts()
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    posts = load_posts()
    
    new_post = {
        'id': len(posts) + 1,
        'title': data.get('title'),
        'content': data.get('content'),
        'status': data.get('status', 'draft'),
        'visibility': data.get('visibility', 'public'),
        'publishDate': data.get('publishDate'),
        'categories': data.get('categories', []),
        'binDetails': data.get('binDetails', {}),
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    posts.append(new_post)
    save_posts(posts)
    
    return jsonify(new_post), 201

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.json
    posts = load_posts()
    
    for post in posts:
        if post['id'] == post_id:
            post.update({
                'title': data.get('title', post['title']),
                'content': data.get('content', post['content']),
                'status': data.get('status', post['status']),
                'visibility': data.get('visibility', post['visibility']),
                'publishDate': data.get('publishDate', post['publishDate']),
                'categories': data.get('categories', post['categories']),
                'binDetails': data.get('binDetails', post['binDetails']),
                'updatedAt': datetime.now().isoformat()
            })
            save_posts(posts)
            return jsonify(post)
    
    return jsonify({'error': 'Post not found'}), 404

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    posts = load_posts()
    
    for i, post in enumerate(posts):
        if post['id'] == post_id:
            del posts[i]
            save_posts(posts)
            return '', 204
    
    return jsonify({'error': 'Post not found'}), 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)
