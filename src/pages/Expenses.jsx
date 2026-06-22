import{useState,useMemo}from'react';
import{useApp}from'../context/AppContext';
import ExpenseModal from'../components/ExpenseModal';
import{fmt,fmtDate}from'../utils/format';
const CATS=['All','Food','Transport','Shopping','Education','Entertainment','Health','Bills','Other'];

function ConfirmDialog({message,onConfirm,onCancel}){
  return(
    <div className="confirm-dialog">
      <div className="confirm-box">
        <div style={{fontSize:44,marginBottom:12}}>🗑️</div>
        <h3 style={{fontSize:17,fontWeight:800,color:'var(--text)',marginBottom:8}}>Delete Expense?</h3>
        <p style={{fontSize:14,color:'var(--muted)',marginBottom:20,lineHeight:1.5}}>{message}</p>
        <div className="row gap10">
          <button onClick={onCancel} style={{flex:1,padding:'12px',background:'var(--surface2)',border:'1px solid var(--border)',
            borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:14,fontFamily:'inherit',color:'var(--text)'}}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{flex:1,padding:'12px',background:'#ef4444',border:'none',
            borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:14,fontFamily:'inherit',color:'white'}}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Expenses({setActive}){
  const{state,dispatch,showToast,totalExpenses,CATEGORY_ICONS,CATEGORY_COLORS}=useApp();
  const[search,setSearch]=useState('');const[cat,setCat]=useState('All');
  const[from,setFrom]=useState('');const[to,setTo]=useState('');
  const[edit,setEdit]=useState(null);const[showAdd,setShowAdd]=useState(false);
  const[confirmId,setConfirmId]=useState(null);

  const filtered=useMemo(()=>state.expenses.filter(e=>{
    const ms=!search||e.name.toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
    const mc=cat==='All'||e.category===cat;
    const mf=!from||e.date>=from;const mt=!to||e.date<=to;
    return ms&&mc&&mf&&mt;
  }),[state.expenses,search,cat,from,to]);

  const total=filtered.reduce((s,e)=>s+e.amount,0);

  const confirmDelete=id=>setConfirmId(id);
  const doDelete=()=>{
    dispatch({type:'DELETE_EXPENSE',payload:confirmId});
    showToast('Expense deleted');
    setConfirmId(null);
  };

  const expenseToConfirm=confirmId?state.expenses.find(e=>e.id===confirmId):null;

  return(
    <div className="page">
      <div className="grad-header" style={{padding:'20px 20px 24px'}}>
        <h1 style={{color:'white',margin:0,fontSize:22,fontWeight:900,letterSpacing:'-0.5px'}}>Expenses</h1>
        <p style={{color:'rgba(255,255,255,0.75)',margin:'4px 0 0',fontSize:13}}>
          {filtered.length} expense{filtered.length!==1?'s':''} · {fmt(total)}
        </p>
      </div>
      <div style={{padding:16}}>
        {/* Search */}
        <div style={{position:'relative',marginBottom:12}}>
          <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:15,color:'var(--faint)'}}>🔍</span>
          <input className="field" style={{paddingLeft:40}} placeholder="Search expenses…"
            value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {/* Cat chips */}
        <div className="chip-row mb12">
          {CATS.map(c=>(
            <button key={c} className={`chip${cat===c?' active':''}`} onClick={()=>setCat(c)}>
              {c!=='All'?CATEGORY_ICONS[c]+' ':''}{c}
            </button>
          ))}
        </div>
        {/* Date range */}
        
        <button className="btn btn-primary mb16" onClick={()=>setShowAdd(true)}>+ Add New Expense</button>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'56px 24px',color:'var(--faint)'}}>
            <div style={{fontSize:56,marginBottom:12}}>📭</div>
            <p style={{fontWeight:700,fontSize:15,color:'var(--text)',margin:'0 0 4px'}}>No expenses yet.</p>
            <p style={{fontSize:13,margin:0}}>Tap + to add your first expense.</p>
          </div>
        ):(
          <div className="col gap10 stagger">
            {filtered.map(e=>(
              <div key={e.id} className="card anim-up" style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:44,height:44,borderRadius:13,background:`${CATEGORY_COLORS[e.category]||'#6C63FF'}18`,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>
                  {CATEGORY_ICONS[e.category]||'📦'}
                </div>
                <div className="flex-1">
                  <div className="truncate" style={{fontWeight:700,fontSize:15,color:'var(--text)'}}>{e.name}</div>
                  <div style={{fontSize:12,color:'var(--faint)',marginTop:2}}>
                    <span style={{background:`${CATEGORY_COLORS[e.category]}18`,color:CATEGORY_COLORS[e.category]||'var(--primary)',
                      borderRadius:6,padding:'1px 7px',fontWeight:600,fontSize:11,marginRight:6}}>{e.category}</span>
                    {fmtDate(e.date)}
                    {e.notes&&<span style={{color:'var(--faint)'}}> · {e.notes}</span>}
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontWeight:800,color:'#ef4444',fontSize:16,marginBottom:6}}>−{fmt(e.amount)}</div>
                  <div className="row gap4">
                    <button className="btn-icon edit" onClick={()=>setEdit(e)}>Edit</button>
                    <button className="btn-icon del" onClick={()=>confirmDelete(e.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAdd&&<ExpenseModal onClose={()=>setShowAdd(false)}/>}
      {edit&&<ExpenseModal onClose={()=>setEdit(null)} edit={edit}/>}
      {confirmId&&expenseToConfirm&&(
        <ConfirmDialog
          message={`"${expenseToConfirm.name}" (${fmt(expenseToConfirm.amount)}) will be permanently deleted.`}
          onConfirm={doDelete}
          onCancel={()=>setConfirmId(null)}
        />
      )}
    </div>
  );
}
