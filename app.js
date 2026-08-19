const EVENT_DATE='2026-09-19';
const DOOR_HISTORY={vol9:22,vol10:30};
const doorAvg=(DOOR_HISTORY.vol9+DOOR_HISTORY.vol10)/2;

// Normalized cumulative presale curves reconstructed from Soul Out Vol.9 / Vol.10 sales data.
const vol9={33:.0454545,32:.1136364,31:.1193182,30:.125,29:.1306818,28:.1363636,27:.1477273,26:.1590909,25:.1647727,24:.1704545,23:.1761364,22:.1818182,21:.1863636,20:.1909091,19:.1954545,18:.2,17:.2045455,16:.2159091,15:.2272727,14:.2954545,13:.3181818,12:.3295455,11:.3409091,10:.3522727,9:.3636364,8:.3863636,7:.3977273,6:.4090909,5:.4318182,4:.6136364,3:.6590909,2:.7045455,1:.8863636,0:1};
const vol10={35:.04,34:.0433333,33:.0466667,32:.05,31:.0533333,30:.0566667,29:.06,28:.0633333,27:.0666667,26:.07,25:.08,24:.13,23:.135,22:.14,21:.15,20:.16,19:.2,18:.21,17:.22,16:.24,15:.2466667,14:.2533333,13:.26,12:.27,11:.3,10:.34,9:.42,8:.48,7:.5,6:.52,5:.58,4:.63,3:.68,2:.81,1:1,0:1};

function valueAt(curve,d){
  if(curve[d]!=null)return curve[d];
  const keys=Object.keys(curve).map(Number).sort((a,b)=>b-a);
  if(d>keys[0])return null;if(d<0)return 1;
  let hi=keys.find(k=>k>d),lo=[...keys].reverse().find(k=>k<d);
  if(hi==null||lo==null)return curve[hi??lo]??null;
  const t=(hi-d)/(hi-lo);return curve[hi]+(curve[lo]-curve[hi])*t;
}
function baselineAt(d){const vals=[valueAt(vol9,d),valueAt(vol10,d)].filter(v=>v!=null);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null}
function daysBefore(date){const a=new Date(date+'T00:00:00'),b=new Date(EVENT_DATE+'T00:00:00');return Math.max(0,Math.round((b-a)/86400000))}
function fmt(n){return Math.round(n).toLocaleString('zh-TW')}

function drawChart(target,current,dNow){
 const c=document.getElementById('bookingChart'),ctx=c.getContext('2d'),W=c.width,H=c.height,p={l:58,r:24,t:25,b:48};ctx.clearRect(0,0,W,H);
 const maxY=Math.max(target*1.08,current*1.2,10),x=d=>p.l+(35-d)/35*(W-p.l-p.r),y=v=>H-p.b-v/maxY*(H-p.t-p.b);
 ctx.font='12px system-ui';ctx.strokeStyle='#29292c';ctx.fillStyle='#77777a';ctx.lineWidth=1;
 for(let i=0;i<=4;i++){const v=maxY*i/4,yy=y(v);ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(W-p.r,yy);ctx.stroke();ctx.fillText(fmt(v),8,yy+4)}
 [35,28,21,14,7,0].forEach(d=>{const xx=x(d);ctx.fillText(d===0?'活動日':`D-${d}`,xx-14,H-18)});
 const series=[];for(let d=35;d>=0;d--){const b=baselineAt(d);if(b!=null)series.push([d,b*target])}
 ctx.strokeStyle='#d0b06d';ctx.lineWidth=4;ctx.beginPath();series.forEach(([d,v],i)=>i?ctx.lineTo(x(d),y(v)):ctx.moveTo(x(d),y(v)));ctx.stroke();
 const currentX=x(Math.min(35,dNow)),currentY=y(current);ctx.fillStyle='#f4f4f2';ctx.beginPath();ctx.arc(currentX,currentY,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f4f4f2';ctx.lineWidth=1;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(currentX,currentY);ctx.lineTo(currentX,H-p.b);ctx.stroke();ctx.setLineDash([]);
}

function update(){
 const current=Number(document.getElementById('currentTickets').value)||0,asOf=document.getElementById('asOfDate').value,targetAttendance=Number(document.getElementById('attendanceTarget').value)||160;
 const presaleTarget=Math.max(0,targetAttendance-doorAvg),d=daysBefore(asOf),base=baselineAt(d),expected=base==null?null:base*presaleTarget,progress=presaleTarget?current/presaleTarget:0;
 document.getElementById('kpiCurrent').textContent=fmt(current);document.getElementById('kpiCurrentPct').textContent=`預售目標的 ${(progress*100).toFixed(1)}%`;
 document.getElementById('kpiPresaleTarget').textContent=fmt(presaleTarget);document.getElementById('doorAvg').textContent=fmt(doorAvg);
 document.getElementById('kpiBaseline').textContent=expected==null?'資料不足':fmt(expected);document.getElementById('kpiBaselinePct').textContent=base==null?'歷史活動尚未開賣':`D-${d} 歷史平均 ${(base*100).toFixed(1)}%`;
 let status='資料不足',delta='尚無同期基準',sentence='目前日期早於歷史兩場活動的開賣區間，因此先累積 Vol.11 實際資料。';
 if(expected!=null){const diff=current-expected;status=diff>=0?'超前':'落後';delta=`較基準 ${diff>=0?'+':''}${fmt(diff)} 張`;sentence=`目前預售 ${fmt(current)} 張，歷史同期目標約 ${fmt(expected)} 張，${diff>=0?'領先':'落後'}約 ${fmt(Math.abs(diff))} 張。`;}
 document.getElementById('kpiStatus').textContent=status;document.getElementById('kpiDelta').textContent=delta;document.getElementById('interpretation').textContent=sentence;
 document.getElementById('remaining').textContent=`距建議預售目標還差 ${fmt(Math.max(0,presaleTarget-current))} 張；若現場票維持歷史平均 26 張，最終入場目標為 ${fmt(targetAttendance)} 人。`;
 document.getElementById('progressBar').style.width=Math.min(100,progress*100)+'%';drawChart(presaleTarget,current,d);
 localStorage.setItem('soulout11',JSON.stringify({current,asOf,targetAttendance}));
}
const saved=JSON.parse(localStorage.getItem('soulout11')||'null');if(saved){currentTickets.value=saved.current;asOfDate.value=saved.asOf;attendanceTarget.value=saved.targetAttendance}
document.getElementById('saveBtn').addEventListener('click',update);window.addEventListener('resize',update);update();