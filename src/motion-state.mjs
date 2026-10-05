export function nextLeg(current, target) {
  if (![current,target].every(n=>Number.isInteger(n)&&n>=0&&n<=2) || current===target) return null;
  const to=current+Math.sign(target-current);
  return {from:current,to,key:`${current}-${to}`};
}

// Trackpad inertia is still part of the original gesture; never unlock on time alone.
export class WheelGate {
  last=-Infinity;
  total=0;
  fired=false;
  consume(delta,now) {
    if(now-this.last>220) { this.total=0; this.fired=false; }
    this.last=now;
    if(this.fired) return 0;
    if(Math.sign(delta)!==Math.sign(this.total)) this.total=0;
    this.total+=delta;
    if(Math.abs(this.total)<40) return 0;
    this.fired=true;
    return Math.sign(this.total);
  }
}
