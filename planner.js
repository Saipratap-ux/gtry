/* Study planner and deadline management */
(() => {
  const $ = id => document.getElementById(id);
  function render() {
    const plans = [...SH.state.plans].sort((a,b)=>a.date.localeCompare(b.date));
    $("plannerDeadlines").innerHTML = plans.length ? plans.map(p=>`<div class="deadline-item"><div class="deadline-date"><strong>${SH.date(p.date,{day:"numeric"})}</strong><small>${SH.date(p.date,{month:"short"})}</small></div><div class="deadline-info"><strong>${SH.escape(p.title)}</strong><small>${SH.escape(p.type)} · ${SH.date(p.date,{weekday:"short",year:"numeric",month:"short",day:"numeric"})}</small></div><button class="deadline-delete" data-plan-delete="${p.id}" aria-label="Delete ${SH.escape(p.title)}">×</button></div>`).join("") : `<div class="empty-state"><strong>Your planner is clear</strong>Add an assignment, exam or study session.</div>`;
    const upcoming = plans.filter(p=>p.date >= new Date().toISOString().slice(0,10)).slice(0,3);
    $("upcomingList").innerHTML = upcoming.length ? upcoming.map(p=>`<div class="upcoming-item"><div class="date-box"><strong>${SH.date(p.date,{day:"numeric"})}</strong><small>${SH.date(p.date,{month:"short"})}</small></div><div><strong>${SH.escape(p.title)}</strong><small>${SH.escape(p.type)}</small></div></div>`).join("") : `<div class="empty-state">No upcoming deadlines yet.</div>`;
  }
  window.renderPlanner = render;
  $("planForm").addEventListener("submit", event=>{
    event.preventDefault();
    SH.state.plans.push({id:SH.id(),title:$("planTitle").value.trim(),date:$("planDate").value,type:$("planType").value});
    SH.save("plans"); $("planForm").reset(); render(); SH.toast("Added to your planner");
  });
  $("openPlanForm").addEventListener("click",()=>{$("planTitle").focus();$("planForm").scrollIntoView({behavior:"smooth",block:"center"});});
  document.addEventListener("click",event=>{
    const btn=event.target.closest("[data-plan-delete]");
    if(btn){SH.state.plans=SH.state.plans.filter(p=>p.id!==btn.dataset.planDelete);SH.save("plans");render();SH.toast("Planner item removed");}
  });
})();