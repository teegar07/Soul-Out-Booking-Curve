const roundedDoorAvg=Math.round(doorAvg);
const originalUpdate=update;
update=function(){
  const originalDoorAvg=doorAvg;
  try{
    window.__doorAvgOverride=roundedDoorAvg;
    const mode=document.getElementById('doorMode')?.value;
    if(mode==='auto'){
      const targetAttendance=Number(document.getElementById('attendanceTarget')?.value)||160;
      const current=Number(document.getElementById('currentTickets')?.value)||0;
      const date=document.getElementById('eventDate')?.value;
      const asOf=document.getElementById('asOfDate')?.value;
      const presaleTarget=Math.max(0,targetAttendance-roundedDoorAvg);
      const d=daysBefore(asOf,date);
      const base=baselineAt(d);
      const expected=base==null?null:base*presaleTarget;
      const progress=presaleTarget?current/presaleTarget:0;
      doorAverage.textContent=String(roundedDoorAvg);
      doorNote.textContent=`目前自動採用 ${HISTORY.length} 場歷史平均，四捨五入為 ${roundedDoorAvg} 人。`;
      kpiPresaleTarget.textContent=fmt(presaleTarget);
      kpiCurrentPct.textContent=`預售目標的 ${(progress*100).toFixed(1)}%`;
      kpiBaseline.textContent=expected==null?'資料不足':fmt(expected);
      if(base!=null)kpiBaselinePct.textContent=`D-${d} 歷史平均 ${(base*100).toFixed(1)}%`;
      eventSummary.textContent=`活動日 ${date.replaceAll('-','.')} · 入場目標 ${fmt(targetAttendance)} 人 · 預估現場 ${roundedDoorAvg} 人（歷史平均）`;
      remaining.textContent=`距預售目標還差 ${fmt(Math.max(0,presaleTarget-current))} 張；預估現場 ${roundedDoorAvg} 人後，最終入場目標 ${fmt(targetAttendance)} 人。`;
      drawChart(presaleTarget,current,d);
      return;
    }
    originalUpdate();
  } finally {
    delete window.__doorAvgOverride;
  }
};
update();