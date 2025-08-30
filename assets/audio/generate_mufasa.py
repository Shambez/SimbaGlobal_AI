import os
import pathlib
from openai import OpenAI
from pydub import AudioSegment

# Init client with env var (from .env)
client = OpenAI(api_key=os.getenv("EXPO_PUBLIC_OPENAI_API_KEY"))

# Where to save
OUTPUT_DIR = pathlib.Path("assets/audio")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Lines for Mufasa
lines = {
    "welcome": "Welcome... to SimbaGlobal AI. I am here... to guide you.",
    "splash": "The world is vast... but you are never alone. SimbaGlobal AI stands with you... Hyena Free.",
    "chat_open": "Speak freely, and I will answer with wisdom.",
    "motivation": "Remember... true strength lies not in power... but in unity and courage.",
    "goodbye": "Farewell... until we meet again. The pride is always with you.",
    "hyena_free": "This is SimbaGlobal AI... Hyena Free."
}

def generate_all():
    for name, text in lines.items():
        out_path = OUTPUT_DIR / f"mufasa_{name}.mp3"

        print(f"🎙️ Generating {name} → {out_path}")

        # Stream directly to file
        with client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice="alloy",
            input=text
        ) as response:
            response.stream_to_file(out_path)

        # Optional: post-process to deepen slightly
        audio = AudioSegment.from_file(out_path, format="mp3")
        deeper = audio._spawn(audio.raw_data, overrides={
            "frame_rate": int(audio.frame_rate * 0.9)
        })
        deeper = deeper.set_frame_rate(audio.frame_rate)
        deeper.export(out_path, format="mp3")

        print(f"✅ Saved: {out_path}")

if __name__ == "__main__":
    generate_all()