/* Pomodoro timer */
(() => {
  const $ = id => document.getElementById(id);
  const durations = { focus:25*60, short:5*60, long:15*60 };
  let mode="focus", remaining=durations.focus, interval=null, running=false;
  const today = () => new Date().toISOString().slice(0,10);
  function render() {
    const m=Math.floor(remaining/60), s=remaining%60;
    $("timerDisplay").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    $("timerCaption").textContent=mode==="focus"?"TIME TO FOCUS":mode==="short"?"TAKE A BREATHER":"LONG BREAK";
    $("timerStart").textContent=running?"Pause":mode==="focus"?"Start focus":"Start break";
    const progress=(durations[mode]-remaining)/durations[mode];
    $("timerRing").style.background=`conic-gradient(var(--primary) ${progress*360}deg, #eeeef5 ${progress*360}deg)`;
    const count=SH.state.sessions.filter(s=>s.date===today()).length;
    $("todaySessions").textContent=count; $("sessionGoalText").textContent=`${count} of 4 sessions completed`; $("sessionBarFill").style.width=`${Math.min(count/4*100,100)}%`;
    $("statSessions").textContent=SH.state.sessions.length; $("analyticsSessions").textContent=SH.state.sessions.length; $("analyticsTodaySessions").textContent=count;
  }
  function stop(){if(interval)clearInterval(interval);interval=null;running=false;}
  function tick(){
    if(remaining>0){remaining--;render();return;}
    stop();
    if(mode==="focus"){SH.state.sessions.push({id:SH.id(),date:today(),completedAt:new Date().toISOString()});SH.save("sessions");SH.toast("Focus session complete. Take a break!");}
    else SH.toast("Break finished. Ready for another session?");
    SH.refresh();
    if("Notification" in window && Notification.permission==="granted") new Notification("StudentHub timer",{body:mode==="focus"?"Focus session complete. Take a break!":"Break finished. Ready to focus?"});
    mode=mode==="focus"?"short":"focus";remaining=durations[mode];
    document.querySelectorAll(".mode-button").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));render();
  }
  $("timerStart").addEventListener("click",()=>{
    if(running){stop();render();return;}
    running=true;render();interval=setInterval(tick,1000);
    if("Notification" in window && Notification.permission==="default") Notification.requestPermission().catch(()=>{});
  });
  $("timerReset").addEventListener("click",()=>{stop();remaining=durations[mode];render();});
  document.querySelectorAll(".mode-button").forEach(button=>button.addEventListener("click",()=>{
    stop();mode=button.dataset.mode;remaining=durations[mode];
    document.querySelectorAll(".mode-button").forEach(b=>b.classList.toggle("active",b===button));render();
  }));
  window.renderTimer=render;
  document.addEventListener("visibilitychange",()=>{if(!document.hidden && running)render();});
  render();
})();