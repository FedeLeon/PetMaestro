"""Original PetMaestro score and effects. Python stdlib + ffmpeg; no samples.

Run from the repository root: python3 scripts/generate_game_audio.py
The music uses whole bars and wrapped note tails to produce seamless loops.
"""
import math
from pathlib import Path
import random
import struct
import subprocess
import tempfile
import wave

RATE = 22050
OUT = Path(__file__).resolve().parents[1] / 'assets/audio/game'
OUT.mkdir(parents=True, exist_ok=True)


def note(track, start, midi, duration, gain=.22, soft=False, wrap=False):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    for i in range(int(duration * RATE)):
        t = i / RATE
        envelope = min(1, t / .012) * math.exp(-t * (3 if soft else 6))
        envelope *= min(1, (duration - t) / .08)
        tone = math.sin(2 * math.pi * frequency * t)
        tone += (.12 if soft else .3) * math.sin(4 * math.pi * frequency * t) * math.exp(-t * 8)
        index = round(start * RATE) + i
        if wrap:
            index %= len(track)
        if index < len(track):
            track[index] += gain * envelope * tone


def save(name, track):
    peak = max(1, max(abs(x) for x in track) / .88)
    with tempfile.NamedTemporaryFile(suffix='.wav') as temporary:
        with wave.open(temporary.name, 'wb') as output:
            output.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
            output.writeframes(b''.join(struct.pack('<h', round(max(-1, min(1, x / peak)) * 32767)) for x in track))
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', temporary.name,
                        '-codec:a', 'libmp3lame', '-b:a', '96k', str(OUT / f'{name}.mp3')], check=True)


def music(name, beat, soft):
    track = [0.] * round(RATE * beat * 64)
    chords = [(48, 60, 64, 67), (53, 60, 65, 69), (57, 60, 64, 69), (55, 59, 62, 67)]
    melody = [72, 76, 79, 76, 74, 72, 69, 72, 76, 79, 81, 79, 74, 71, 67, 71]
    for bar in range(16):
        chord = chords[bar % 4]
        note(track, bar * 4 * beat, chord[0], beat * 3.5, .13, True, True)
        for step in range(8):
            note(track, (bar * 4 + step / 2) * beat, chord[1 + step % 3], beat * 1.7, .075, soft, True)
        for step in range(2):
            note(track, (bar * 4 + step * 2) * beat, melody[(bar * 2 + step) % 16], beat * 1.6, .13, soft, True)
    save(name, track)


music('garden-theme', .46, False)
music('home-theme', .62, True)
effects = {
    'tap': [(0, 79, .13, .18)],
    'correct': [(0, 72, .25, .24), (.11, 76, .28, .22), (.22, 79, .4, .2)],
    'retry': [(0, 67, .2, .15), (.13, 64, .25, .12)],
    'complete': [(0, 72, .4, .2), (.15, 76, .4, .2), (.3, 79, .4, .2), (.48, 84, .8, .22)],
    'purchase': [(0, 79, .22, .2), (.12, 84, .45, .18)],
    'equip': [(0, 72, .18, .18), (.09, 77, .25, .16)],
    'eat': [(0, 55, .12, .2), (.14, 60, .12, .16), (.28, 64, .18, .13)],
    'sleep': [(0, 79, .5, .12), (.26, 76, .6, .12), (.55, 72, .8, .12)],
}
for name, notes in effects.items():
    track = [0.] * round((max(start + duration for start, _, duration, _ in notes) + .08) * RATE)
    for start, midi, duration, gain in notes:
        note(track, start, midi, duration, gain)
    save(name, track)

random.seed(57)
water = [0.] * (RATE * 2)
previous = 0
for i in range(len(water)):
    t = i / RATE
    previous = .88 * previous + .12 * random.uniform(-1, 1)
    envelope = min(1, t / .12, (2 - t) / .25)
    water[i] = envelope * (.18 * previous + .018 * math.sin(2 * math.pi * (850 * t + 14 * math.sin(t * 9))))
save('water', water)
