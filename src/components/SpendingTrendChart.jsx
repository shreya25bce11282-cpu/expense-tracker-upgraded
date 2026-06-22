import { useMemo } from 'react';
export default function SpendingTrendChart({expenses}){
  const pts=useMemo(()=>{
    const today=new Date();
    return Array.from({length:7},(_,i)=>{
      const d=new Date(today); d.setDate(d.getDate()-(6-i));
      const key=d.toISOString().split('T')[0];
      const label=d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
      const amt=expenses.filter(e=>e.date===key).reduce((s,e)=>s+e.amount,0);
      return{key,label,amt};
    });
  },[expenses]);
  const max=Math.max(...pts.map(p=>p.amt),500);
  const W=300,H=90,PAD=10;
  const coords=pts.map((p,i)=>({
    x:(i/(pts.length-1))*(W-PAD*2)+PAD,
    y:H-(p.amt/max)*(H-PAD*2)-PAD,
    ...p
  }));
  const path=coords.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ');
  const area=`${path} L${coords.at(-1).x},${H} L${coords[0].x},${H}Z`;
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{display:'block'}}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C63FF" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#6C63FF" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tg)"/>
      <path d={path} fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {coords.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#6C63FF" stroke="var(--surface)" strokeWidth="2"/>
          <text x={p.x} y={H+16} textAnchor="middle" fontSize="9" fill="var(--muted)">{p.label.split(' ')[0]}</text>
        </g>
      ))}
    </svg>
  );
}
