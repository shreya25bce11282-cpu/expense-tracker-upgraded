import{useState,useEffect}from'react';
import{useApp}from'../context/AppContext';
const CATS=['Food','Transport','Shopping','Education','Entertainment','Health','Bills','Other'];
export default function ExpenseModal({onClose,edit=null}){
  const{dispatch,showToast,CATEGORY_ICONS}=useApp();
  const[f,setF]=useState({name:'',amount:'',category:'Food',date:new Date().toISOString().split('T')[0],notes:''});
  useEffect(()=>{if(edit)setF({...edit,amount:String(edit.amount)});},[edit]);
  const set=k=>v=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    if(!f.name.trim()||!f.amount||isNaN(+f.amount)||+f.amount<=0){showToast('Fill all required fields','error');return;}
    dispatch({type:edit?'EDIT_EXPENSE':'ADD_EXPENSE',payload:{...f,amount:+f.amount,...(edit?{id:edit.id}:{})}});
    showToast(edit?'Expense updated!':'Expense added!');onClose();
  };
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/>
        <div className="row" style={{justifyContent:'space-between',marginBottom:20}}>
          <h2 style={{fontSize:18,fontWeight:800,color:'var(--text)'}}>{edit?'✏️ Edit Expense':'➕ Add New Expense'}</h2>
          <button onClick={onClose} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16,color:'var(--muted)'}}>✕</button>
        </div>
        <div className="col gap16">
          {[
            {k:'name',label:'Expense Name *',placeholder:'e.g Lunch, Bus Ticket',type:'text'},
            {k:'amount',label:'Amount *',placeholder:'e.g 360',type:'number'},
          ].map(({k,label,placeholder,type})=>(
            <div key={k}>
              <label className="label">{label}</label>
              <input className="field" type={type} placeholder={placeholder} value={f[k]} onChange={e=>set(k)(e.target.value)}/>
            </div>
          ))}
          <div>
            <label className="label">Category</label>
            <select className="field" value={f.category} onChange={e=>set('category')(e.target.value)}>
              {CATS.map(c=><option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input className="field" type="date" value={f.date} onChange={e=>set('date')(e.target.value)}/>
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="field" placeholder="Add a note…" value={f.notes} onChange={e=>set('notes')(e.target.value)}/>
          </div>
          <button className="btn btn-primary" onClick={submit} style={{marginTop:4}}>
            {edit?'Update Expense':'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
