import openai
import os
from pydub import AudioSegment

openai.api_key = os.getenv("EXPO_PUBLIC_OPENAI_API_KEY")

OUTPUT_PATH = "assets/audio/mufasa_welcome.mp3"

def generate_mufasa_voice():
    print("🎙️ Generating tuned Mufasa-style voice...")

    # Use carefully paced text for delivery
    text = "Welcome... to SimbaGlobal AI. I am here... to guide you."

    response = openai.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",   # deep male tone
        input=text,
        format="mp3",
    )

    # Save raw mp3 first
    temp_path = "assets/audio/mufasa_raw.mp3"
    with open(temp_path, "wb") as f:
        f.write(response.content)

    # Optional: Post-process with pydub for deeper/slower tone
    audio = AudioSegment.from_file(temp_path, format="mp3")
    # lower pitch (by lowering playback speed slightly)
    deeper = audio._spawn(audio.raw_data, overrides={
        "frame_rate": int(audio.frame_rate * 0.9)  # 90% speed => deeper/slower
    })
    deeper = deeper.set_frame_rate(audio.frame_rate)

    deeper.export(OUTPUT_PATH, format="mp3")

    print(f"✅ Tuned Mufasa-style voice saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_mufasa_voice()