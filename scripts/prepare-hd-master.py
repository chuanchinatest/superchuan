"""Keep the original untouched; patch its corner badge and retime the whole clip."""
from pathlib import Path
import subprocess,sys
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root.parent/'.tools/frame-extraction'))
import imageio_ffmpeg
source=Path('D:/Downloads/v03c76g10004db1hemq7dld7ro5q.564.mp4')
dest=root.parent/'output/video/male-transition-4s-hd-clean.mp4'
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-v','error','-i',str(source),
    '-vf','delogo=x=20:y=20:w=250:h=115,setpts=0.49484536*(PTS-STARTPTS),fps=48,tpad=stop_mode=clone:stop_duration=0.1',
    '-t','4','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)],check=True)
