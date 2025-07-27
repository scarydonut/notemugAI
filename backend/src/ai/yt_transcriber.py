from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import os 

app = Flask(__name__)
CORS(app)

api = YouTubeTranscriptApi()  

@app.route("/transcribe", methods=["POST"])
def transcribe():
    data = request.get_json()
    video_url = data.get("url")
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        video_id = video_url.split("v=")[-1].split("&")[0]
        transcript = api.fetch(video_id)  
        full_text = " ".join([seg.text for seg in transcript]) 
        return jsonify({"text": full_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 7002)))
