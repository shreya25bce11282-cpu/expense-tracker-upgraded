import{useEffect,useRef,useState}from'react';
export default function AnimatedCounter({value,prefix='₹',suffix='',duration=1200}){
  const[disp,setDisp]=useState(value);
  const prev=useRef(value);const raf=useRef();const start=useRef();
  useEffect(()=>{
    const from=prev.current,to=value;prev.current=value;start.current=null;
    const go=ts=>{
      if(!start.current)start.current=ts;
      const p=Math.min((ts-start.current)/duration,1);
      const e=1-Math.pow(1-p,3);
      setDisp(from+(to-from)*e);
      if(p<1)raf.current=requestAnimationFrame(go);
    };
    raf.current=requestAnimationFrame(go);
    return()=>cancelAnimationFrame(raf.current);
  },[value]);
  return<span>{prefix}{Math.round(disp).toLocaleString('en-IN')}{suffix}</span>;
}
