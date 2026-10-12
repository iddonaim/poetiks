#!/usr/bin/env python3
"""Generate one narration mp3 per slide from deck/script.json with ElevenLabs.

Usage (from the repo root):
    ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... python3 deck/make-audio.py [--only 3,7,12] [--force] [--model eleven_v4]

Writes deck/audio/sNN.mp3 and sets "audio": true in deck/script.json so the player
uses the files instead of the browser voice. Re-run with --only after editing a line,
or with --force to regenerate every slide even if its mp3 exists.

Pronunciation: an optional top-level "say" object in script.json maps strings to
replacement strings (plain substring replace, longest keys first), applied to the text
sent to ElevenLabs; the slide's "t" (caption) is never changed. A slide may also carry
an optional "s" field, which is sent instead of "t" (the "say" map still applies to it).
No third-party packages; standard library only.
"""
import argparse, json, os, sys, time, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, 'script.json')
OUT = os.path.join(HERE, 'audio')

def tts(text, key, voice, model):
    url = f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128'
    body = json.dumps({
        'text': text,
        'model_id': model,
        'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8},
    }).encode('utf-8')
    req = urllib.request.Request(url, data=body, method='POST', headers={
        'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()

def spoken(slide, say):
    text = slide.get('s') or slide['t']
    for k in sorted(say, key=len, reverse=True):
        if k: text = text.replace(k, say[k])
    return text

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', help='comma-separated slide numbers to (re)generate')
    ap.add_argument('--force', action='store_true', help='regenerate every slide even if its mp3 exists')
    ap.add_argument('--model', default='eleven_v4')
    args = ap.parse_args()
    key = os.environ.get('ELEVENLABS_API_KEY'); voice = os.environ.get('ELEVENLABS_VOICE_ID')
    if not key or not voice:
        sys.exit('set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in the environment')
    data = json.load(open(SCRIPT, encoding='utf-8'))
    say = data.get('say') or {}
    if not isinstance(say, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in say.items()):
        sys.exit('"say" in script.json must be an object mapping strings to strings')
    only = {int(x) for x in args.only.split(',')} if args.only else None
    os.makedirs(OUT, exist_ok=True)
    for s in data['slides']:
        n = s['n']
        if only and n not in only: continue
        path = os.path.join(OUT, f's{n:02d}.mp3')
        if not only and not args.force and os.path.exists(path):
            print(f'{n:02d} exists, skip'); continue
        for attempt in range(3):
            try:
                audio = tts(spoken(s, say), key, voice, args.model)
                open(path, 'wb').write(audio)
                print(f'{n:02d} ok  {len(audio)//1024} KB'); break
            except urllib.error.HTTPError as e:
                print(f'{n:02d} HTTP {e.code}: {e.read()[:200]!r}'); time.sleep(2)
            except Exception as e:
                print(f'{n:02d} error: {e}'); time.sleep(2)
    have = [s['n'] for s in data['slides'] if os.path.exists(os.path.join(OUT, f"s{s['n']:02d}.mp3"))]
    data['audio'] = (len(have) == len(data['slides']))
    json.dump(data, open(SCRIPT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{len(have)}/{len(data["slides"])} files; script.json audio={data["audio"]}')

if __name__ == '__main__':
    main()
