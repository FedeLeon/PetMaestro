#!/usr/bin/env python3
"""Resize bundled PNGs without cropping; originals and measurements stay outside the repo."""
import argparse
import hashlib
import io
import json
import tarfile
from collections import defaultdict
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def budget(path):
    """Pixel budgets include density headroom for 844x390 phones and 1280x720 tablets."""
    name, group = path.name, path.parent.name
    if '/ui/menus/' in str(path):
        return 'menu-nine-slice', (1086, 362), None
    if group == 'library':
        return 'story-three-frames', (1920, 640), (3, 1)
    if name in ('cat-run-cycle-v3.png', 'cat-run-sad-v1.png'):
        return 'runner-eight-frames', (1280, 640), (4, 2)
    if name in ('cat-stride-v2.png', 'cat-v1.png'):
        return 'runner-three-frames', (1152, 384), (3, 1)
    if name.startswith('interior-panorama') or name == 'park-v1.png':
        return 'panoramic-background', None, None
    if group in ('navigation', 'needs'):
        return group, (256 if group == 'navigation' else 128,) * 2, None
    if group == 'ui':
        side = 512 if name in ('toy-card-frame-v1.png', 'word-card-frame-v2.png') else 384 if name == 'feeding-finish-happy-cat-v1.png' else 256
        return 'ui', (768, 256) if name == 'cooking-stir-panel-v1.png' else (side, side), None
    if group == 'success':
        return 'celebration', (512, 768), None
    if group == 'cat' or path.parts[-2:] == ('pets', 'dressup-cat.png'):
        return 'main-cat', (640, 960) if name != 'cat-watch-tv-v1.png' else (512, 512), None
    if 'cat-items' in path.parts:
        return 'clothing-and-toys', (512, 512), None
    if any(part.startswith('farm') for part in path.parts[:-1]):
        return 'farm-animation', (512, 512), None
    if 'furniture' in path.parts:
        return 'furniture', (640, 640), None
    if group == 'garden':
        return 'garden', (768, 512) if name.startswith('watering-can') else (640, 640), None
    if group == 'words':
        return 'learning-word', (512, 512), None
    if group == 'house':
        if name.startswith(('bathroom-', 'exterior-', 'interior-', 'kitchen-room', 'shower-cat', 'tooth-brushing-cat', 'toilet-cat', 'toilet-empty-room', 'cat-bedroom')):
            return 'room-background', None, None
        if name == 'cat-sleeping-v1.png':
            return 'sleeping-cat', (768, 512), None
        if name == 'toilet-seated-cat-v1.png':
            return 'seated-cat', (512, 768), None
        if name == 'bath-water-drop-v1.png':
            return 'water-particle', (128, 128), None
        if name.startswith('toothbrush-'):
            return 'toothbrush', (768, 384), None
        if name.startswith('tooth-plaque'):
            return 'plaque', (256, 256), None
        return 'bathroom-tool', (512, 512), None
    if group == 'kitchen':
        if name in ('cooking-counter-v1.png', 'feeding-cat-v1.png', 'feeding-cat-chew-v1.png', 'fridge-interior-v1.png', 'kitchen-interactive-v2.png'):
            return 'kitchen-background', None, None
        if name.startswith('food-'):
            return 'food', (384, 384), None
        if name in ('cooking-pot-v1.png', 'feeding-bowl-v1.png'):
            return 'kitchen-vessel', (960, 640), None
        if name == 'cooking-spoon-v1.png':
            return 'kitchen-spoon', (768, 512), None
        return 'kitchen-effect', (512, 512), None
    if group == 'bell-runner' and name.startswith('obstacle-'):
        return 'runner-obstacle', (512, 512), None
    if group == 'shop' and name == 'farm-barn.png':
        return 'barn-decoration', (640, 640), None
    # Full scenes and launcher icons already match their display/export needs.
    return 'background-or-launcher', None, None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--assetmap', type=Path, required=True)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--backup-dir', type=Path)
    args = parser.parse_args()
    if args.apply and (not args.backup_dir or args.backup_dir.resolve().is_relative_to(ROOT)):
        parser.error('--apply requires --backup-dir outside the project')
    assetmap = json.loads(args.assetmap.read_text())
    included = {Path(file).resolve() for asset in assetmap.values() for file in asset['files']}
    files = sorted((ROOT / 'assets').rglob('*.png'))
    # Metro collapses identical files to one hash. Resize every source alias too,
    # otherwise the next export would bundle the old full-size copy separately.
    for path in files:
        if path.resolve() not in included and hashlib.md5(path.read_bytes()).hexdigest() in assetmap:
            included.add(path.resolve())
    measurements, totals = [], defaultdict(lambda: [0, 0, 0])
    if args.apply:
        args.backup_dir.mkdir(parents=True, exist_ok=False)
    backup = tarfile.open(args.backup_dir / 'originals.tar', 'w') if args.apply else None
    try:
        for path in files:
            relative = path.relative_to(ROOT)
            if path.resolve() not in included:
                continue
            group, cap, grid = budget(relative)
            original = path.read_bytes()
            with Image.open(io.BytesIO(original)) as source:
                source.load()
                old_size = source.size
                scale = min(1, *(cap[i] / old_size[i] for i in (0, 1))) if cap else 1
                size = tuple(max(1, round(side * scale)) for side in old_size)
                if grid and scale < 1:
                    # Resample each cell independently, keeping the same frame order.
                    cell = (size[0] // grid[0], size[1] // grid[1])
                    size = (cell[0] * grid[0], cell[1] * grid[1])
                    result = Image.new(source.mode, size)
                    for row in range(grid[1]):
                        for col in range(grid[0]):
                            box = (col * source.width / grid[0], row * source.height / grid[1], (col + 1) * source.width / grid[0], (row + 1) * source.height / grid[1])
                            result.paste(source.resize(cell, Image.Resampling.LANCZOS, box=box), (col * cell[0], row * cell[1]))
                else:
                    result = source.resize(size, Image.Resampling.LANCZOS) if size != old_size else source.copy()
                output = io.BytesIO()
                if size == old_size:
                    encoded = original
                else:
                    result.save(output, format='PNG', optimize=True, compress_level=9, **({'icc_profile': source.info['icc_profile']} if source.info.get('icc_profile') else {}))
                    encoded = output.getvalue()
                if len(encoded) >= len(original):
                    encoded, size = original, old_size
                changed = encoded != original
                totals[group][0] += 1
                totals[group][1] += len(original)
                totals[group][2] += len(encoded)
                measurements.append({'path': str(relative), 'group': group, 'before': old_size, 'after': size, 'bytesBefore': len(original), 'bytesAfter': len(encoded), 'grid': grid, 'sha256Before': hashlib.sha256(original).hexdigest()})
                if args.apply and changed:
                    backup.add(path, arcname=str(relative))
                    temp = path.with_suffix('.png.optimizing')
                    temp.write_bytes(encoded)
                    temp.replace(path)
        for group, (count, before, after) in sorted(totals.items()):
            print(f'{group}: {count} PNG; {before / 1048576:.2f} -> {after / 1048576:.2f} MiB')
        before, after = sum(v[1] for v in totals.values()), sum(v[2] for v in totals.values())
        print(f'TOTAL: {len(measurements)} PNG; {before / 1048576:.2f} -> {after / 1048576:.2f} MiB; saved {(before-after)/1048576:.2f} MiB')
        if args.apply:
            (args.backup_dir / 'measurements.json').write_text(json.dumps(measurements, indent=2) + '\n')
    finally:
        if backup:
            backup.close()


if __name__ == '__main__':
    main()
