import{useState}from'react';
import{useApp}from'../context/AppContext';
export default function IncomeModal({onClose}){
  const{dispatch,showToast,state}=useApp();
  const[amt,setAmt]=useState('');const[mode,setMode]=useState('add');
  const submit=()=>{
    const v=+amt;if(!v||v<=0){showToast('Enter a valid amount','error');return;}
    dispatch({type:mode==='add'?'ADD_INCOME':'SET_INCOME',payload:v});
    showToast(`Income ${mode==='add'?'added':'set'}!`);onClose();
  };
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/>
        <div className="row" style={{justifyContent:'space-between',marginBottom:20}}>
          <h2 style={{fontSize:18,fontWeight:800,color:'var(--text)'}}>💰 Income</h2>
          <button onClick={onClose} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16,color:'var(--muted)'}}>✕</button>
        </div>
        <div className="col gap16">
          <div className="row gap8">
            {['add','set'].map(m=>(
              <button key={m} className={`chip${mode===m?' active':''}`} onClick={()=>setMode(m)}>
                {m==='add'?'+ Add to Income':'= Set Income'}
              </button>
            ))}
          </div>
          <div style={{padding:'12px 16px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
            <span style={{fontSize:13,color:'var(--muted)'}}>Current: </span>
            <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>₹{state.income.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <label className="label">Amount</label>
            <input className="field" type="number" placeholder="Enter amount" value={amt} onChange={e=>setAmt(e.target.value)}/>
          </div>
          <button className="btn btn-primary" onClick={submit}>{mode==='add'?'Add Income':'Set Income'}</button>
        </div>
      </div>
    </div>
  );
}
