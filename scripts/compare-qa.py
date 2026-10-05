from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parents[1]
refs=root.parent/'references'
board=Image.new('RGB',(1280,1140),'#081529')
d=ImageDraw.Draw(board)
for row,scene in enumerate(['intro','about','tools']):
    d.text((12,row*380+8),f'SOURCE: {scene}',fill='white')
    d.text((652,row*380+8),f'IMPLEMENTATION: {scene} (own video, content omitted)',fill='white')
    for col,path in enumerate([refs/f'source-desktop-{scene}.jpg',root/f'qa-desktop-{scene}.jpg']):
        img=Image.open(path).convert('RGB')
        board.paste(ImageOps.fit(img,(640,360)),(col*640,row*380+20))
board.save(root/'qa-comparison-desktop.jpg',quality=93)
# Mobile changes are intentional: entire landscape footage remains readable.
mobile=Image.new('RGB',(780,874),'#081529')
d=ImageDraw.Draw(mobile);d.text((12,8),'SOURCE MOBILE',fill='white');d.text((402,8),'IMPLEMENTATION MOBILE',fill='white')
for col,path in enumerate([refs/'source-mobile-tools.jpg',root/'qa-mobile-tools.jpg']):
    mobile.paste(ImageOps.fit(Image.open(path).convert('RGB'),(390,844)),(col*390,30))
mobile.save(root/'qa-comparison-mobile.jpg',quality=93)
# A focused view makes small navigation marks and typography inspectable.
focus=Image.new('RGB',(1280,200),'#081529')
for row,path in enumerate([refs/'source-desktop-intro.jpg',root/'qa-desktop-intro.jpg']):
    img=Image.open(path).convert('RGB')
    img=img.resize((1280,720))
    focus.paste(img.crop((0,620,1280,720)),(0,row*100))
focus.save(root/'qa-comparison-footer.jpg',quality=95)
print('QA comparison artifacts saved')
