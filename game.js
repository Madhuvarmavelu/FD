const initialState = {
  club:"Northcastle United", league:"League Two", season:2026, week:1, balance:10000000,
  transferBudget:3000000, reputation:18, points:0, played:0, wins:0, draws:0, losses:0,
  goalsFor:0, goalsAgainst:0, sponsorDeals:[], facilities:{training:1,youth:1,stadium:1},
  players:[
    ["Ethan Cole","GK",26,67,650000,6500],["Marcus Reed","CB",28,65,520000,5400],["Noah Bennett","CB",23,64,480000,4200],["Liam Foster","RB",25,63,410000,3900],["Oliver Hayes","LB",22,64,450000,3700],["Daniel Brooks","CM",27,68,720000,7100],["Leo Carter","CM",21,65,540000,3600],["Mason Ward","CAM",24,66,610000,5100],["Jack Turner","RW",22,65,560000,4000],["Theo Morgan","LW",25,67,680000,5900],["Harry Wilson","ST",27,69,850000,7800],["Sam Parker","GK",20,58,150000,1500],["Ryan Ellis","CB",19,57,130000,1200],["Ben Cooper","CM",20,59,180000,1600],["Aaron Scott","RW",19,58,160000,1400],["Callum Price","ST",21,60,220000,2100],["Jamie Wood","LB",24,61,260000,2300],["Finn Murphy","CM",18,56,110000,1000]
  ],
  news:[["✦","A new era begins","The board has confirmed its long-term ambition for Northcastle United."],["⌂","Welcome to Northcastle Arena","The club's home ground is ready for a new chapter."]]
};
const market = [
 ["Dylan Shaw","ST",22,66,780000],["Alex Grant","CB",25,67,850000],["Rory King","CM",20,64,520000],["Jamie Bell","RW",21,65,690000],["Patrick Lowe","GK",24,65,600000],["Milo James","LB",19,62,420000],["Connor Dean","CAM",23,68,1100000],["Tyler Ross","CB",28,69,1250000]
];
const clubs=["Northcastle United","Bristol City","Wrexham","Portsmouth","Carlisle United","Salford City","Notts County","Crewe Alexandra","Newport County","Grimsby Town","Colchester United","Swindon Town"];
let state = loadState();
let page = "overview";
const $ = id => document.getElementById(id);
const money = n => "€"+(n/1000000).toFixed(2)+"M";
const shortMoney = n => n>=1000000?money(n):"€"+Math.round(n/1000)+"K";
function loadState(){try{return JSON.parse(localStorage.getItem("fd-career"))||structuredClone(initialState)}catch{return structuredClone(initialState)}}
function save(){localStorage.setItem("fd-career",JSON.stringify(state));toast("Career saved successfully.");}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function addNews(title,desc,icon="✦"){state.news.unshift([icon,title,desc]);state.news=state.news.slice(0,8)}
function render(){
 $("sideClub").textContent=state.club;$("sideLeague").textContent=state.league+" · England";$("sideSeason").textContent=`${state.season} / ${String(state.season+1).slice(-2)}`;
 $("dateText").textContent=`${1+((state.week-1)*7)%28} ${["July","August","September","October","November","December","January","February","March","April","May","June"][Math.floor((state.week-1)/4)%12]} ${state.season+(state.week>26?1:0)}`;
 $("balanceStat").textContent=money(state.balance);$("repStat").innerHTML=state.reputation+'<span>/100</span>';$("valueStat").textContent=money(state.players.reduce((a,p)=>a+p[4],0));
 $("positionStat").textContent=state.played?leagueRows().findIndex(r=>r.name===state.club)+1+"th":"—";
 $("transferBudget").textContent=shortMoney(state.transferBudget);$("financeBalance").textContent=money(state.balance);$("finTotal").textContent=money(state.balance);$("finTransfer").textContent=shortMoney(state.transferBudget);
 const wages=state.players.reduce((a,p)=>a+p[5],0);$("wageBill").textContent=shortMoney(wages);$("finWages").textContent=shortMoney(wages);
 $("financeObjective").textContent=state.balance>0?"100%":"0%";$("financeProgress").style.width=state.balance>0?"100%":"0%";
 $("squadCount").innerHTML=state.players.length+' <small>PLAYERS</small>';
 $("squadTable").innerHTML=state.players.map(p=>`<tr><td>${p[0]}<span class="player-sub">First team</span></td><td>${p[1]}</td><td>${20+(p[2]%9)}</td><td class="rating">${p[3]}</td><td>${shortMoney(p[4])}</td><td>${shortMoney(p[5])}</td></tr>`).join("");
 $("transferTable").innerHTML=market.filter(p=>!state.players.some(x=>x[0]===p[0])).map((p)=>`<tr><td>${p[0]}<span class="player-sub">Available for transfer</span></td><td>${p[1]}</td><td>${p[2]}</td><td class="rating">${p[3]}</td><td>${shortMoney(p[4])}</td><td><button class="small-btn" onclick="signPlayer('${p[0]}')">Make offer</button></td></tr>`).join("");
 $("newsFeed").innerHTML=state.news.map(n=>`<div class="news-item"><div class="news-icon">${n[0]}</div><div><b>${n[1]}</b><small>${n[2]}</small></div></div>`).join("");
 $("facilityGrid").innerHTML=[["training","Training ground","Improve player development and squad performance.","Player development"],["youth","Youth academy","Find and develop the next generation of talent.","Youth recruitment"],["stadium","Stadium expansion","Grow matchday income and increase capacity.","Matchday revenue"]].map(f=>`<article class="facility-card"><h3>${f[1]}</h3><p>${f[2]}</p><div class="level">CURRENT LEVEL · ${state.facilities[f[0]]}</div><button class="small-btn" onclick="upgrade('${f[0]}')">Upgrade · ${shortMoney(500000*state.facilities[f[0]])}</button></article>`).join("");
 $("leagueTable").innerHTML=leagueRows().map((r,i)=>`<tr><td>${i+1}</td><td>${r.name}</td><td>${r.played}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td class="rating">${r.pts}</td></tr>`).join("");
 $("fixturesList").innerHTML=Array.from({length:8},(_,i)=>`<div class="fixture"><span>${state.club} <small>vs</small> ${clubs[(state.week+i)%clubs.length]}</span><b>${i===0?"NEXT":`WEEK ${state.week+i}`}</b></div>`).join("");
 $("matchDate").textContent=`WEEK ${state.week}`;$("matchHome").textContent=state.club.split(" ").slice(0,1).join("");
 $("welcomeTitle").innerHTML=`Build something<br><em>worth remembering.</em>`;
}
function leagueRows(){
 const rows=clubs.map((name,i)=>({name,played:name===state.club?state.played:Math.max(0,state.played),w:name===state.club?state.wins:Math.floor((state.played*(.25+(i%3)*.08))),d:name===state.club?state.draws:Math.floor(state.played*.25),l:name===state.club?state.losses:0,pts:name===state.club?state.points:Math.floor(state.played*(1.05+(i%4)*.2))}));
 return rows.sort((a,b)=>b.pts-a.pts);
}
function signPlayer(name){
 const p=market.find(x=>x[0]===name);if(!p||state.players.some(x=>x[0]===name))return;
 if(state.transferBudget<p[4]||state.balance<p[4]){toast("Not enough funds to complete this transfer.");return}
 state.transferBudget-=p[4];state.balance-=p[4];state.players.push([...p,p[4]*.012|0]);addNews(`${name} joins Northcastle`,`${name} has signed a contract after agreeing personal terms.`,"⇄");render();toast(`${name} signed!`);
}
function upgrade(type){const cost=500000*state.facilities[type];if(state.balance<cost){toast("Insufficient club balance.");return}state.balance-=cost;state.facilities[type]++;if(type==="training")state.players.forEach(p=>{if(p[2]<25)p[3]=Math.min(85,p[3]+1)});addNews("Facility upgraded",`${type[0].toUpperCase()+type.slice(1)} facilities upgraded to level ${state.facilities[type]}.`,"⌂");render();toast("Upgrade completed.");}
function signSponsor(amount,name){if(state.sponsorDeals.includes(name)){toast("This sponsorship is already signed.");return}state.balance+=amount;state.sponsorDeals.push(name);addNews("New commercial partner",`${name} has signed a deal worth ${shortMoney(amount)}.`,"€");render();toast("Sponsorship deal signed.");}
function advanceWeek(){
 state.week++;const strength=state.players.reduce((a,p)=>a+p[3],0)/state.players.length;
 const form=Math.random();let gf,ga,result;
 if(form<.38){gf=1+Math.floor(Math.random()*3);ga=Math.floor(Math.random()*2);result=gf>ga?"win":gf===ga?"draw":"loss"}
 else if(form<.68){gf=Math.floor(Math.random()*2);ga=1+Math.floor(Math.random()*2);result=gf>ga?"win":gf===ga?"draw":"loss"}
 else{gf=Math.floor(Math.random()*3);ga=Math.floor(Math.random()*3);result=gf>ga?"win":gf===ga?"draw":"loss"}
 if(strength>66&&Math.random()>.4)gf++;
 if(result==="win"){state.wins++;state.points+=3;state.reputation=Math.min(100,state.reputation+1)}else if(result==="draw"){state.draws++;state.points++}else state.losses++;
 state.played++;state.goalsFor+=gf;state.goalsAgainst+=ga;
 const opponent=clubs[(state.week+2)%clubs.length];addNews(`${result==="win"?"Victory":result==="draw"?"A point shared":"Defeat"} against ${opponent}`,`Northcastle ${gf} – ${ga} ${opponent}. The season campaign continues.`,result==="win"?"✦":"⚽");
 const wages=state.players.reduce((a,p)=>a+p[5],0);state.balance-=wages*7;state.balance+=145000;
 if(state.week%4===0){state.balance+=250000;addNews("Monthly commercial income","Matchday and commercial revenue has been added to the club balance.","€")}
 if(state.week>52){state.season++;state.week=1;addNews("A new season begins","The club enters a new campaign with a clean league record.","♜");state.played=0;state.wins=0;state.draws=0;state.losses=0;state.points=0;state.goalsFor=0;state.goalsAgainst=0}
 render();saveSilent();toast(`Match result: ${gf}–${ga}. ${result.toUpperCase()} · Week advanced.`);
}
function saveSilent(){localStorage.setItem("fd-career",JSON.stringify(state))}
function navigate(target){page=target;document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${target}`));document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===target));const titles={overview:["CLUB OFFICE / OVERVIEW","The Boardroom"],squad:["CLUB OFFICE / SQUAD","First-team squad"],transfers:["CLUB OFFICE / RECRUITMENT","Transfer market"],finances:["CLUB OFFICE / FINANCE","Club finances"],facilities:["CLUB OFFICE / INFRASTRUCTURE","Facilities"],competition:["CLUB OFFICE / COMPETITION","League centre"]};$("pageEyebrow").textContent=titles[target][0];$("pageTitle").textContent=titles[target][1];}
document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$("advanceBtn").addEventListener("click",advanceWeek);$("saveBtn").addEventListener("click",save);
$("resetBtn").addEventListener("click",()=>{if(confirm("Start a new career? Your current local save will be replaced.")){state=structuredClone(initialState);saveSilent();render();navigate("overview");toast("A new career has begun.")}});
$("sponsorBtn").addEventListener("click",()=>signSponsor(350000,"Regional partner"));$("nationalBtn").addEventListener("click",()=>signSponsor(750000,"National brand"));
render();