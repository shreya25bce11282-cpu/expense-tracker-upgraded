import { useMemo } from 'react';
export default function DonutChart({data,size=180}){
  const total=data.reduce((s,d)=>s+d.value,0);
  const r=size/2-14; const cx=size/2; const cy=size/2;
  const circ=2*Math.PI*r;
  const slices=useMemo(()=>{
    let cum=0;
    return data.map(d=>{const s=cum;cum+=d.value/Math.max(total,1);return{...d,start:s,pct:d.value/Math.max(total,1)};});
  },[data,total]);
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:'visible'}}>
      {total===0?(
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={18}/>
      ):slices.filter(s=>s.pct>0.005).map((s,i)=>(
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={18}
          strokeDasharray={`${Math.max(0,(s.pct*circ)-2)} ${circ}`}
          strokeDashoffset={circ-s.start*circ}
          strokeLinecap="round"
          style={{transformOrigin:`${cx}px ${cy}px`,transform:'rotate(-90deg)',transition:'stroke-dasharray 1s ease'}}/>
      ))}
      <text x={cx} y={cy-7} textAnchor="middle" fill="var(--primary)" fontSize="15" fontWeight="800">
        {total>0?`₹${(total/1000).toFixed(1)}k`:'₹0'}
      </text>
      <text x={cx} y={cy+11} textAnchor="middle" fill="var(--muted)" fontSize="10">Total Spent</text>
    </svg>
  );
}
