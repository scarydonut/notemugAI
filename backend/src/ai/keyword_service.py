from flask import Flask, request, jsonify
from flask_cors import CORS
import yake
import os

app = Flask(__name__)
CORS(app)

# Configure YAKE with desired parameters
yake_kw_extractor = yake.KeywordExtractor(lan="en", n=1, top=10)

@app.route('/extract', methods=['POST'])
def extract_keywords():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Extract keywords using YAKE
    keywords_with_scores = yake_kw_extractor.extract_keywords(text)
    keyword_list = [kw[0] for kw in keywords_with_scores]

    # Generate simple flashcards
    flashcards = [{"question": f"What is {kw}?", "answer": f"{kw} is mentioned in the text."} for kw in keyword_list]

    # Generate YouTube and Wikipedia suggestions
    suggestions = [{
        "keyword": kw,
        "youtube": f"https://www.youtube.com/results?search_query={kw.replace(' ', '+')}",
        "wikipedia": f"https://en.wikipedia.org/wiki/{kw.replace(' ', '_')}"
    } for kw in keyword_list]

    return jsonify({
        "keywords": keyword_list,
        "flashcards": flashcards,
        "suggestions": suggestions
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 7000)))

