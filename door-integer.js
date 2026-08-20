(function(){
  const input=document.getElementById('doorEstimate');
  if(!input)return;
  input.step='1';
  const normalize=()=>{
    const n=Number(input.value);
    if(Number.isFinite(n)) input.value=String(Math.max(0,Math.round(n)));
  };
  input.addEventListener('change',()=>{normalize();if(typeof update==='function')update();});
  input.addEventListener('blur',normalize);
  normalize();
})();
