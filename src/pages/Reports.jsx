import{useState}from'react';
import{useApp}from'../context/AppContext';
import DonutChart from'../components/DonutChart';
import SpendingTrendChart from'../components/SpendingTrendChart';
import{fmt}from'../utils/format';
export default function Reports({setActive}){
  const{state,totalExpenses,catTotals,CATEGORY_ICONS,CATEGORY_COLORS}=useApp();
  const[period,setPeriod]=useState('Monthly');
  const donut=Object.entries(catTotals).filter(([,v])=>v>0).map(([cat,val])=>({label:cat,value:val,color:CATEGORY_COLORS[cat]||'#94a3b8'}));
  const top=Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0];
  return(
    <div className="page">
      <div className="grad-report" style={{padding:'20px 20px 24px'}}>
        <div className="row gap12">
          <button className="btn-back" onClick={()=>setActive('home')} aria-label="Go back">←</button>
          <h1 style={{color:'white',margin:0,fontSize:22,fontWeight:900,letterSpacing:'-0.5px'}}>Report and Analytics</h1>
        </div>
      </div>
      <div style={{padding:16}}>
        {/* Period tabs */}
        <div className="chip-row mb12">
          {['Weekly','Monthly','Yearly'].map(p=>(
            <button key={p} className={`chip${period===p?' active':''}`} onClick={()=>setPeriod(p)}>{p}</button>
          ))}
        </div>
        {/* Total Spent */}
        <div className="card" style={{padding:20,marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>Total Spent</div>
          <div style={{fontSize:34,fontWeight:900,color:'var(--text)',letterSpacing:'-1px',marginBottom:4}}>{fmt(totalExpenses)}</div>
          <div style={{fontSize:13,fontWeight:600,color:'#10b981',display:'flex',alignItems:'center',gap:4}}>
            <span>↓</span> 12% from last month
          </div>
        </div>
        {/* Donut */}
        <div className="card" style={{padding:20,marginBottom:12}}>
          <div className="row gap16" style={{alignItems:'center'}}>
            <DonutChart data={donut} size={165}/>
            <div className="col gap7 flex-1">
              {donut.map(d=>(
                <div key={d.label} className="row" style={{justifyContent:'space-between'}}>
                  <div className="row gap6">
                    <div style={{width:8,height:8,borderRadius:2,background:d.color,marginTop:2,flexShrink:0}}/>
                    <span style={{fontSize:12,color:'var(--muted)'}}>{d.label}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>
                    {totalExpenses?Math.round((d.value/totalExpenses)*100):0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Trend */}
        <div className="card" style={{padding:20,marginBottom:12}}>
          <div className="row" style={{justifyContent:'space-between',marginBottom:12}}>
            <span style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>📉 Spending Trend</span>
            <span style={{fontSize:12,color:'var(--faint)'}}>This Month</span>
          </div>
          <SpendingTrendChart expenses={state.expenses}/>
        </div>
        {/* Top Category */}
        {top&&(
          <div className="card" style={{padding:20,marginBottom:12}}>
            <p style={{margin:'0 0 12px',fontSize:13,fontWeight:700,color:'var(--text)'}}>🏆 Top Category</p>
            <div className="row" style={{justifyContent:'space-between',alignItems:'center'}}>
              <div className="row gap12">
                <div style={{width:46,height:46,borderRadius:13,background:`${CATEGORY_COLORS[top[0]]}18`,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>
                  {CATEGORY_ICONS[top[0]]}
                </div>
                <span style={{fontWeight:800,fontSize:17,color:'var(--text)'}}>{top[0]}</span>
              </div>
              <span style={{fontWeight:900,fontSize:20,color:'#ef4444',letterSpacing:'-0.5px'}}>{fmt(top[1])}</span>
            </div>
          </div>
        )}
        {/* Breakdown */}
        <div className="card" style={{padding:20}}>
          <p style={{margin:'0 0 14px',fontSize:13,fontWeight:700,color:'var(--text)'}}>📊 Category Breakdown</p>
          <div className="col gap12">
            {Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([c,amt])=>{
              const pct=totalExpenses?Math.round((amt/totalExpenses)*100):0;
              return(
                <div key={c}>
                  <div className="row" style={{justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:13,color:'var(--text)',fontWeight:600}}>{CATEGORY_ICONS[c]} {c}</span>
                    <span style={{fontSize:13,fontWeight:800,color:'var(--text)'}}>{fmt(amt)} <span style={{color:'var(--faint)',fontWeight:500}}>({pct}%)</span></span>
                  </div>
                  <div className="pbar">
                    <div className="pbar-fill" style={{width:`${pct}%`,background:CATEGORY_COLORS[c]||'var(--primary)'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
