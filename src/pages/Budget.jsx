import{useState}from'react';
import{useApp}from'../context/AppContext';
import{fmt}from'../utils/format';
const CATS=['Food','Transport','Shopping','Education','Entertainment','Health','Bills'];
export default function Budget({setActive}){
  const{state,dispatch,showToast,catTotals,CATEGORY_ICONS,CATEGORY_COLORS}=useApp();
  const[total,setTotal]=useState(String(state.totalBudget));
  const[cats,setCats]=useState({...state.categoryBudgets});
  const save=()=>{
    const t=+total;if(!t||t<=0){showToast('Enter a valid budget','error');return;}
    dispatch({type:'SET_BUDGET',payload:{total:t,categories:Object.fromEntries(Object.entries(cats).map(([k,v])=>[k,+v||0]))}});
    showToast('Budget saved!');
  };
  const catSum=Object.values(cats).reduce((s,v)=>s+(+v||0),0);
  const barColor=p=>p>90?'#ef4444':p>75?'#f59e0b':'#10b981';
  return(
    <div className="page">
      <div className="grad-teal" style={{padding:'20px 20px 24px'}}>
        <div className="row gap12" style={{marginBottom:8}}>
          <button className="btn-back" onClick={()=>setActive('home')} aria-label="Go back">←</button>
          <h1 style={{color:'white',margin:0,fontSize:22,fontWeight:900,letterSpacing:'-0.5px'}}>Set Monthly Budget</h1>
        </div>
      </div>
      <div style={{padding:16}}>
        {/* Total */}
        <div className="card" style={{padding:20,marginBottom:12}}>
          <label className="label">Monthly Budget Amount</label>
          <div style={{fontSize:22,fontWeight:900,color:'var(--primary)',marginBottom:12,letterSpacing:'-0.5px'}}>
            {fmt(+total||0)}
          </div>
          <input className="field" type="number" placeholder="Enter total budget" value={total} onChange={e=>setTotal(e.target.value)}/>
          {catSum>+total&&+total>0&&(
            <p style={{color:'#ef4444',fontSize:12,margin:'8px 0 0',fontWeight:600}}>
              ⚠ Category budgets ({fmt(catSum)}) exceed total budget
            </p>
          )}
        </div>
        {/* Categories */}
        <div className="card" style={{padding:20,marginBottom:16}}>
          <p style={{margin:'0 0 16px',fontSize:13,fontWeight:800,color:'var(--text)'}}>Category wise Amount</p>
          <div className="col gap16">
            {CATS.map(c=>{
              const spent=catTotals[c]||0;const budget=+cats[c]||0;
              const pct=budget?Math.min(100,Math.round((spent/budget)*100)):0;
              const bc=barColor(pct);
              return(
                <div key={c}>
                  <div className="row" style={{justifyContent:'space-between',marginBottom:8}}>
                    <div className="row gap10">
                      <div style={{width:38,height:38,borderRadius:11,background:`${CATEGORY_COLORS[c]}18`,
                        display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                        {CATEGORY_ICONS[c]}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>{c}</div>
                        <div style={{fontSize:11,color:'var(--faint)'}}>{fmt(spent)} / {fmt(budget)}</div>
                      </div>
                    </div>
                    <div className="row gap8" style={{alignItems:'center'}}>
                      <input type="number" value={cats[c]||''} placeholder="0"
                        onChange={e=>setCats(p=>({...p,[c]:e.target.value}))}
                        style={{width:80,padding:'6px 10px',border:'1.5px solid var(--border)',borderRadius:8,
                          fontSize:13,textAlign:'right',background:'var(--surface2)',color:'var(--text)',fontFamily:'inherit',outline:'none'}}/>
                      <span style={{fontSize:12,fontWeight:800,color:bc,minWidth:34,textAlign:'right'}}>{pct}%</span>
                    </div>
                  </div>
                  <div className="pbar">
                    <div className="pbar-fill" style={{width:`${pct}%`,background:bc}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button className="btn btn-primary" onClick={save}>💾 Save Budget</button>
      </div>
    </div>
  );
}
