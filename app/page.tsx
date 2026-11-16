"use client";
import { useMemo, useState } from "react";
import { analyseBeam } from "@/lib/analysis";

function Plot({ title, unit, points, color, symmetric=false }: { title:string; unit:string; points:{x:number;value:number}[]; color:string; symmetric?:boolean }) {
  const W=700,H=190,px=38,py=18;
  const max=Math.max(1,...points.map(p=>Math.abs(p.value)));
  const min=symmetric?-max:0, range=max-min || 1;
  const X=(v:number)=>px+v/(points[points.length-1]?.x||1)*(W-2*px);
  const Y=(v:number)=>H-py-(v-min)/range*(H-2*py);
  const zero=Y(0);
  const line=points.map((p,i)=>`${i?"L":"M"} ${X(p.x)} ${Y(p.value)}`).join(" ");
  const area=line+` L ${X(points[points.length-1]?.x||0)} ${zero} L ${X(0)} ${zero} Z`;
  return <section className="plot"><div className="plot-title"><b>{title}</b><span>{unit}</span></div><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title+" diagram"}><line x1={px} x2={W-px} y1={zero} y2={zero} stroke="#60738b" strokeDasharray="4 5"/><path d={area} fill={color} opacity=".13"/><path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round"/><text x={px} y={H-3} fill="#8798ad" fontSize="11">0 m</text><text x={W-px} y={H-3} fill="#8798ad" fontSize="11" textAnchor="end">{(points[points.length-1]?.x||0).toFixed(1)} m</text><text x={px+4} y={py+7} fill="#8798ad" fontSize="10">{max.toFixed(1)}</text></svg></section>;
}
export default function Home(){
 const [length,setLength]=useState(6),[pointLoad,setPointLoad]=useState(12),[pointPosition,setPointPosition]=useState(3),[udl,setUdl]=useState(2);
 const [steps,setSteps]=useState(true),[saving,setSaving]=useState(false),[message,setMessage]=useState("");
 const r=useMemo(()=>analyseBeam({length,pointLoad,pointPosition,udl}),[length,pointLoad,pointPosition,udl]);
 const x=(v:number)=>70+v/length*660;
 async function save(){
  setSaving(true);setMessage("");
  try{const response=await fetch("/api/analyses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({length,pointLoad,pointPosition,udl})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Save failed");setMessage("Saved analysis #"+data.analysis.id);}
  catch(e){setMessage(e instanceof Error?e.message:"Unable to save analysis");}finally{setSaving(false);}
 }
 function reset(){setLength(6);setPointLoad(12);setPointPosition(3);setUdl(2);setMessage("");}
 const peak=r.samples.reduce((a,b)=>b.moment>a.moment?b:a,r.samples[0]);
 return <main className="shell">
  <header><a className="brand" href="#"><span className="mark">B</span><span>beam<span className="blue">lab</span><small>STRUCTURAL ANALYSIS STUDIO</small></span></a><span className="top-status">● INTERACTIVE LEARNING MODE <i>BETA 0.1</i></span></header>
  <section className="hero"><div><div className="kicker">ENGINEERING, MADE VISUAL</div><h1>Understand the forces.<br/><em>See the structure.</em></h1><p>Explore how loads travel through a beam. Adjust the conditions and watch reactions, shear force and bending moment update instantly.</p></div><div className="hero-tag"><b>MODEL 01</b><strong>LIVE</strong><small>Simply supported beam</small></div></section>
  <div className="layout">
   <aside className="controls card"><div className="heading"><h2><i>01</i> Beam setup</h2><button className="link" onClick={reset}>↺ Reset</button></div><p className="muted">Define the geometry and loading conditions for your beam.</p>
    <Control label="Beam span" value={length} unit="m" min={2} max={12} step={.5} onChange={v=>{setLength(v);setPointPosition(p=>Math.min(p,v));}}/>
    <Control label="Point load (P)" value={pointLoad} unit="kN" min={0} max={40} step={.5} onChange={setPointLoad}/>
    <Control label="Load position (a)" value={pointPosition} unit="m" min={0} max={length} step={.1} onChange={setPointPosition}/>
    <Control label="Uniform load (w)" value={udl} unit="kN/m" min={0} max={10} step={.25} onChange={setUdl}/>
    <div className="note"><b>ⓘ Model assumptions</b><p>Pin and roller supports, a prismatic beam, static loading. The UDL acts across the full span.</p></div>
    <button className="save" onClick={save} disabled={saving}>{saving?"Saving…":"Save this analysis"} <span>↗</span></button>{message&&<p className="message">{message}</p>}<p className="hint">Saving requires your Neon database to be connected.</p>
   </aside>
   <section className="results">
    <section className="card beam-card"><div className="heading"><h2><i>02</i> Loading diagram</h2><span className="live">● LIVE MODEL</span></div><p className="muted">Simply supported beam · vertical loading</p>
     <svg viewBox="0 0 800 205" role="img" aria-label="Beam loading and support reactions" className="beam">
      {udl>0&&<><line x1="70" y1="55" x2="730" y2="55" stroke="#e7aa55" strokeWidth="2"/>{Array.from({length:17},(_,i)=>{const xx=70+i*41.25;return <g key={i}><line x1={xx} y1="55" x2={xx} y2="94" stroke="#e7aa55"/><path d={`M ${xx-4} 87 L ${xx} 96 L ${xx+4} 87`} fill="none" stroke="#e7aa55"/></g>})}</>}
      {pointLoad>0&&<g><line x1={x(pointPosition)} y1="12" x2={x(pointPosition)} y2="99" stroke="#ff827c" strokeWidth="2.5"/><path d={`M ${x(pointPosition)-7} 88 L ${x(pointPosition)} 101 L ${x(pointPosition)+7} 88`} fill="none" stroke="#ff827c" strokeWidth="2.5"/><text x={x(pointPosition)} y="12" fill="#ffaaa3" fontSize="13" textAnchor="middle">{pointLoad.toFixed(1)} kN</text></g>}
      <line x1="70" y1="106" x2="730" y2="106" stroke="#dce7f4" strokeWidth="5" strokeLinecap="round"/><path d="M 56 141 L 70 112 L 84 141 Z" fill="#6e9fe1" fillOpacity=".2" stroke="#6e9fe1"/><path d="M 716 112 L 730 139 L 744 112 Z" fill="#6e9fe1" fillOpacity=".2" stroke="#6e9fe1"/><line x1="48" y1="144" x2="92" y2="144" stroke="#6e9fe1"/><line x1="708" y1="142" x2="752" y2="142" stroke="#6e9fe1"/>
      <text x="70" y="166" fill="#65c6a3" fontSize="12" textAnchor="middle">RA {r.reactionA.toFixed(2)} kN</text><text x="730" y="166" fill="#65c6a3" fontSize="12" textAnchor="middle">RB {r.reactionB.toFixed(2)} kN</text><text x="70" y="185" fill="#93a4ba" fontSize="10" textAnchor="middle">A · PIN</text><text x="730" y="185" fill="#93a4ba" fontSize="10" textAnchor="middle">B · ROLLER</text><text x="400" y="132" fill="#93a4ba" fontSize="11" textAnchor="middle">{length.toFixed(1)} m span</text>
     </svg><div className="legend"><span>● Point load</span><span>● Distributed load</span><span>● Support reaction</span></div>
    </section>
    <div className="metrics"><Metric label="LEFT REACTION · RA" value={r.reactionA.toFixed(2)} unit="kN"/><Metric label="RIGHT REACTION · RB" value={r.reactionB.toFixed(2)} unit="kN"/><Metric label="MAX BENDING MOMENT" value={r.maxMoment.toFixed(2)} unit="kN·m"/></div>
    <div className="plots"><Plot title="Shear force diagram" unit="kN" points={r.samples.map(p=>({x:p.x,value:p.shear}))} color="#e7aa55" symmetric/><Plot title="Bending moment diagram" unit="kN·m" points={r.samples.map(p=>({x:p.x,value:p.moment}))} color="#65c6a3"/></div>
    <section className="card breakdown"><button className="heading step-toggle" onClick={()=>setSteps(!steps)}><h2><i>03</i> Calculation breakdown</h2><b>{steps?"−":"+"}</b></button><p className="muted">Follow the equilibrium equations behind the results.</p>{steps&&<div className="steps">
      <Step n="01" title="Total vertical load" formula="W = P + wL" detail={`W = ${pointLoad.toFixed(2)} + (${udl.toFixed(2)} × ${length.toFixed(2)}) = ${r.totalLoad.toFixed(2)} kN`}/>
      <Step n="02" title="Moments about support A" formula="ΣMA = 0: RB × L = P × a + wL² / 2" detail={`RB = [${pointLoad.toFixed(2)} × ${pointPosition.toFixed(2)} + ${udl.toFixed(2)} × ${length.toFixed(2)}² / 2] / ${length.toFixed(2)} = ${r.reactionB.toFixed(2)} kN`}/>
      <Step n="03" title="Vertical force equilibrium" formula="ΣFy = 0: RA + RB = P + wL" detail={`RA = ${r.totalLoad.toFixed(2)} − ${r.reactionB.toFixed(2)} = ${r.reactionA.toFixed(2)} kN`}/>
      <Step n="04" title="Bending moment function" formula="M(x) = RA·x − P·max(0, x−a) − wx²/2" detail={`Peak sampled moment ≈ ${r.maxMoment.toFixed(2)} kN·m near x = ${peak.x.toFixed(2)} m.`}/>
     </div>}</section><p className="disclaimer">BeamLab is an educational visualization tool. Verify structural calculations independently before applying them to real designs.</p>
   </section>
  </div><footer>BEAMLAB · LEARN THE LOGIC OF STRUCTURES <span>BUILT FOR CURIOUS ENGINEERS</span></footer>
 </main>;
}
function Control({label,value,unit,min,max,step,onChange}:{label:string;value:number;unit:string;min:number;max:number;step:number;onChange:(v:number)=>void}){return <div className="control"><div><label>{label}</label><output>{value.toFixed(1)} <small>{unit}</small></output></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/><div className="range-labels"><span>{min} {unit}</span><span>{max} {unit}</span></div></div>}
function Metric({label,value,unit}:{label:string;value:string;unit:string}){return <div className="card metric"><span>{label}</span><strong>{value} <small>{unit}</small></strong><p>Calculated from static equilibrium</p></div>}
function Step({n,title,formula,detail}:{n:string;title:string;formula:string;detail:string}){return <div className="step"><span>{n}</span><div><b>{title}</b><code>{formula}</code><p>{detail}</p></div></div>}
