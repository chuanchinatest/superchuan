"""Reproducible endpoint-matched assets from the user's approved 4-second video."""
import pathlib, subprocess, sys, json, re
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / '.tools/frame-extraction'))
import imageio_ffmpeg

root = pathlib.Path(__file__).resolve().parents[1]
source = root.parent / 'output/video/male-transition-4s-hd-clean.mp4'
dest = root / 'public/media'
dest.mkdir(parents=True, exist_ok=True)
ff = imageio_ffmpeg.get_ffmpeg_exe()
def run(*args):
    subprocess.run([ff, '-y', '-v', 'error', *map(str,args)], check=True)

# Shared frames 0, 48 and 144 are selected from the actual generated video.
# Include shared endpoints in both directions so the poses match exactly.
for name, start, stop in [('intro-about',0,49),('about-tools',48,145)]:
    for reverse in (False,True):
        suffix = '-reverse' if reverse else ''
        filters = f'trim=start_frame={start}:end_frame={stop},setpts=N/(48*TB),setsar=1'
        if reverse: filters += ',reverse,setpts=N/(48*TB)'
        run('-i',source,'-vf',filters,'-an','-c:v','libx264','-preset','slow',
            '-crf','16','-g','24','-r','48','-fps_mode','cfr','-pix_fmt','yuv420p','-movflags','+faststart',
            dest / f'{name}{suffix}.mp4')
for index, frame in enumerate([0,48,144]):
    run('-i',source,'-vf',rf'select=eq(n\,{frame}),setsar=1','-frames:v','1','-lossless','1',
        dest / f'scene-{index+1}.webp')

report = []
for path in sorted(dest.glob('*.mp4')):
    r = subprocess.run([ff,'-hide_banner','-i',str(path),'-f','null','-'],capture_output=True,text=True)
    if r.returncode: raise RuntimeError(r.stderr)
    report.append({'file':path.name,'bytes':path.stat().st_size,
                   'duration':re.search(r'Duration: ([0-9:.]+)',r.stderr).group(1),'decode':'passed'})
(root/'media-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
