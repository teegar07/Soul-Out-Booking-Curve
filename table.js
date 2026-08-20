function renderBookingTable(){
  const tbody=document.getElementById('bookingTableBody');
  if(!tbody)return;
  const targetAttendance=Number(document.getElementById('attendanceTarget').value)||160;
  const mode=document.getElementById('doorMode').value;
  const customDoor=Number(document.getElementById('doorEstimate').value)||0;
  const door=mode==='auto'?doorAvg:customDoor;
  const presaleTarget=Math.max(0,targetAttendance-door);
  const eventDate=document.getElementById('eventDate').value;
  const asOf=document.getElementById('asOfDate').value;
  const currentD=daysBefore(asOf,eventDate);
  const rows=[];
  for(let d=35;d>=1;d--){
    const pct=baselineAt(d);
    if(pct==null)continue;
    const expected=Math.round(pct*presaleTarget);
    rows.push(`<tr class="${d===currentD?'current-row':''}"><td>D-${d}${d===currentD?'（目前）':''}</td><td class="pct">${(pct*100).toFixed(1)}%</td><td>${expected.toLocaleString('zh-TW')} 張</td></tr>`);
  }
  rows.push(`<tr class="${currentD===0?'current-row':''}"><td>活動日${currentD===0?'（目前）':''}</td><td class="pct">100.0%</td><td>${Math.round(presaleTarget).toLocaleString('zh-TW')} 張</td></tr>`);
  tbody.innerHTML=rows.join('');
}
['saveBtn','doorMode','attendanceTarget','doorEstimate','eventDate','asOfDate'].forEach(id=>{
  const el=document.getElementById(id);
  if(!el)return;
  el.addEventListener(id==='saveBtn'?'click':'change',()=>setTimeout(renderBookingTable,0));
});
renderBookingTable();