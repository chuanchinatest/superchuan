import { useCallback, useEffect, useRef, useState } from 'react';
import { nextLeg, WheelGate } from './motion-state.mjs';
import { SceneContent } from './SceneContent.jsx';

const scenes=['开场','关于我','工具与经历'];
const base=import.meta.env.BASE_URL;
const clips={'0-1':`${base}media/intro-about.mp4?v=native2160-v2`,'1-0':`${base}media/intro-about-reverse.mp4?v=native2160-v2`,'1-2':`${base}media/about-tools.mp4?v=native2160-v2`,'2-1':`${base}media/about-tools-reverse.mp4?v=native2160-v2`};
const posters=[1,2,3].map(n=>`${base}media/scene-${n}.webp?v=native2160-v2`);

function waitForMedia(video,event,ready) {
  if(video.error)return Promise.reject(new Error('视频无法加载'));
  if(ready?.())return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>finish(new Error('媒体加载超时')),12000);
    const finish=error=>{
      clearTimeout(timer);video.removeEventListener(event,ok);video.removeEventListener('error',bad);
      error?reject(error):resolve();
    };
    const ok=()=>finish(),bad=()=>finish(new Error('视频无法播放'));
    video.addEventListener(event,ok,{once:true});video.addEventListener('error',bad,{once:true});
  });
}
function decodedFrame(video) {
  return new Promise(resolve=>{
    let done=false;
    const finish=()=>{if(!done){done=true;clearTimeout(timer);resolve();}};
    const timer=setTimeout(finish,180);
    if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(finish);
    else requestAnimationFrame(()=>requestAnimationFrame(finish));
  });
}
const painted=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

export function App() {
  const [scene,setScene]=useState(0),[target,setTarget]=useState(0),[active,setActive]=useState(null);
  const [busy,setBusy]=useState(false),[preparing,setPreparing]=useState(false),[error,setError]=useState('');
  const sceneRef=useRef(0),targetRef=useRef(0),running=useRef(false),media=useRef({}),reduced=useRef(false),alive=useRef(true);
  const wheel=useRef(new WheelGate()),touch=useRef(null),failedTarget=useRef(1);
  useEffect(()=>{
    alive.current=true;
    const query=matchMedia('(prefers-reduced-motion: reduce)');
    const changed=()=>{reduced.current=query.matches;};changed();query.addEventListener('change',changed);
    posters.forEach(src=>{const img=new Image();img.src=src;});
    return ()=>{alive.current=false;query.removeEventListener('change',changed);Object.values(media.current).forEach(v=>v?.pause());};
  },[]);

  const navigate=useCallback(async()=>{
    if(running.current)return;
    running.current=true;setBusy(true);setError('');
    try {
      while(alive.current) {
        const leg=nextLeg(sceneRef.current,targetRef.current);if(!leg)break;
        if(reduced.current){sceneRef.current=targetRef.current;setScene(sceneRef.current);break;}
        const video=media.current[leg.key];setPreparing(true);
        await waitForMedia(video,'canplay',()=>video.readyState>=3);
        if(video.currentTime>0.005){const seeking=waitForMedia(video,'seeked');video.currentTime=0;await seeking;}
        const ended=waitForMedia(video,'ended');
        // A rejected play() must not leave an unhandled ended-timeout promise.
        ended.catch(()=>{});
        await video.play();await decodedFrame(video);
        if(!alive.current)break;
        setPreparing(false);setActive(leg.key);await ended;
        if(!alive.current)break;
        sceneRef.current=leg.to;setScene(leg.to);
        await painted();setActive(null);await painted();
      }
    }catch(e){
      Object.values(media.current).forEach(v=>v?.pause());setActive(null);setError('视频加载未完成，请重试');
      failedTarget.current=targetRef.current;targetRef.current=sceneRef.current;setTarget(sceneRef.current);
    }finally{running.current=false;setBusy(false);setPreparing(false);}
  },[]);
  const request=useCallback(value=>{
    const dest=Math.max(0,Math.min(2,value));targetRef.current=dest;setTarget(dest);
    if(dest!==sceneRef.current)void navigate();
  },[navigate]);
  useEffect(()=>{
    const onWheel=e=>{
      if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
      e.preventDefault();
      const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
      const direction=wheel.current.consume(delta,performance.now());
      if(direction&&!running.current)request(sceneRef.current+direction);
    };
    const onKey=e=>{
      if(e.altKey||e.metaKey||e.ctrlKey||e.repeat)return;
      const next=['ArrowDown','ArrowRight','PageDown',' '].includes(e.key),prev=['ArrowUp','ArrowLeft','PageUp'].includes(e.key);
      if(e.key===' '&&e.target.closest('button'))return;
      if(next||prev){e.preventDefault();if(!running.current)request(sceneRef.current+(next?1:-1));}
      if(e.key==='Home'){e.preventDefault();request(0);}if(e.key==='End'){e.preventDefault();request(2);}
    };
    window.addEventListener('wheel',onWheel,{passive:false});window.addEventListener('keydown',onKey);
    return ()=>{window.removeEventListener('wheel',onWheel);window.removeEventListener('keydown',onKey);};
  },[request]);
  const advance=()=>request(sceneRef.current===2?0:sceneRef.current+1);
  return <main className="portfolio" data-scene={scene} data-target={target} data-busy={busy} aria-busy={busy}
    onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
    onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start||running.current)return;
      const dx=start.x-e.changedTouches[0].clientX,dy=start.y-e.changedTouches[0].clientY;
      if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx))request(sceneRef.current+Math.sign(dy));}}>
    <div className="visual-stage" aria-hidden="true">
      {posters.map((src,index)=><img key={src} src={src} className="stage-media poster" data-visible={scene===index} alt="" fetchPriority={index===0?'high':'auto'}/>)}
      {Object.entries(clips).map(([key,src])=><video key={key} ref={el=>{media.current[key]=el;}} src={src} className="stage-media transition-video" data-active={active===key} data-clip={key} preload="auto" muted playsInline disablePictureInPicture tabIndex={-1}/>)}
      <div className="hero-shade"/>
    </div>
    <button className="scene-surface" tabIndex={-1} aria-label={scene===2?'返回开场':'进入下一个画面'} onClick={advance}/>
    <header className="site-header">
      <button className="wordmark" onClick={()=>request(0)} aria-label="Adrian Pei，返回开场">ADRIAN PEI <span>/ CREATIVE</span></button>
      <button className="header-cue" onClick={()=>request(1)}>关于我</button>
    </header>
    <SceneContent scene={scene} transitioning={busy}/>
    <footer className="hero-footer">
      <div className="signature"><b>裴青川</b><span>ADRIAN PEI</span></div>
      <nav className="scene-dots" aria-label="场景选择">
        {scenes.map((name,index)=><button key={name} className={scene===index?'active':''} aria-label={name} aria-current={scene===index?'step':undefined} data-pending={busy&&target===index} onClick={()=>request(index)}>0{index+1}</button>)}
      </nav>
      <button className="next-cue" onClick={advance} aria-label={scene===2?'重新播放':'进入下一个画面'}><span>{scene===2?'重新播放':'进入下一个画面'}</span><img src={`${base}media/arrow-down.svg`} alt=""/></button>
    </footer>
    <div className="media-notice" role="status" aria-live="polite">
      {error?<><span>{error}</span><button onClick={()=>{Object.values(media.current).forEach(v=>{if(v?.error)v.load();});request(failedTarget.current);}}>重试</button></>:preparing?<span>正在准备画面</span>:null}
    </div>
    <span className="sr-only" aria-live="polite">当前画面：{scenes[scene]}</span>
  </main>;
}
