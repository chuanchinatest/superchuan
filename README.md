# 裴青川 · 三幕动画作品集

第一版只实现动画切换，个人介绍、经历、作品内容留空。

## 本地使用

预览地址 http://127.0.0.1:4173 。重新启动时在此目录运行：

```powershell
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

滚轮、上/下箭头、PageUp/PageDown、触屏上下滑动切换相邻场景。底部01/02/03可跨幕选择。第三幕的“重新播放”反向返回开场。快速点选会保留最后目标，按相邻路径顺序播放。系统开启“减少动态效果”时直接切换静态帧。

## 后续加内容

修改 `src/SceneContent.jsx`。scene值为0开场、1关于我、2工具与经历。默认section为空；第二幕内容定位在右侧，第三幕在左侧。样式在 `src/styles.css` 的 `.scene-content`。添加可交互内容时将其 `pointer-events` 设为 `auto`。

## 视频与素材

高清原视频保留在D:/Downloads/v03c76g10004db1hemq7dld7ro5q.564.mp4。处理后的4秒母版在 ../output/video/male-transition-4s-hd-clean.mp4（3766×2160、48fps、静音）。网站使用高清母版生成的原分辨率3766×2160的预加载正向/反向视频和无损关键帧，保留源素材细节，不使用原作者的视频或图片。

素材处理脚本：`scripts/prepare-media.py`。实际第二幕在加速后约1秒，第三幕在约3秒，因此不是按时长均分。按用户要求移除了左上角可见AI生成标识，使用局部背景插值，不裁切画面。手机采用完整画面适配，桌面采用全屏铺满裁切。

## 验证

```powershell
node --test tests/motion-state.test.mjs
npm run build
```

构建输出在 `dist/client`。部署时应设置静态素材缓存，并支持视频Range请求。此版本未部署到公网。
