/* 
  Merasim — PWA & Mobile Ready
  Add to HTML <head>:
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#111827">
*/
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import LandingPage from "./pages/Landing";
import AuthPage from "./pages/Auth";
import PublicInvitePage from "./pages/PublicInvite";
import PublicGalleryPage from "./pages/PublicGallery";
import { useAuth, useData } from "./lib/AuthContext";
import { supabase } from "./lib/supabase";

const initEvents = [
  { id:1, type:"Nişan",            client:"Ayşe & Mehmet",  date:"2026-06-02", time:"18:00", guests:80,  status:"confirmed", payment:"kapora",  location:"Bahçelievler Salonu", tasks:12, done:8,  budget:15000, paid:5000,  phone:"0532 111 2233", notes:"Kırmızı & altın tema, canlı müzik." },
  { id:2, type:"Doğum Günü",       client:"Zeynep Kaya",    date:"2026-06-05", time:"15:00", guests:35,  status:"pending",   payment:"bekliyor", location:"Ev / Bahçe",          tasks:7,  done:3,  budget:8000,  paid:0,     phone:"0541 333 4455", notes:"Unicorn teması, pasta özel sipariş." },
  { id:3, type:"Kına",             client:"Fatma Demir",    date:"2026-06-08", time:"20:00", guests:120, status:"confirmed", payment:"tam",      location:"Grand Hall",          tasks:15, done:15, budget:22000, paid:22000, phone:"0505 666 7788", notes:"Tüm görevler tamamlandı." },
  { id:4, type:"Baby Shower",      client:"Selin Arslan",   date:"2026-06-12", time:"14:00", guests:25,  status:"confirmed", payment:"kapora",   location:"Cafe Bloom",          tasks:9,  done:5,  budget:6000,  paid:2000,  phone:"0533 999 0011", notes:"Pembe & beyaz, kız bebek." },
  { id:5, type:"Evlilik Teklifi",  client:"Ali Yıldız",     date:"2026-06-15", time:"21:00", guests:2,   status:"pending",   payment:"bekliyor", location:"Boğaz Teknesi",       tasks:6,  done:1,  budget:12000, paid:0,     phone:"0551 222 3344", notes:"Sürpriz - gizlilik kritik." },
  { id:6, type:"Cinsiyet Partisi", client:"Ece & Burak",    date:"2026-06-18", time:"16:00", guests:45,  status:"confirmed", payment:"kapora",   location:"Pembe Villa",         tasks:10, done:6,  budget:9000,  paid:3000,  phone:"0542 555 6677", notes:"Konfeti patlama anı istiyor." },
  { id:7, type:"Kurumsal",         client:"TechCorp A.Ş.",  date:"2026-06-22", time:"10:00", guests:200, status:"confirmed", payment:"tam",      location:"İstanbul Congress",   tasks:20, done:20, budget:45000, paid:45000, phone:"0212 444 5566", notes:"Yıllık toplantı + gala yemeği." },
];

const initTasks = [
  { id:1, eventId:1, task:"Çiçek yerleşimi",       status:"devam",       assignee:"Elif H.",  priority:"yuksek" },
  { id:2, eventId:1, task:"Ses sistemi kontrolü",  status:"bekliyor",    assignee:"Murat K.", priority:"orta"   },
  { id:3, eventId:1, task:"Masa kurulumu",          status:"tamamlandı",  assignee:"Selin T.", priority:"yuksek" },
  { id:4, eventId:1, task:"Karşılama panosu",       status:"bekliyor",    assignee:"Derya C.", priority:"orta"   },
  { id:5, eventId:2, task:"Pasta teslimi",          status:"bekliyor",    assignee:"Selin T.", priority:"yuksek" },
  { id:6, eventId:2, task:"Balon dekorasyonu",      status:"devam",       assignee:"Elif H.",  priority:"orta"   },
  { id:7, eventId:4, task:"Pembe balon kemeri",     status:"devam",       assignee:"Elif H.",  priority:"orta"   },
  { id:8, eventId:5, task:"Lokasyon keşfi",         status:"bekliyor",    assignee:"Murat K.", priority:"yuksek" },
  { id:9, eventId:5, task:"Gül yaprakları sipariş", status:"bekliyor",    assignee:"Selin T.", priority:"orta"   },
  { id:10,eventId:6, task:"Konfeti top hazırlığı",  status:"devam",       assignee:"Derya C.", priority:"yuksek" },
];

const initGuests = [
  { id:1, eventId:1, name:"Hasan Kara",    phone:"0532 100 1111", response:"katılıyor",   plus:1, children:0, food:"normal"     },
  { id:2, eventId:1, name:"Nermin Çelik",  phone:"0541 200 2222", response:"katılamıyor",  plus:0, children:0, food:"-"          },
  { id:3, eventId:1, name:"Bülent Yavuz",  phone:"0505 300 3333", response:"belki",       plus:2, children:1, food:"vejeteryan"  },
  { id:4, eventId:1, name:"Derya Şahin",   phone:"0533 400 4444", response:"katılıyor",   plus:1, children:2, food:"normal"     },
  { id:5, eventId:1, name:"Orhan Aslan",   phone:"0551 500 5555", response:"katılıyor",   plus:0, children:0, food:"vegan"      },
];

const initGallery = [
  { id:1, eventId:3, url:"https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80", approved:true  },
  { id:2, eventId:3, url:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80", approved:true  },
  { id:3, eventId:3, url:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80", approved:false },
  { id:4, eventId:1, url:"https://images.unsplash.com/photo-1485872299829-c673f5194813?w=400&q=80", approved:true  },
  { id:5, eventId:1, url:"https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80", approved:true  },
  { id:6, eventId:4, url:"https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80", approved:true  },
];

const initStaff = [
  { id:1, name:"Elif Hanım",   role:"Dekorasyon",     phone:"0532 100 0001", email:"elif@beka.com",  status:"aktif", events:4, avatar:"E", color:"#8b5cf6" },
  { id:2, name:"Murat Kaya",   role:"Teknik & Ses",   phone:"0541 200 0002", email:"murat@beka.com", status:"aktif", events:3, avatar:"M", color:"#60a5fa" },
  { id:3, name:"Selin Taş",    role:"Koordinator",    phone:"0505 300 0003", email:"selin@beka.com", status:"aktif", events:5, avatar:"S", color:"#34d399" },
  { id:4, name:"Ahmet Yılmaz", role:"Fotoğrafçı",     phone:"0533 400 0004", email:"ahmet@beka.com", status:"pasif", events:2, avatar:"A", color:"#fb923c" },
  { id:5, name:"Derya Can",    role:"Misafir Karş.",  phone:"0551 500 0005", email:"derya@beka.com", status:"aktif", events:3, avatar:"D", color:"#f472b6" },
];

const WA_TEMPLATES = [
  { id:1, name:"Rezervasyon Onayı",   icon:"\u2705", trigger:"Otomatik - Rezervasyon sonrası", cat:"rezervasyon",
    body:"Merhaba {isim},\n\n{etkinlik_türü} organizasyonunuz için rezervasyonunuz alındı!\n\nTarih: {tarih}\nSaat: {saat}\nLokasyon: {lokasyon}\n\nEkibimiz sizinle iletişime gececektir.\n\nMerasim" },
  { id:2, name:"Randevu Hatırlatma",  icon:"\uD83D\uDCC5", trigger:"Otomatik - 24 saat önce",      cat:"hatırlatma",
    body:"Merhaba {isim},\n\nYarın saat {saat}'de {lokasyon} adresinde görüşmemiz var.\n\nGörüşmek üze!\nMerasim" },
  { id:3, name:"Etkinlik Yaklaşıyor",  icon:"\uD83C\uDF89", trigger:"Otomatik - 3 gün önce",        cat:"hatırlatma",
    body:"Merhaba {isim}!\n\n{etkinlik_türü} etkinliğinize {gun} gün kaldı!\n\nHazırlıklarınız tamamlanıyor.\n\nMerasim" },
  { id:4, name:"Galeri Paylaşımı",    icon:"\uD83D\uDCF8", trigger:"Manuel - Etkinlik sonrası",    cat:"galeri",
    body:"Merhaba {isim}!\n\nEtkinliginizin fotoğraflari galerinize yüklendi!\n\n{galeri_link}\n\nMerasim" },
  { id:5, name:"Ödeme Hatırlatma",    icon:"\uD83D\uDCB3", trigger:"Otomatik - Ödeme gecikmesinde",cat:"odeme",
    body:"Merhaba {isim},\n\nKalan ödemeniz ({tutar} TL) için hatırlatma.\n\nMerasim" },
  { id:6, name:"Davetiye Linki",      icon:"\uD83D\uDC8C", trigger:"Manuel - Davetiye hazırlandiginda", cat:"davetiye",
    body:"Merhaba {isim}!\n\nDijital davetiyeniz hazır!\n\n{davetiye_link}\n\nMerasim" },
];

const NOTIFS_INIT = [
  { id:1, icon:"\uD83D\uDCB3", text:"Zeynep Kaya'nın odemesi bekliyor",       time:"2 saat önce", read:false, page:"payments"    },
  { id:2, icon:"\u2705",       text:"Fatma Demir - Tüm görevler tamamlandı",  time:"4 saat önce", read:false, page:"tasks"       },
  { id:3, icon:"\uD83D\uDCE9", text:"Nişan davetiyesine 3 yeni RSVP geldi",  time:"6 saat önce", read:true,  page:"invitations" },
  { id:4, icon:"\uD83D\uDCC5", text:"Ali Yıldız rezervasyonu onay bekliyor",  time:"1 gün önce",  read:true,  page:"events"      },
  { id:5, icon:"\uD83D\uDCF8", text:"Kına galerisine 12 yeni foto yüklendi", time:"1 gün önce",  read:true,  page:"gallery"     },
];

const EVENT_ICONS = { "Nişan":"\uD83D\uDC8D","Doğum Günü":"\uD83C\uDF82","Kına":"\uD83C\uDF3F","Baby Shower":"\uD83C\uDF7C","Evlilik Teklifi":"\uD83C\uDF39","Söz":"\uD83D\uDC8E","Cinsiyet Partisi":"\uD83C\uDF80","Kurumsal":"\uD83C\uDFE2","Nişan (Eng)":"\uD83D\uDC8D" };
const getIcon = (type) => {
  if(type && type.includes("Ni")) return "\uD83D\uDC8D";
  if(type && type.includes("Do")) return "\uD83C\uDF82";
  if(type && type.includes("K\u0131")) return "\uD83C\uDF3F";
  if(type && type.includes("Baby")) return "\uD83C\uDF7C";
  if(type && type.includes("Evli")) return "\uD83C\uDF39";
  if(type && type.includes("S\u00f6z")) return "\uD83D\uDC8E";
  if(type && type.includes("Cinsi")) return "\uD83C\uDF80";
  if(type && type.includes("Kurum")) return "\uD83C\uDFE2";
  return "\uD83C\uDF89";
};
const EVENT_TYPES = ["Nişan","Doğum Günü","Kına","Baby Shower","Evlilik Teklifi","Söz","Cinsiyet Partisi","Kurumsal"];
const PAY_COL = { tam:{bg:"bg-emerald-500/15",tx:"text-emerald-400"}, kapora:{bg:"bg-blue-500/15",tx:"text-blue-400"}, bekliyor:{bg:"bg-rose-500/15",tx:"text-rose-400"} };
const TASK_COL = { devam:{bg:"bg-blue-500/15",tx:"text-blue-400",label:"Devam"}, bekliyor:{bg:"bg-amber-500/15",tx:"text-amber-400",label:"Bekliyor"}, tamamlandı:{bg:"bg-emerald-500/15",tx:"text-emerald-400",label:"Tamam"} };
const MONTH_NAMES=["Ocak","Şubat","Mart","Nişan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DAY_NAMES=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

// Dini bayramlar yıllara göre (Hicri takvim tahmini)
const BAYRAMLAR = {
  2026: { ramazan:[[2,20],[2,21],[2,22]], kurban:[[4,27],[4,28],[4,29],[4,30]] },
  2027: { ramazan:[[2,9],[2,10],[2,11]], kurban:[[4,16],[4,17],[4,18],[4,19]] },
  2028: { ramazan:[[1,27],[1,28],[1,29]], kurban:[[4,5],[4,6],[4,7],[4,8]] },
  2029: { ramazan:[[1,14],[1,15],[1,16]], kurban:[[3,24],[3,25],[3,26],[3,27]] },
  2030: { ramazan:[[1,3],[1,4],[1,5]], kurban:[[4,13],[4,14],[4,15],[4,16]] },
};
// Anneler Günü: Mayısın 2. Pazarı, Babalar Günü: Haziranın 3. Pazarı
const nthSunday=(year,month,n)=>{let d=0,count=0;while(count<n){d++;if(new Date(year,month,d).getDay()===0)count++;}return d;};
const getMothersDay=y=>nthSunday(y,4,2);
const getFathersDay=y=>nthSunday(y,5,3);

const getHolidaysForYear=(year)=>{
  const fixed=[
    { month:0,  day:1,  name:"Yılbaşı",                        icon:"🎆", type:"resmi" },
    { month:1,  day:14, name:"Sevgililer Günü",                 icon:"❤️",  type:"ozel" },
    { month:3,  day:23, name:"Ulusal Egemenlik ve Çocuk Bayramı", icon:"🇹🇷", type:"resmi" },
    { month:4,  day:1,  name:"Emek ve Dayanışma Günü",          icon:"⚒️",  type:"resmi" },
    { month:4,  day:19, name:"Atatürk'ü Anma, Gençlik ve Spor Bayramı", icon:"🏃", type:"resmi" },
    { month:6,  day:15, name:"Demokrasi ve Millî Birlik Günü",  icon:"🇹🇷", type:"resmi" },
    { month:7,  day:30, name:"Zafer Bayramı",                   icon:"🏆", type:"resmi" },
    { month:9,  day:29, name:"Cumhuriyet Bayramı",              icon:"🇹🇷", type:"resmi" },
    { month:10, day:10, name:"Atatürk'ü Anma Günü",            icon:"🕯️",  type:"ozel" },
    { month:10, day:24, name:"Öğretmenler Günü",                icon:"📚", type:"ozel" },
    { month:11, day:31, name:"Yılbaşı Arifesi",                 icon:"🎉", type:"ozel" },
  ];
  const mothersDay=getMothersDay(year);
  const fathersDay=getFathersDay(year);
  fixed.push({ month:4, day:mothersDay, name:`Anneler Günü (${year})`, icon:"👩", type:"ozel" });
  fixed.push({ month:5, day:fathersDay, name:`Babalar Günü (${year})`, icon:"👨", type:"ozel" });
  const bayramlar=BAYRAMLAR[year];
  if(bayramlar){
    bayramlar.ramazan.forEach(([m,d],i)=>fixed.push({ month:m, day:d, name:`Ramazan Bayramı ${i+1}. Gün (${year})`, icon:"🌙", type:"bayram" }));
    bayramlar.kurban.forEach(([m,d],i)=>fixed.push({ month:m, day:d, name:`Kurban Bayramı ${i+1}. Gün (${year})`, icon:"🐑", type:"bayram" }));
  }
  return fixed;
};
const getHoliday=(y,m,d)=>getHolidaysForYear(y).filter(h=>h.month===m&&h.day===d);

/* ── SHARED UI ─────────────────────────────────── */
function Badge({ children, color="purple", className="" }) {
  const m={purple:"bg-purple-500/15 text-purple-300",green:"bg-emerald-500/15 text-emerald-400",amber:"bg-amber-500/15 text-amber-400",red:"bg-rose-500/15 text-rose-400",blue:"bg-blue-500/15 text-blue-400",pink:"bg-pink-500/15 text-pink-400",gray:"bg-white/8 text-white/40"};
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${m[color]||m.gray} ${className}`}>{children}</span>;
}
function Card({children,className="",onClick}) {
  return <div onClick={onClick} className={`rounded-2xl border border-white/[0.1] backdrop-blur-xl ${onClick?"cursor-pointer hover:border-white/[0.1] transition-all duration-300":""} ${className}`} style={{background:"rgba(255,255,255,0.06)",boxShadow:"0 4px 30px rgba(0,0,0,0.1)"}}>{children}</div>;
}
function GlassBtn({children,onClick,className="",disabled=false}) {
  return <button onClick={onClick} disabled={disabled} className={`px-3 py-2 rounded-xl text-xs font-medium text-white/50 border border-white/[0.1] hover:border-white/[0.12] hover:text-white/80 transition-all duration-300 backdrop-blur-sm disabled:opacity-30 ${className}`}>{children}</button>;
}
function SectionHeader({title,right}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.1] backdrop-blur-sm">
      <h2 className="text-sm font-semibold text-white/80">{title}</h2>
      {right&&<div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
function FieldInput({label,type="text",value,onChange,placeholder,rows}) {
  const cls="w-full px-3 py-2.5 rounded-xl text-sm text-white/80 bg-white/3 border border-white/3 focus:border-purple-500/50 outline-none transition-colors placeholder-white/20";
  return (
    <div>
      {label&&<label className="text-xs text-white/40 mb-1.5 block">{label}</label>}
      {rows?<textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} className={cls+" resize-none"}/>
            :<input type={type} value={value} onChange={onChange} placeholder={placeholder} className={cls}/>}
    </div>
  );
}
function FieldSelect({label,value,onChange,options}) {
  return (
    <div>
      {label&&<label className="text-xs text-white/40 mb-1.5 block">{label}</label>}
      <select value={value} onChange={onChange} className="w-full px-3 py-2.5 rounded-xl text-sm text-white/80 bg-[#0f0f1c] border border-white/3 focus:border-purple-500/50 outline-none transition-colors">
        {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  );
}
function StatBox({label,value,sub,icon,color}) {
  return (
    <div className="rounded-2xl border border-white/3 p-5 relative overflow-hidden" style={{background:"rgba(255,255,255,0.05)"}}>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-[0.08]" style={{background:color}}/>
      <div className="text-xl mb-3" style={{color}}>{icon}</div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
      {sub&&<div className="text-[10px] text-white/35 mt-0.5">{sub}</div>}
    </div>
  );
}
function Modal({open,onClose,title,children,width="max-w-lg"}) {
  if(!open)return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.75)"}} onClick={onClose}>
      <div className={`w-full ${width} rounded-2xl border border-white/3 overflow-hidden`} style={{background:"rgba(17,24,39,0.8)"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/3">
          <h3 className="text-sm font-semibold text-white/85">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-lg leading-none">x</button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
function Drawer({open,onClose,title,children,width="w-96"}) {
  return (
    <>
      {open&&<div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}/>}
      <div className={`fixed top-0 right-0 h-full z-50 border-l border-white/3 overflow-auto transition-transform duration-300 ${width} ${open?"translate-x-0":"translate-x-full"}`}
        style={{background:"rgba(15,15,28,0.9)"}}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/3">
          <h2 className="text-sm font-semibold text-white/85">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl leading-none">x</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}


/* ── GLOBAL SEARCH ─────────────────────────────── */
function GlobalSearch({events,setPage,onClose}) {
  const [q,setQ]=useState("");
  const ref=useRef();
  useEffect(()=>{ref.current?.focus();},[]);
  const results=q.length>1?events.filter(e=>
    e.client.toLowerCase().includes(q.toLowerCase())||
    e.type.toLowerCase().includes(q.toLowerCase())||
    e.location.toLowerCase().includes(q.toLowerCase())
  ):[];
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24" style={{background:"rgba(0,0,0,0.82)"}} onClick={onClose}>
      <div className="w-full max-w-xl mx-4 rounded-2xl border border-white/3 overflow-hidden" style={{background:"rgba(17,24,39,0.8)"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/3">
          <span className="text-white/40">&#128269;</span>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Müşteri, etkinlik türü veya lokasyon ara..."
            className="flex-1 bg-transparent text-white/85 placeholder-white/25 outline-none text-sm"/>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xs">ESC</button>
        </div>
        {results.length>0?(
          <div className="divide-y divide-white/5 max-h-72 overflow-auto">
            {results.map(ev=>(
              <div key={ev.id} onClick={()=>{setPage("events");onClose();}}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 cursor-pointer transition-colors">
                <span className="text-2xl">{getIcon(ev.type)}</span>
                <div>
                  <div className="text-sm text-white/80">{ev.client}</div>
                  <div className="text-[10px] text-white/45">{ev.type} - {ev.date} - {ev.location}</div>
                </div>
                <Badge className="ml-auto" color={ev.status==="confirmed"?"green":"amber"}>{ev.status==="confirmed"?"Onaylandı":"Bekliyor"}</Badge>
              </div>
            ))}
          </div>
        ):q.length>1?(
          <div className="px-4 py-6 text-center text-sm text-white/35">Sonuç bulunamadı</div>
        ):(
          <div className="px-4 py-4 text-xs text-white/40">Aramak için yazmaya baslayin...</div>
        )}
      </div>
    </div>
  );
}

/* ── DASHBOARD ─────────────────────────────────── */
function DashboardPage({events,tasks,setPage}) {
  const [dashMonth,setDashMonth]=useState(new Date().getMonth());
  const [dashYear,setDashYear]=useState(new Date().getFullYear());
  const dashOffset=new Date(dashYear,dashMonth,1).getDay()===0?6:new Date(dashYear,dashMonth,1).getDay()-1;
  const total=events.length, conf=events.filter(e=>e.status==="confirmed").length;
  const pendPay=events.filter(e=>e.payment==="bekliyor").length;
  const guests=events.reduce((s,e)=>s+e.guests,0);
  const revenue=events.reduce((s,e)=>s+e.paid,0);
  const openTasks=tasks.filter(t=>t.status!=="tamamlandı");
  const monthlyVals=[32,28,45,51,60,77,0,0,0,0,0,0];
  const maxVal=Math.max(...monthlyVals,1);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatBox label="Etkinlik"       value={total}    sub="Bu ay"            icon="&#9672;" color="#8b5cf6"/>
        <StatBox label="Onaylandı"         value={conf}     sub={`${total-conf} bekliyor`} icon="&#9689;" color="#34d399"/>
        <StatBox label="Ödeme Bekliyor" value={pendPay}  sub="etkinlik"         icon="&#9680;" color="#fb923c"/>
        <StatBox label="Misafir"        value={guests}   sub="Bu ay"            icon="&#9676;" color="#60a5fa"/>
        <StatBox label="Tahsilat"       value={`${(revenue/1000).toFixed(0)}k`} sub="Bu ay" icon="&#9677;" color="#f472b6"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <SectionHeader title="Yaklaşan Etkinlikler" right={<button onClick={()=>setPage("events")} className="text-xs text-white/40 hover:text-white/60 transition-colors">Hepsi</button>}/>
          <div className="divide-y divide-white/5">
            {events.slice(0,5).map(ev=>(
              <div key={ev.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={()=>setPage("events")}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{background:"rgba(139,92,246,0.1)"}}>
                  {getIcon(ev.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white/85 truncate">{ev.client}</div>
                  <div className="text-[10px] text-white/45 truncate">{ev.type} - {ev.date} {ev.time} - {ev.location}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge color={ev.payment==="tam"?"green":ev.payment==="kapora"?"blue":"red"}>{ev.payment}</Badge>
                  {ev.status==="confirmed"?(
                    <Badge color="green">Onaylandı</Badge>
                  ):(
                    <button onClick={(e)=>{e.stopPropagation();updateEvent(ev.id,{status:"confirmed"});}}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors font-medium">
                      Onayla
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 w-20 flex-shrink-0">
                  <div className="flex-1 h-1 rounded-full bg-white/10">
                    <div className="h-1 rounded-full" style={{width:`${(ev.done/ev.tasks)*100}%`,background:ev.done===ev.tasks?"#34d399":"#8b5cf6"}}/>
                  </div>
                  <span className="text-[10px] text-white/40">{ev.done}/{ev.tasks}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <SectionHeader title="Açık Görevler" right={<button onClick={()=>setPage("tasks")} className="text-xs text-white/40 hover:text-white/60 transition-colors">Hepsi</button>}/>
          <div className="divide-y divide-white/5">
            {openTasks.slice(0,6).map(t=>{
              const ev=events.find(e=>e.id===t.eventId);
              return (
                <div key={t.id} className="px-5 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors" onClick={()=>setPage("tasks")}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white/80 truncate">{t.task}</div>
                      <div className="text-[10px] text-white/40 mt-0.5 truncate">{ev?.client}</div>
                    </div>
                    <Badge color={t.status==="devam"?"blue":"amber"}>{TASK_COL[t.status]?.label||t.status}</Badge>
                  </div>
                  <div className="text-[10px] text-white/35 mt-1.5">&#128100; {t.assignee}</div>
                </div>
              );
            })}
            {openTasks.length===0&&<div className="px-5 py-8 text-center text-xs text-white/30">Tüm görevler tamamlandı!</div>}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={()=>{setDashMonth(m=>{if(m===0){setDashYear(y=>y-1);return 11;}return m-1;});}} className="px-2 py-1 rounded-lg text-xs text-white/40 hover:text-white border border-white/5 hover:border-white/15 transition-colors">‹</button>
            <h2 className="text-sm font-semibold text-white/70">{MONTH_NAMES[dashMonth]} {dashYear}</h2>
            <button onClick={()=>{setDashMonth(m=>{if(m===11){setDashYear(y=>y+1);return 0;}return m+1;});}} className="px-2 py-1 rounded-lg text-xs text-white/40 hover:text-white border border-white/5 hover:border-white/15 transition-colors">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map(d=><div key={d} className="text-[10px] text-white/35 pb-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length:new Date(dashYear,dashMonth+1,0).getDate()+dashOffset},(_,i)=>i<dashOffset?null:i-dashOffset+1).map((day,i)=>{
              if(!day)return<div key={`e${i}`} style={{opacity:0.3}}/>;
              const now=new Date();
              const isToday=day===now.getDate()&&dashMonth===now.getMonth()&&dashYear===now.getFullYear();
              const hasEv=events.some(e=>{const d=new Date(e.date);return d.getFullYear()===dashYear&&d.getMonth()===dashMonth&&d.getDate()===day;});
              const holidays=getHoliday(dashYear,dashMonth,day);
              const hasHoliday=holidays.length>0;
              return (
                <div key={day} onClick={()=>setPage("calendar")}
                  className="aspect-square flex items-center justify-center rounded-lg text-xs cursor-pointer hover:bg-white/5 relative transition-all select-none"
                  style={{background:hasHoliday?"rgba(251,191,36,0.12)":isToday?"rgba(139,92,246,0.2)":"transparent",color:hasHoliday?"#fbbf24":isToday?"#8b5cf6":hasEv?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.3)",fontWeight:isToday||hasHoliday?"700":"400"}}>
                  {day}
                  {hasEv&&!isToday&&!hasHoliday&&<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400"/>}
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Hizli Islemler</h2>
          <div className="space-y-2">
            {[{icon:"&#128203;",label:"Rezervasyon Al",page:"reservation"},{icon:"&#128140;",label:"Davetiye Olustur",page:"invitations"},{icon:"&#128248;",label:"Galeri & QR",page:"gallery"},{icon:"&#128179;",label:"Ödeme Takibi",page:"payments"},{icon:"&#128101;",label:"Müşteri CRM",page:"crm"},{icon:"\u2726",label:"AI Asistan",page:"ai"}].map((a,i)=>(
              <button key={i} onClick={()=>setPage(a.page)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/3 transition-all border border-white/3 hover:border-white/3">
                <span className="text-base" dangerouslySetInnerHTML={{__html:a.icon}}/>
                <span className="text-xs text-white/65">{a.label}</span>
                <span className="ml-auto text-white/30 text-xs">&#8594;</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white/70">Aylık Gelir Dagilimi</h2>
          <span className="text-xs text-white/40">{(revenue/1000).toFixed(0)}k TL tahsilat</span>
        </div>
        <div className="flex items-end gap-2 h-28">
          {["Oca","Sub","Mar","Nis","May","Haz","Tem","Agu","Eyl","Eki","Kas","Ara"].map((m,i)=>{
            const val=monthlyVals[i];
            const h=maxVal>0?Math.max((val/maxVal)*100,0):0;
            const active=i===5;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end" style={{height:"90%"}}>
                  {val>0?(
                    <div className="w-full rounded-t-lg" style={{height:`${h}%`,minHeight:4,background:active?"linear-gradient(180deg,#8b5cf6,#4f46e5)":"rgba(255,255,255,0.08)"}}/>
                  ):(
                    <div className="w-full h-1 rounded bg-white/3"/>
                  )}
                </div>
                <span className="text-[9px] text-white/35">{m}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ── EVENTS ─────────────────────────────────────── */
function EventsPage({events,setEvents,updateEvent,setPage}) {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("Tümü");
  const [statusF,setStatusF]=useState("Tümü");
  const [drawer,setDrawer]=useState(null);
  const [editModal,setEditModal]=useState(null);
  const [editForm,setEditForm]=useState({});

  const filtered=events.filter(e=>{
    const ms=e.client.toLowerCase().includes(search.toLowerCase())||e.type.toLowerCase().includes(search.toLowerCase())||e.location.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="Tümü"||e.type===filter;
    const ms2=statusF==="Tümü"||(statusF==="Onaylandı"&&e.status==="confirmed")||(statusF==="Bekliyor"&&e.status==="pending");
    return ms&&mf&&ms2;
  });

  const openEdit=(ev,ev2)=>{
    const target=ev2||ev;
    setEditForm({...target});setEditModal(target);
  };
  const saveEdit=()=>{
    setEvents(prev=>prev.map(e=>e.id===editForm.id?{...editForm,budget:parseInt(editForm.budget)||0,paid:parseInt(editForm.paid)||0,guests:parseInt(editForm.guests)||0}:e));
    setEditModal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Müşteri, tur veya lokasyon ara..."
          className="flex-1 min-w-[200px] max-w-xs px-4 py-2 rounded-xl text-sm text-white/80 placeholder-white/25 outline-none border border-white/3 bg-white/3 focus:border-purple-500/40 transition-colors"/>
        <div className="flex gap-1.5 flex-wrap">
          {["Tümü","Nişan","Kına","Doğum Günü","Kurumsal"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`px-2.5 py-1.5 rounded-xl text-xs transition-all ${filter===f?"bg-purple-500/20 text-purple-300 border border-purple-500/30":"text-white/40 border border-white/3 hover:text-white/70"}`}>{f}</button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["Tümü","Onaylandı","Bekliyor"].map(s=>(
            <button key={s} onClick={()=>setStatusF(s)} className={`px-2.5 py-1.5 rounded-xl text-xs transition-all ${statusF===s?"bg-white/10 text-white/80 border border-white/20":"text-white/45 border border-white/3 hover:text-white/60"}`}>{s}</button>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/35">{filtered.length} etkinlik</span>
      </div>
      {/* Desktop table */}
      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/3">
                {["Etkinlik","Tarih","Lokasyon","Misafir","Bütçe","Ödeme","Durum","Görevler",""].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[10px] text-white/40 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(ev=>(
                <tr key={ev.id} onClick={()=>setDrawer(ev)} className="hover:bg-white/[0.015] transition-colors cursor-pointer group">
                  <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className="text-xl">{getIcon(ev.type)}</span><div><div className="text-sm font-medium text-white/85 whitespace-nowrap">{ev.client}</div><div className="text-[10px] text-white/45">{ev.type}</div></div></div></td>
                  <td className="px-4 py-3 text-xs text-white/50 whitespace-nowrap">{ev.date}<br/><span className="text-white/40">{ev.time}</span></td>
                  <td className="px-4 py-3 text-xs text-white/50 max-w-[140px]"><div className="truncate">{ev.location}</div></td>
                  <td className="px-4 py-3 text-xs text-white/60 text-center">{ev.guests}</td>
                  <td className="px-4 py-3 text-xs font-medium text-white/70 whitespace-nowrap">{ev.budget.toLocaleString()} TL</td>
                  <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PAY_COL[ev.payment]?.bg||""} ${PAY_COL[ev.payment]?.tx||""}`}>{ev.payment}</span></td>
                  <td className="px-4 py-3">
                    {ev.status==="confirmed"?(
                      <Badge color="green">Onaylandı</Badge>
                    ):(
                      <button onClick={e=>{e.stopPropagation();updateEvent(ev.id,{status:"confirmed"});}}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors font-medium">
                        Onayla
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-14 h-1.5 rounded-full bg-white/10"><div className="h-1.5 rounded-full" style={{width:`${(ev.done/ev.tasks)*100}%`,background:ev.done===ev.tasks?"#34d399":"#8b5cf6"}}/></div><span className="text-[10px] text-white/40">{ev.done}/{ev.tasks}</span></div></td>
                  <td className="px-4 py-3"><button onClick={e=>{e.stopPropagation();openEdit(ev);}} className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-1 rounded-lg text-white/50 hover:text-white border border-white/3 hover:border-white/20 transition-all whitespace-nowrap">Düzenle</button></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={9} className="px-4 py-10 text-center text-xs text-white/35">Etkinlik bulunamadı</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {filtered.map(ev=>(
          <Card key={ev.id} onClick={()=>setDrawer(ev)} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{getIcon(ev.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white/90 truncate">{ev.client}</div>
                <div className="text-[10px] text-white/40">{ev.type}</div>
              </div>
              {ev.status==="confirmed"?(
                <Badge color="green">Onaylandı</Badge>
              ):(
                <button onClick={e=>{e.stopPropagation();updateEvent(ev.id,{status:"confirmed"});}}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors font-medium">
                  Onayla
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="text-white/40">📅 {ev.date}</div>
              <div className="text-white/40">📍 <span className="truncate inline-block max-w-[100px] align-bottom">{ev.location}</span></div>
              <div className="text-white/40">👥 {ev.guests} kişi</div>
              <div className="text-white/60 font-medium">💰 {ev.budget.toLocaleString()} TL</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 rounded-full" style={{width:`${(ev.done/ev.tasks)*100}%`,background:ev.done===ev.tasks?"#34d399":"#8b5cf6"}}/>
              </div>
              <span className="text-[10px] text-white/40">{ev.done}/{ev.tasks}</span>
            </div>
          </Card>
        ))}
        {filtered.length===0&&<div className="text-center py-10 text-xs text-white/35">Etkinlik bulunamadı</div>}
      </div>

      <Drawer open={!!drawer} onClose={()=>setDrawer(null)} title="Etkinlik Detayı">
        {drawer&&(
          <>
            <div className="text-center pb-5 border-b border-white/3 mb-5">
              <div className="text-5xl mb-3">{getIcon(drawer.type)}</div>
              <div className="text-lg font-semibold text-white">{drawer.client}</div>
              <div className="text-xs text-white/40 mt-1">{drawer.type}</div>
            </div>
            <div className="space-y-0 mb-5">
              {[["Tarih",drawer.date],["Saat",drawer.time],["Lokasyon",drawer.location],["Misafir",`${drawer.guests} kisi`],["Bütçe",`${(drawer.budget||0).toLocaleString()} TL`],["Ödenen",`${(drawer.paid||0).toLocaleString()} TL`],["Kalan",`${((drawer.budget||0)-(drawer.paid||0)).toLocaleString()} TL`],["Telefon",drawer.phone]].map(([k,v])=>(
                <div key={k} className="flex justify-between py-2.5 border-b border-white/3">
                  <span className="text-xs text-white/45">{k}</span>
                  <span className="text-xs text-white/75">{v}</span>
                </div>
              ))}
            </div>
            {drawer.notes&&<div className="p-3 rounded-xl bg-white/[0.04] mb-4"><div className="text-[10px] text-white/45 mb-1">Not</div><div className="text-xs text-white/70">{drawer.notes}</div></div>}
            <div className="p-3 rounded-xl bg-white/[0.04] mb-5">
              <div className="flex justify-between mb-2"><span className="text-xs text-white/40">Gorev Ilerlemesi</span><span className="text-xs text-white/60">{drawer.done}/{drawer.tasks}</span></div>
              <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full" style={{width:`${(drawer.done/drawer.tasks)*100}%`,background:drawer.done===drawer.tasks?"#34d399":"linear-gradient(90deg,#8b5cf6,#6366f1)"}}/></div>
            </div>
            {/* Onay / Red */}
            {drawer.status!=="confirmed"&&(
              <button onClick={async()=>{
                await updateEvent(drawer.id,{status:"confirmed"});
                setDrawer(null);
              }} className="w-full py-2.5 rounded-xl text-xs font-semibold text-white mb-2" style={{background:"linear-gradient(135deg,#34d399,#059669)"}}>
                ✅ Etkinliği Onayla
              </button>
            )}
            {drawer.status==="confirmed"&&(
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <span className="text-emerald-400 text-sm">✅</span>
                <span className="text-xs text-emerald-400 font-medium">Bu etkinlik onaylandı</span>
                <button onClick={async()=>{
                  await updateEvent(drawer.id,{status:"pending"});
                  setDrawer(null);
                }} className="ml-auto text-[10px] text-white/30 hover:text-rose-400 transition-colors">İptal Et</button>
              </div>
            )}
            <div className="space-y-2">
              <button onClick={()=>openEdit(drawer)} className="w-full py-2.5 rounded-xl text-xs font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Düzenle</button>
              <GlassBtn className="w-full justify-center flex" onClick={()=>{
                setDrawer(null);
                setPage("invitations");
              }}>Davetiye Oluştur</GlassBtn>
              <GlassBtn className="w-full justify-center flex" onClick={()=>{
                setDrawer(null);
                setPage("gallery");
              }}>QR Galeri Üret</GlassBtn>
              <GlassBtn className="w-full justify-center flex" onClick={()=>{
                const phone=(drawer.phone||"").replace(/\D/g,"");
                if(!phone){alert("Telefon numarası yok.");return;}
                const waPhone=phone.startsWith("0")?"90"+phone.slice(1):phone;
                window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent("Merhaba "+drawer.client.split("&")[0].trim()+", "+drawer.type+" etkinliğiniz onaylanmıştır. Detaylar için görüşelim.")}`,"_blank");
              }}>WhatsApp Bildir</GlassBtn>
            </div>
          </>
        )}
      </Drawer>

      <Modal open={!!editModal} onClose={()=>setEditModal(null)} title="Etkinligi Duzenle" width="max-w-2xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FieldInput label="Müşteri Adi" value={editForm.client||""} onChange={e=>setEditForm(p=>({...p,client:e.target.value}))} placeholder="Ad soyad"/>
          <FieldSelect label="Etkinlik Turu" value={editForm.type||""} onChange={e=>setEditForm(p=>({...p,type:e.target.value}))} options={EVENT_TYPES}/>
          <FieldInput label="Tarih" type="date" value={editForm.date||""} onChange={e=>setEditForm(p=>({...p,date:e.target.value}))}/>
          <FieldInput label="Saat" type="time" value={editForm.time||""} onChange={e=>setEditForm(p=>({...p,time:e.target.value}))}/>
          <FieldInput label="Lokasyon" value={editForm.location||""} onChange={e=>setEditForm(p=>({...p,location:e.target.value}))} placeholder="Salon / adres"/>
          <FieldInput label="Misafir Sayisi" type="number" value={editForm.guests||""} onChange={e=>setEditForm(p=>({...p,guests:Math.max(0,parseInt(e.target.value)||0)}))}/>
          <FieldInput label="Toplam Butce (TL)" type="number" value={editForm.budget||""} onChange={e=>setEditForm(p=>({...p,budget:Math.max(0,parseInt(e.target.value)||0)}))}/>
          <FieldInput label="Odenen (TL)" type="number" value={editForm.paid||""} onChange={e=>setEditForm(p=>({...p,paid:Math.max(0,parseInt(e.target.value)||0)}))}/>
          <FieldSelect label="Durum" value={editForm.status||""} onChange={e=>setEditForm(p=>({...p,status:e.target.value}))} options={[{value:"confirmed",label:"Onaylandı"},{value:"pending",label:"Bekliyor"}]}/>
          <FieldSelect label="Ödeme" value={editForm.payment||""} onChange={e=>setEditForm(p=>({...p,payment:e.target.value}))} options={["tam","kapora","bekliyor"]}/>
        </div>
        <FieldInput label="Notlar" value={editForm.notes||""} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} placeholder="Ozel istekler..." rows={2}/>
        <div className="flex justify-end gap-2 mt-5">
          <GlassBtn onClick={()=>setEditModal(null)}>İptal</GlassBtn>
          <button onClick={saveEdit} className="px-5 py-2 rounded-xl text-xs font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Kaydet</button>
        </div>
      </Modal>
    </div>
  );
}


/* ── CALENDAR ───────────────────────────────────── */
function CalendarPage({events,setPage,setPrefillDate}) {
  const [month,setMonth]=useState(new Date().getMonth());
  const [year,setYear]=useState(new Date().getFullYear());
  const [selected,setSelected]=useState(null);
  const [quickBook,setQuickBook]=useState(null); // {day, month, year} - hızlı rezervasyon modalı
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const offset=firstDay===0?6:firstDay-1;
  const cells=Array.from({length:offset+daysInMonth},(_,i)=>i<offset?null:i-offset+1);
  const prev=()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);};
  const next=()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);};
  const dayEvs=(day)=>events.filter(e=>{const d=new Date(e.date);return d.getFullYear()===year&&d.getMonth()===month&&d.getDate()===day;});
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white border border-white/3 hover:border-white/20 transition-colors">Onceki</button>
            <h2 className="text-base font-semibold text-white min-w-[150px] text-center">{MONTH_NAMES[month]} {year}</h2>
            <button onClick={next} className="px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white border border-white/3 hover:border-white/20 transition-colors">Sonraki</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
          {DAY_NAMES.map(d=>(
            <div key={d} className="py-3 text-center text-[11px] text-white/40 font-medium" style={{background:"rgba(17,24,39,0.7)"}}>{d}</div>
          ))}
          {cells.map((day,i)=>{
            if(!day)return<div key={`e${i}`} style={{background:"rgba(17,24,39,0.7)",opacity:0.5}}/>;
            const now=new Date();
            const isToday=day===now.getDate()&&month===now.getMonth()&&year===now.getFullYear();
            const evs=dayEvs(day);
            const holidays=getHoliday(year,month,day);
            const hasHoliday=holidays.length>0;
            const bgColor=hasHoliday?"rgba(251,191,36,0.06)":isToday?"rgba(139,92,246,0.05)":"#080810";
            return (
              <div key={day} onClick={()=>setSelected({day,evs,holidays})}
                className="min-h-24 p-2 flex flex-col gap-1 cursor-pointer hover:bg-white/[0.015] transition-colors"
                style={{background:bgColor}}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 ${isToday?"bg-purple-500 text-white font-bold":"text-white/55"}`}>{day}</span>
                  {hasHoliday&&<span className="text-[10px]" title={holidays[0].name}>{holidays[0].icon}</span>}
                </div>
                {holidays.map((h,idx)=>(
                  <div key={idx} className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-medium" style={{background:"rgba(251,191,36,0.15)",color:"#fbbf24"}}>
                    {h.icon} {h.name.length>15?h.name.slice(0,15)+"…":h.name}
                  </div>
                ))}
                {evs.map(e=>(
                  <div key={e.id} className="text-[10px] px-1.5 py-0.5 rounded-md truncate" style={{background:"rgba(139,92,246,0.2)",color:"#c4b5fd"}}>
                    {getIcon(e.type)} {e.client.split("&")[0].trim().split(" ")[0]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {events.map(e=>(
            <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/3 bg-white/[0.015] text-xs text-white/50">
              <span>{getIcon(e.type)}</span>
              <span className="whitespace-nowrap">{e.date.split("-")[2]} {MONTH_NAMES[parseInt(e.date.split("-")[1])-1]?.slice(0,3)} - {e.client.split("&")[0].trim()}</span>
              <Badge color={e.status==="confirmed"?"green":"amber"}>{e.status==="confirmed"?"Onaylandı":"Bekliyor"}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?`${selected.day} ${MONTH_NAMES[month]} ${year}`:""}>
        {selected&&selected.holidays&&selected.holidays.length>0&&(
          <div className="mb-4 space-y-2">
            {selected.holidays.map((h,idx)=>(
              <div key={idx} className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-amber-300">{h.name}</div>
                  <div className="text-[10px] text-amber-400/50">{h.type==="resmi"?"Resmi Tatil":h.type==="bayram"?"Bayram":"Özel Gün"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selected&&selected.evs.length>0&&(
          <div className="space-y-3 mb-4">
            <div className="text-xs text-white/40 font-medium uppercase tracking-wider">Mevcut Etkinlikler</div>
            {selected.evs.map(ev=>(
              <div key={ev.id} className="p-4 rounded-xl border border-white/3 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getIcon(ev.type)}</span>
                  <div><div className="text-sm font-semibold text-white/85">{ev.client}</div><div className="text-xs text-white/40">{ev.time} - {ev.location}</div></div>
                  <Badge className="ml-auto" color={ev.status==="confirmed"?"green":"amber"}>{ev.status==="confirmed"?"Onaylandı":"Bekliyor"}</Badge>
                </div>
                <div className="text-xs text-white/50">{ev.guests} misafir - {ev.budget.toLocaleString()} TL bütçe</div>
              </div>
            ))}
          </div>
        )}
        {/* Yeni Etkinlik Oluştur */}
        <div className="mt-2">
          <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">Yeni Etkinlik Oluştur</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EVENT_TYPES.map(type=>(
              <button key={type} onClick={()=>{
                const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(selected.day).padStart(2,"0")}`;
                setPrefillDate({date:dateStr,type});
                setSelected(null);
                setPage("reservation");
              }}
                className="p-3 rounded-xl border border-white/5 hover:border-purple-500/30 bg-white/[0.02] hover:bg-purple-500/5 transition-all flex flex-col items-center gap-2 cursor-pointer">
                <span className="text-2xl">{getIcon(type)}</span>
                <span className="text-xs text-white/60 font-medium">{type}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── TASKS ──────────────────────────────────────── */
function TasksPage({tasks,setTasks,events}) {
  const [addOpen,setAddOpen]=useState(false);
  const [newTask,setNewTask]=useState({task:"",eventId:"",assignee:"",priority:"orta"});
  const [filterEv,setFilterEv]=useState("Tümü");
  const cols=["bekliyor","devam","tamamlandı"];
  const move=(id,status)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,status}:t));
  const del=(id)=>setTasks(prev=>prev.filter(t=>t.id!==id));
  const addTask=()=>{
    if(!newTask.task.trim())return;
    setTasks(prev=>[...prev,{id:Date.now(),eventId:parseInt(newTask.eventId)||0,task:newTask.task.trim(),status:"bekliyor",assignee:newTask.assignee||"—",priority:newTask.priority}]);
    setNewTask({task:"",eventId:"",assignee:"",priority:"orta"});setAddOpen(false);
  };
  const filt=filterEv==="Tümü"?tasks:tasks.filter(t=>t.eventId===parseInt(filterEv));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {cols.map(c=>(
            <span key={c} className={`text-[10px] px-2 py-1 rounded-full ${TASK_COL[c].bg} ${TASK_COL[c].tx}`}>
              {TASK_COL[c].label}: {tasks.filter(t=>t.status===c).length}
            </span>
          ))}
        </div>
        <select value={filterEv} onChange={e=>setFilterEv(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs text-white/60 bg-white/3 border border-white/3 outline-none bg-[#0f0f1c]">
          <option value="Tümü">Tüm etkinlikler</option>
          {events.map(e=><option key={e.id} value={e.id}>{e.client}</option>)}
        </select>
        <button onClick={()=>setAddOpen(true)} className="ml-auto px-3 py-1.5 rounded-xl text-xs text-purple-300 border border-purple-500/25 hover:bg-purple-500/10 transition-colors">+ Gorev Ekle</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map(col=>(
          <div key={col} className="rounded-2xl border border-white/3 overflow-hidden" style={{background:"rgba(255,255,255,0.04)"}}>
            <div className="px-4 py-3 border-b border-white/3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col==="bekliyor"?"bg-amber-400":col==="devam"?"bg-blue-400":"bg-emerald-400"}`}/>
              <span className="text-sm font-medium text-white/70">{TASK_COL[col].label}</span>
              <span className="ml-auto text-[10px] text-white/40">{filt.filter(t=>t.status===col).length}</span>
            </div>
            <div className="p-3 space-y-2 min-h-32">
              {filt.filter(t=>t.status===col).map(task=>{
                const ev=events.find(e=>e.id===task.eventId);
                return (
                  <div key={task.id} className="p-3 rounded-xl border border-white/3 hover:border-white/3 transition-all group" style={{background:"rgba(255,255,255,0.06)"}}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-medium text-white/85 flex-1">{task.task}</span>
                      <button onClick={()=>del(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-rose-400 text-xs leading-none flex-shrink-0">x</button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge color={task.priority==="yuksek"?"red":task.priority==="orta"?"amber":"green"}>{task.priority}</Badge>
                      {ev&&<span className="text-[10px] text-white/40 truncate">{ev.client}</span>}
                    </div>
                    <div className="text-[10px] text-white/40 mb-3">&#128100; {task.assignee}</div>
                    <div className="flex gap-1">
                      {cols.filter(c=>c!==col).map(c=>(
                        <button key={c} onClick={()=>move(task.id,c)}
                          className={`flex-1 py-1 rounded-lg text-[9px] font-medium ${TASK_COL[c].bg} ${TASK_COL[c].tx} hover:opacity-80 transition-all`}>
                          {TASK_COL[c].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filt.filter(t=>t.status===col).length===0&&<div className="text-center py-8 text-xs text-white/25">Gorev yok</div>}
            </div>
          </div>
        ))}
      </div>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Yeni Gorev Ekle">
        <div className="space-y-4">
          <FieldInput label="Gorev Adi" value={newTask.task} onChange={e=>setNewTask(p=>({...p,task:e.target.value}))} placeholder="Gorev aciklamasi"/>
          <FieldSelect label="Etkinlik" value={newTask.eventId} onChange={e=>setNewTask(p=>({...p,eventId:e.target.value}))}
            options={[{value:"",label:"— Genel —"},...events.map(e=>({value:e.id,label:e.client}))]}/>
          <FieldInput label="Sorumlu" value={newTask.assignee} onChange={e=>setNewTask(p=>({...p,assignee:e.target.value}))} placeholder="Personel adi"/>
          <FieldSelect label="Oncelik" value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))} options={["dusuk","orta","yuksek"]}/>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <GlassBtn onClick={()=>setAddOpen(false)}>İptal</GlassBtn>
          <button onClick={addTask} className="px-5 py-2 rounded-xl text-xs font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Ekle</button>
        </div>
      </Modal>
    </div>
  );
}

/* ── INVITATIONS ────────────────────────────────── */
function InvitationsPage({events,guests,updateEvent}) {
  const [activeEv,setActiveEv]=useState(events[0]);
  const [preview,setPreview]=useState(false);
  const [qrOpen,setQrOpen]=useState(false);
  const [contractOpen,setContractOpen]=useState(false);
  const [contractCompany,setContractCompany]=useState({name:"",phone:"",social:""});
  const [themeIdx,setThemeIdx]=useState(0);
  const themes=[
    {name:"Klasik Gold",from:"#b8943f",to:"#d4af37",dark:"#1a1200"},
    {name:"Gül Pembe",from:"#c2185b",to:"#ff6b9d",dark:"#1a0010"},
    {name:"Lacivert",from:"#1a237e",to:"#3f51b5",dark:"#000820"},
    {name:"Dogal Yesil",from:"#2e7d32",to:"#66bb6a",dark:"#001a02"},
    {name:"Mor Dus",from:"#6a1b9a",to:"#ab47bc",dark:"#0d0018"},
  ];
  const th=themes[themeIdx];
  const evGuests=activeEv ? guests.filter(g=>g.event_id===activeEv.id) : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="overflow-hidden">
        <SectionHeader title="Etkinlikler"/>
        <div className="divide-y divide-white/5">
          {events.map(ev=>(
            <div key={ev.id} onClick={()=>setActiveEv(ev)}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${activeEv?.id===ev.id?"bg-purple-500/10 border-l-2 border-purple-500":"hover:bg-white/[0.02]"}`}>
              <span className="text-xl flex-shrink-0">{getIcon(ev.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white/80 truncate">{ev.client}</div>
                <div className="text-[10px] text-white/45">{ev.date}</div>
              </div>
              {activeEv?.id===ev.id&&<span className="text-purple-400">&#9679;</span>}
            </div>
          ))}
        </div>
      </Card>
      <Card className="md:col-span-2 p-5 space-y-5 overflow-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white/85">{activeEv?.client}</h3>
            <p className="text-xs text-white/45 mt-0.5">{activeEv?.type} - {activeEv?.date} - {activeEv?.location}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <GlassBtn onClick={()=>setPreview(true)}>Önizle</GlassBtn>
            <button className="px-3 py-2 rounded-xl text-xs font-medium text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Olustur & Paylas</button>
          </div>
        </div>
        <div className="space-y-4">
          {/* Tema Seçimi */}
          <div>
            <p className="text-xs text-white/40 mb-3">Davetiye Teması</p>
            <div className="flex gap-3 flex-wrap">
              {[{id:'gold',name:'Klasik Gold',color:'#d4a853'},{id:'rose',name:'Gül Pembe',color:'#e879a0'},{id:'nature',name:'Doğal Yeşil',color:'#6ee7b7'},{id:'night',name:'Mor Gece',color:'#a78bfa'},{id:'ocean',name:'Okyanus',color:'#38bdf8'}].map((t,i)=>(
                <div key={t.id} onClick={()=>{setThemeIdx(i);if(activeEv)updateEvent(activeEv.id,{theme:t.id});}} className="flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl transition-all ${themeIdx===i?"ring-2 ring-white/50 ring-offset-2 ring-offset-[#111827] scale-110":"opacity-60 hover:opacity-90"}`}
                    style={{background:t.color}}/>
                  <span className="text-[9px] text-white/40 text-center w-14 leading-tight">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* IBAN Bilgisi */}
          <div>
            <p className="text-xs text-white/40 mb-2">🎁 Hediye IBAN (Gelemeyen misafirler için)</p>
            <input defaultValue={activeEv?.iban||""} onBlur={e=>{if(activeEv)updateEvent(activeEv.id,{iban:e.target.value});}}
              placeholder="TR00 0000 0000 0000 0000 0000 00" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 mb-2"/>
            <input defaultValue={activeEv?.iban_name||""} onBlur={e=>{if(activeEv)updateEvent(activeEv.id,{iban_name:e.target.value});}}
              placeholder="Hesap Sahibi Adı Soyadı" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"/>
          </div>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-3">RSVP Özeti</p>
          <div className="grid grid-cols-3 gap-2">
            {[{label:"Katılıyor",count:evGuests.filter(g=>g.response==="katılıyor").length,color:"#34d399"},{label:"Belki",count:evGuests.filter(g=>g.response==="belki").length,color:"#fbbf24"},{label:"Katılamıyor",count:evGuests.filter(g=>g.response==="katılamıyor").length,color:"#f87171"}].map(s=>(
              <div key={s.label} className="p-3 rounded-xl border border-white/3 text-center" style={{background:"rgba(255,255,255,0.06)"}}>
                <div className="text-2xl font-bold" style={{color:s.color}}>{s.count}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {evGuests.length>0&&(
          <div>
            <p className="text-xs text-white/40 mb-3">Misafir Listesi ({evGuests.length})</p>
            {/* Desktop table */}
            <div className="rounded-xl overflow-hidden border border-white/3 hidden md:block">
              <table className="w-full">
                <thead><tr className="border-b border-white/3 bg-white/[0.015]">
                  {["Ad Soyad","Telefon","+Kişi","Çocuk","Yemek","Cevap"].map(h=><th key={h} className="px-3 py-2 text-left text-[10px] text-white/40 uppercase tracking-wider">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {evGuests.map(g=>(
                    <tr key={g.id} className="hover:bg-white/[0.015] transition-colors">
                      <td className="px-3 py-2 text-xs text-white/75">{g.name}</td>
                      <td className="px-3 py-2 text-xs text-white/55">{g.phone}</td>
                      <td className="px-3 py-2 text-xs text-white/50 text-center">{g.plus}</td>
                      <td className="px-3 py-2 text-xs text-white/50 text-center">{g.children}</td>
                      <td className="px-3 py-2 text-xs text-white/50">{g.food}</td>
                      <td className="px-3 py-2"><Badge color={g.response==="katılıyor"?"green":g.response==="belki"?"amber":"red"}>{g.response}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {evGuests.map(g=>(
                <div key={g.id} className="p-3 rounded-xl border border-white/3 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-white/80">{g.name}</div>
                    <Badge color={g.response==="katılıyor"?"green":g.response==="belki"?"amber":"red"}>{g.response}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-white/40">
                    <div>📞 {g.phone}</div>
                    <div>🍽️ {g.food}</div>
                    {g.plus>0&&<div>👥 +{g.plus} kişi</div>}
                    {g.children>0&&<div>👶 {g.children} çocuk</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="p-3 rounded-xl border border-white/3 bg-white/[0.015] flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/45 mb-0.5">Davetiye Linki</div>
            <div className="text-xs font-mono text-purple-400">merasim.app/i/{activeEv?.id}</div>
          </div>
          <GlassBtn onClick={()=>navigator.clipboard?.writeText(`https://merasim.app/i/${activeEv?.id}`)}>Kopyala</GlassBtn>
          <GlassBtn onClick={()=>setQrOpen(true)}>QR Oluştur</GlassBtn>
          <GlassBtn onClick={()=>setContractOpen(true)}>Sözleşme</GlassBtn>
        </div>
      </Card>
      <Modal open={preview} onClose={()=>setPreview(false)} title="Davetiye Önizlemesi">
        <div className="flex justify-center">
          <div className="w-72 rounded-3xl overflow-hidden" style={{background:`linear-gradient(160deg,${th.dark} 0%,#0d0d18 100%)`,border:"1px solid rgba(139,92,246,0.2)"}}>
            <div className="relative overflow-hidden h-44 flex items-center justify-center" style={{background:`linear-gradient(135deg,${th.from},${th.to})`}}>
              <div className="text-center z-10">
                <div className="text-6xl mb-2">{getIcon(activeEv?.type)}</div>
                <div className="text-white/80 text-[11px] tracking-[0.3em] uppercase font-medium">Davetlisiniz</div>
              </div>
            </div>
            <div className="p-5 text-center space-y-4">
              <div>
                <div className="text-lg font-bold text-white mb-1">{activeEv?.client}</div>
                <div className="text-[11px] tracking-widest uppercase" style={{color:th.from}}>{activeEv?.type}</div>
              </div>
              <div className="border-t border-b border-white/3 py-3 space-y-1.5">
                <div className="text-white/60 text-sm">&#128197; {activeEv?.date}</div>
                <div className="text-white/60 text-sm">&#128336; {activeEv?.time}</div>
                <div className="text-white/60 text-sm">&#128205; {activeEv?.location}</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white" style={{background:`linear-gradient(135deg,${th.from},${th.to})`}}>Katılıyorum</button>
                <button className="flex-1 py-2.5 rounded-xl text-xs text-white/60 border border-white/15">Katılamıyorum</button>
              </div>
              <p className="text-[9px] text-white/30">Merasim - merasim.app/i/{activeEv?.id}</p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={qrOpen} onClose={()=>setQrOpen(false)} title="QR Kod">
        <div className="flex flex-col items-center gap-4 py-4 qr-modal">
          <div className="p-4 bg-white rounded-2xl">
            <QRCodeSVG value={`https://merasim.app/i/${activeEv?.id}`} size={200} level="H"/>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-white/85">{activeEv?.client}</div>
            <div className="text-xs text-white/40">{activeEv?.type} - {activeEv?.date}</div>
          </div>
          <div className="p-3 rounded-xl border border-white/3 bg-white/[0.02] w-full">
            <div className="text-[10px] text-white/45 mb-1">Davetiye Linki</div>
            <div className="text-xs font-mono text-purple-400">https://merasim.app/i/{activeEv?.id}</div>
          </div>
          <div className="p-3 rounded-xl border border-white/3 bg-white/[0.02] w-full">
            <div className="text-[10px] text-white/45 mb-1">Konum</div>
            <div className="text-xs text-white/60">📍 Yunusemre, Arpacılar Sk Arpacılar Sitesi No:4/BA, 16270 Yıldırım/Bursa</div>
          </div>
          <div className="flex gap-2 w-full">
            <GlassBtn className="flex-1 justify-center" onClick={()=>{
              const svg=document.querySelector('.qr-modal svg');
              if(svg){const svgData=new XMLSerializer().serializeToString(svg);const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0);const a=document.createElement('a');a.download=`qr-${activeEv?.id}.png`;a.href=canvas.toDataURL();a.click();};img.src='data:image/svg+xml;base64,'+btoa(svgData);}
            }}>İndir</GlassBtn>
            <GlassBtn className="flex-1 justify-center" onClick={()=>navigator.clipboard?.writeText(`https://merasim.app/i/${activeEv?.id}`)}>Linki Kopyala</GlassBtn>
          </div>
        </div>
      </Modal>
      <Modal open={contractOpen} onClose={()=>setContractOpen(false)} title="Etkinlik Sözleşmesi" width="max-w-2xl">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/6 text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
{`ETKİNLİK ORGANİZASYON SÖZLEŞMESİ

TARİH: ${new Date().toLocaleDateString('tr-TR')}

MÜŞTERİ: ${activeEv?.client || '—'}
ETKİNLİK: ${activeEv?.type || '—'}
TARİH: ${activeEv?.date || '—'}
SAAT: ${activeEv?.time || '—'}
LOKASYON: ${activeEv?.location || '—'}
MİSAFİR SAYISI: ${activeEv?.guests || '—'}
TOPLAM ÜCRET: ${(activeEv?.budget || 0).toLocaleString()} TL

MADDE 1 - HİZMET KAPSAMI
${contractCompany.name||'Firma Adı'}, yukarıda belirtilen etkinlik için organizasyon hizmeti sunmayı taahhüt eder.

MADDE 2 - ÖDEME
Toplam ücret ${(activeEv?.budget || 0).toLocaleString()} TL olup, %50 kapora ödemesi rezervasyon sırasında alınır. Kalan tutar etkinlik tarihinden 3 gün önce ödenir.

MADDE 3 - İPTAL
Etkinlik tarihinden 15 gün öncesine kadar yapılan iptallerde kapora iade edilmez. 15 günden kısa sürede yapılan iptallerde toplam ücretin %25'i tahsil edilir.

MADDE 4 - VERİ SAKLAMA
Müşteri bilgileri ve etkinlik fotoğrafları 6698 sayılı KVKK kapsamında 30 gün süreyle saklanır, ardından otomatik olarak silinir.

MADDE 5 - SORUMLULUK
${contractCompany.name||'Firma Adı'}, etkinlik planlama ve koordinasyonundan sorumludur. Üçüncü taraf hizmet sağlayıcıların hatalarından sorumlu değildir.

──────────────────────────
${contractCompany.name||'Firma Adı'}${contractCompany.phone?' | '+contractCompany.phone:''}${contractCompany.social?' | '+contractCompany.social:''}

merasim.app`}
          </div>
          {/* Firma Bilgileri */}
          <div className="p-4 rounded-xl border border-white/6 bg-white/[0.02] space-y-3">
            <div className="text-xs text-white/40 font-medium">Sözleşme Alt Bilgisi (Düzenlenebilir)</div>
            <input value={contractCompany.name} onChange={e=>setContractCompany(p=>({...p,name:e.target.value}))} placeholder="Firma Adı" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"/>
            <input value={contractCompany.phone} onChange={e=>setContractCompany(p=>({...p,phone:e.target.value}))} placeholder="İletişim Telefonu" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"/>
            <input value={contractCompany.social} onChange={e=>setContractCompany(p=>({...p,social:e.target.value}))} placeholder="Sosyal Medya / Web Sitesi" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"/>
          </div>
          <div className="flex gap-2">
            <GlassBtn className="flex-1 justify-center" onClick={()=>navigator.clipboard?.writeText(`ETKİNLİK ORGANİZASYON SÖZLEŞMESİ\n\nMÜŞTERİ: ${activeEv?.client}\nETKİNLİK: ${activeEv?.type}\nTARİH: ${activeEv?.date}\nTOPLAM: ${(activeEv?.budget||0).toLocaleString()} TL\n\nMADDE 1 - HİZMET KAPSAMI\n${contractCompany.name||'Firma'}, yukarıda belirtilen etkinlik için organizasyon hizmeti sunmayı taahhüt eder.\n\nMADDE 2 - ÖDEME\nToplam ücret ${(activeEv?.budget||0).toLocaleString()} TL olup, %50 kapora ödemesi rezervasyon sırasında alınır.\n\nMADDE 3 - İPTAL\nEtkinlik tarihinden 15 gün öncesine kadar yapılan iptallerde kapora iade edilmez.\n\nMADDE 4 - VERİ SAKLAMA\nMüşteri bilgileri 6698 sayılı KVKK kapsamında 30 gün süreyle saklanır.\n\n──────────────────────────\n${contractCompany.name||'Firma Adı'}${contractCompany.phone?' | '+contractCompany.phone:''}${contractCompany.social?' | '+contractCompany.social:''}\nmerasim.app`)}>Sözleşmeyi Kopyala</GlassBtn>
            <GlassBtn className="flex-1 justify-center" onClick={()=>window.print()}>Yazdır</GlassBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}


/* ── GALLERY ────────────────────────────────────── */
function GalleryPage({events,gallery,setGallery,company}) {
  const [activeEv,setActiveEv]=useState(events[0]);
  const [lightbox,setLightbox]=useState(null);
  const [galleryQr,setGalleryQr]=useState(false);
  const [uploading,setUploading]=useState(false);
  const photos=gallery.filter(g=>g.event_id===activeEv?.id);
  const approve=(id)=>setGallery(prev=>prev.map(g=>g.id===id?{...g,approved:true}:g));
  const remove=(id)=>{setGallery(prev=>prev.filter(g=>g.id!==id));if(lightbox?.id===id)setLightbox(null);};

  const handleUpload=async(e)=>{
    const files=Array.from(e.target.files);
    if(!files.length||!activeEv?.id||!company?.id)return;
    setUploading(true);
    for(const file of files){
      const ext=file.name.split('.').pop();
      const path=`${company.id}/${activeEv.id}/${Date.now()}.${ext}`;
      const {error}=await supabase.storage.from('gallery').upload(path,file);
      if(!error){
        const url=supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
        await supabase.from('gallery').insert({company_id:company.id,event_id:activeEv.id,url,approved:false});
        setGallery(prev=>[...prev,{id:Date.now(),event_id:activeEv.id,url,approved:false}]);
      }
    }
    setUploading(false);
    e.target.value='';
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="overflow-hidden">
        <SectionHeader title="Etkinlikler"/>
        <div className="divide-y divide-white/5">
          {events.map(ev=>{
            const cnt=gallery.filter(g=>g.event_id===ev.id);
            const pend=cnt.filter(g=>!g.approved).length;
            return (
              <div key={ev.id} onClick={()=>setActiveEv(ev)}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${activeEv?.id===ev.id?"bg-purple-500/10 border-l-2 border-purple-500":"hover:bg-white/[0.02]"}`}>
                <span className="text-xl flex-shrink-0">{getIcon(ev.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/75 truncate">{ev.client}</div>
                  <div className="text-[10px] text-white/40">{cnt.length} medya{pend>0&&<span className="text-amber-400"> - {pend} onay</span>}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="md:col-span-3 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/85">{activeEv?.client}</h3>
            <p className="text-xs text-white/45 mt-0.5">{photos.length} medya - QR: <span className="text-purple-400 font-mono text-[10px]">merasim.app/g/{activeEv?.id}</span></p>
          </div>
          <div className="flex gap-2">
            <GlassBtn onClick={()=>setGalleryQr(true)}>QR İndir</GlassBtn>
            <GlassBtn>ZIP</GlassBtn>
            <button onClick={()=>document.getElementById('gallery-upload-input')?.click()} disabled={uploading} className="px-3 py-2 rounded-xl text-xs text-purple-300 border border-purple-500/25 hover:bg-purple-500/10 transition-colors disabled:opacity-40">{uploading?"Yükleniyor...":"+ Yükle"}</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{label:"Toplam",val:photos.length,c:"#8b5cf6"},{label:"Onaylandı",val:photos.filter(p=>p.approved).length,c:"#34d399"},{label:"Bekliyor",val:photos.filter(p=>!p.approved).length,c:"#fbbf24"}].map(s=>(
            <div key={s.label} className="p-3 rounded-xl border border-white/3 bg-white/[0.02] text-center">
              <div className="text-xl font-bold" style={{color:s.c}}>{s.val}</div>
              <div className="text-[10px] text-white/45">{s.label}</div>
            </div>
          ))}
        </div>
        {photos.length>0?(
          <div className="grid grid-cols-3 gap-3">
            {photos.map(photo=>(
              <div key={photo.id} className="relative group rounded-xl overflow-hidden cursor-pointer" style={{aspectRatio:"16/10"}}>
                <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onClick={()=>setLightbox(photo)}/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors flex items-end p-2 gap-1">
                  {!photo.approved&&(
                    <button onClick={e=>{e.stopPropagation();approve(photo.id);}}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-1 py-1 rounded-lg bg-emerald-500/80 text-white text-[10px] font-medium">Onayla</button>
                  )}
                  <button onClick={e=>{e.stopPropagation();remove(photo.id);}}
                    className="opacity-0 group-hover:opacity-100 transition-opacity py-1 px-2 rounded-lg bg-rose-500/70 text-white text-[10px]">Sil</button>
                </div>
                {!photo.approved&&<div className="absolute top-2 right-2"><Badge color="amber">Onay Bekliyor</Badge></div>}
                {photo.approved&&<div className="absolute top-2 left-2 text-emerald-400 text-xs">&#10003;</div>}
              </div>
            ))}
            <div className="rounded-xl border-2 border-dashed border-white/3 flex flex-col items-center justify-center cursor-pointer hover:border-white/25 transition-colors" style={{aspectRatio:"16/10"}} onClick={()=>document.getElementById('gallery-upload-input')?.click()}>
              <span className="text-2xl text-white/30 mb-1">+</span>
              <span className="text-[10px] text-white/35">Yukle</span>
            </div>
            <input type="file" id="gallery-upload-input" accept="image/*" multiple className="hidden" onChange={handleUpload}/>
          </div>
        ):(
          <div className="text-center py-16 border-2 border-dashed border-white/3 rounded-2xl">
            <div className="text-5xl mb-3 opacity-20">&#128248;</div>
            <div className="text-white/40 text-sm">Bu etkinlik için henuz medya yok</div>
          </div>
        )}
      </Card>
      {lightbox&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.92)"}} onClick={()=>setLightbox(null)}>
          <div className="max-w-2xl w-full mx-4 rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
            <img src={lightbox.url} alt="" className="w-full object-cover"/>
            <div className="flex items-center gap-3 p-4" style={{background:"#0f0f1a"}}>
              <span className="text-xs text-white/50 flex-1">{lightbox.approved?"Onaylandı":"Onay Bekliyor"}</span>
              {!lightbox.approved&&<button onClick={()=>{approve(lightbox.id);setLightbox(p=>({...p,approved:true}));}} className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">Onayla</button>}
              <button onClick={()=>{const a=document.createElement('a');a.href=lightbox.url;a.download=`foto-${lightbox.id}.jpg`;a.click();}} className="text-xs px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-400">İndir</button>
              <button onClick={()=>remove(lightbox.id)} className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400">Sil</button>
              <button onClick={()=>setLightbox(null)} className="text-white/40 hover:text-white ml-2 transition-colors text-xl leading-none">x</button>
            </div>
          </div>
        </div>
      )}
      <Modal open={galleryQr} onClose={()=>setGalleryQr(false)} title="Galeri QR Kod">
        <div className="flex flex-col items-center gap-4 py-4 gallery-qr-modal">
          <div className="p-4 bg-white rounded-2xl">
            <QRCodeSVG value={`https://merasim.app/g/${activeEv?.id}`} size={200} level="H"/>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-white/85">{activeEv?.client}</div>
            <div className="text-xs text-white/40">{photos.length} medya</div>
          </div>
          <div className="p-3 rounded-xl border border-white/3 bg-white/[0.02] w-full">
            <div className="text-[10px] text-white/45 mb-1">Galeri Linki</div>
            <div className="text-xs font-mono text-purple-400">https://merasim.app/g/{activeEv?.id}</div>
          </div>
          <GlassBtn className="w-full justify-center" onClick={()=>{
            const svg=document.querySelector('.gallery-qr-modal svg');
            if(svg){const svgData=new XMLSerializer().serializeToString(svg);const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0);const a=document.createElement('a');a.download=`galeri-qr-${activeEv?.id}.png`;a.href=canvas.toDataURL();a.click();};img.src='data:image/svg+xml;base64,'+btoa(svgData);}
          }}>QR İndir</GlassBtn>
        </div>
      </Modal>
    </div>
  );
}

/* ── PAYMENTS ───────────────────────────────────── */
function PaymentsPage({events}) {
  const [expenses,setExpenses]=useState([]);
  const [expOpen,setExpOpen]=useState(false);
  const [expForm,setExpForm]=useState({eventId:"",desc:"",amount:""});
  const totalRev=events.reduce((s,e)=>s+e.budget,0);
  const totalPaid=events.reduce((s,e)=>s+e.paid,0);
  const totalExp=expenses.reduce((s,e)=>s+e.amount,0);
  const totalRem=totalRev-totalPaid;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Toplam Bütçe" value={`${(totalRev/1000).toFixed(0)}k TL`} sub="Tüm etkinlikler" icon="&#9672;" color="#8b5cf6"/>
        <StatBox label="Tahsilat"     value={`${(totalPaid/1000).toFixed(0)}k TL`} sub={`%${totalRev>0?((totalPaid/totalRev)*100).toFixed(0):0} tamamlandı`} icon="&#9689;" color="#34d399"/>
        <StatBox label="Bekleyen"     value={`${(totalRem/1000).toFixed(0)}k TL`} sub="Tahsilat bekliyor" icon="&#9680;" color="#fb923c"/>
        <StatBox label="Masraflar"    value={`${(totalExp/1000).toFixed(1)}k TL`} sub={`${expenses.length} kalem`} icon="&#9660;" color="#f87171"/>
      </div>
      {/* Masraf Takibi */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/80">Masraf Takibi</h2>
          <GlassBtn onClick={()=>setExpOpen(true)}>+ Masraf Ekle</GlassBtn>
        </div>
        {expenses.length>0?(
          <div className="space-y-2">
            {expenses.map(ex=>(
              <div key={ex.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                <div>
                  <div className="text-xs text-white/70">{ex.desc}</div>
                  <div className="text-[10px] text-white/40">{events.find(e=>e.id===ex.eventId)?.client||"Genel"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-rose-400">-{ex.amount.toLocaleString()} TL</span>
                  <button onClick={()=>setExpenses(p=>p.filter(e=>e.id!==ex.id))} className="text-[10px] text-white/30 hover:text-rose-400 transition-colors">Sil</button>
                </div>
              </div>
            ))}
          </div>
        ):(
          <div className="text-center py-6 text-xs text-white/25">Henüz masraf eklenmedi</div>
        )}
      </Card>
      <Modal open={expOpen} onClose={()=>setExpOpen(false)} title="Masraf Ekle">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Etkinlik</label>
            <select value={expForm.eventId} onChange={e=>setExpForm(p=>({...p,eventId:e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/80">
              <option value="">Genel / Bağımsız</option>
              {events.map(ev=><option key={ev.id} value={ev.id}>{ev.client} - {ev.type}</option>)}
            </select>
          </div>
          <FieldInput label="Açıklama" value={expForm.desc} onChange={e=>setExpForm(p=>({...p,desc:e.target.value}))} placeholder="Çiçek, dekorasyon, kiralama..."/>
          <FieldInput label="Tutar (TL)" type="number" value={expForm.amount} onChange={e=>setExpForm(p=>({...p,amount:e.target.value}))} placeholder="0"/>
          <button onClick={()=>{
            if(expForm.desc&&expForm.amount){
              setExpenses(p=>[...p,{id:Date.now(),...expForm,amount:parseInt(expForm.amount)}]);
              setExpForm({eventId:"",desc:"",amount:""});
              setExpOpen(false);
            }
          }} className="w-full py-2.5 rounded-xl text-xs font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Ekle</button>
        </div>
      </Modal>
      <Card className="overflow-hidden">
        <SectionHeader title="Ödeme Detayları"/>
        {/* Desktop table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full">
            <thead><tr className="border-b border-white/3">
              {["Müşteri","Etkinlik","Tarih","Toplam","Ödenen","Kalan","%","Durum",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-[10px] text-white/40 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {events.map(ev=>{
                const rem=ev.budget-ev.paid;
                const pct=ev.budget>0?Math.round((ev.paid/ev.budget)*100):0;
                return (
                  <tr key={ev.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 text-sm text-white/80 whitespace-nowrap">{ev.client}</td>
                    <td className="px-4 py-3 text-xs text-white/50 whitespace-nowrap">{getIcon(ev.type)} {ev.type}</td>
                    <td className="px-4 py-3 text-xs text-white/50">{ev.date}</td>
                    <td className="px-4 py-3 text-xs font-medium text-white/75 whitespace-nowrap">{ev.budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-medium text-emerald-400 whitespace-nowrap">{ev.paid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-medium text-rose-400 whitespace-nowrap">{rem.toLocaleString()}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full bg-white/10"><div className="h-1.5 rounded-full" style={{width:`${pct}%`,background:pct===100?"#34d399":"linear-gradient(90deg,#8b5cf6,#6366f1)"}}/></div><span className="text-[10px] text-white/40">{pct}%</span></div></td>
                    <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PAY_COL[ev.payment]?.bg||""} ${PAY_COL[ev.payment]?.tx||""}`}>{ev.payment}</span></td>
                    <td className="px-4 py-3">{rem>0&&<button className="text-[10px] px-2.5 py-1 rounded-lg text-white/50 hover:text-white border border-white/3 hover:border-white/20 transition-colors whitespace-nowrap">Tahsil Et</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {events.map(ev=>{
            const rem=ev.budget-ev.paid;
            const pct=ev.budget>0?Math.round((ev.paid/ev.budget)*100):0;
            return (
              <div key={ev.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white/80">{ev.client}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PAY_COL[ev.payment]?.bg||""} ${PAY_COL[ev.payment]?.tx||""}`}>{ev.payment}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] mb-2">
                  <div><div className="text-white/40">Toplam</div><div className="text-white/70 font-medium">{ev.budget.toLocaleString()}</div></div>
                  <div><div className="text-white/40">Ödenen</div><div className="text-emerald-400 font-medium">{ev.paid.toLocaleString()}</div></div>
                  <div><div className="text-white/40">Kalan</div><div className="text-rose-400 font-medium">{rem.toLocaleString()}</div></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10"><div className="h-1.5 rounded-full" style={{width:`${pct}%`,background:pct===100?"#34d399":"linear-gradient(90deg,#8b5cf6,#6366f1)"}}/></div>
                  <span className="text-[10px] text-white/40">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-white/70 mb-5">Tahsilat Oranlari</h2>
        <div className="space-y-3">
          {events.map(ev=>{
            const pct=ev.budget>0?Math.round((ev.paid/ev.budget)*100):0;
            return (
              <div key={ev.id} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-40 flex-shrink-0">
                  <span className="text-sm">{getIcon(ev.type)}</span>
                  <span className="text-xs text-white/55 truncate">{ev.client.split("&")[0].trim()}</span>
                </div>
                <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-500" style={{width:`${pct}%`,background:pct===100?"#34d399":pct>50?"linear-gradient(90deg,#8b5cf6,#6366f1)":"linear-gradient(90deg,#fb923c,#f97316)"}}/>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-white/40 w-8 text-right">{pct}%</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${PAY_COL[ev.payment]?.bg||""} ${PAY_COL[ev.payment]?.tx||""}`}>{ev.payment}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}


/* ── RESERVATION ────────────────────────────────── */
function ReservationPage({events,addEvent,prefillDate,setPrefillDate}) {
  const [step,setStep]=useState(prefillDate?2:1);
  const [form,setForm]=useState({
    type:prefillDate?.type||"",
    date:prefillDate?.date||"",
    time:"",guests:"",location:"",cöncept:"",services:[],name:"",phone:"",email:"",notes:""
  });
  const [kvkk,setKvkk]=useState(false);
  const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const [done,setDone]=useState(false);
  const cöncepts=["Boho & Dogal","Klasik Romantik","Tropical Cenneti","Vintage & Rustik","Modern Minimal","Pembe Masallar","Siyah & Altin","Mavi Ruya"];
  const services=[["Fotoğrafçı",2500],["Video Cekimi",3000],["Pasta",800],["Çiçek Duzenlemesi",1500],["DJ / Muzik",2000],["MC",1500],["Ulasim",500],["Misafir Agirl.",1000]];
  const base=form.guests?parseInt(form.guests)*80:0;
  const servicesPrice=services.filter(([n])=>form.services.includes(n)).reduce((s,[,p])=>s+p,0);
  const total=base+servicesPrice;
  const steps=["Etkinlik Turu","Tarih & Kisi","Konsept","Ek Hizmetler","İletişim","Özet"];

  if(done)return(
    <div className="max-w-md mx-auto text-center py-20">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6" style={{background:"rgba(52,211,153,0.15)"}}>&#10003;</div>
      <h2 className="text-xl font-bold text-white mb-2">Rezervasyon Alindi!</h2>
      <p className="text-white/50 text-sm mb-6">Ekibimiz en kisa surede <span className="text-purple-400">{form.phone||"sizi"}</span> arayacak.</p>
      <div className="p-4 rounded-2xl border border-white/3 bg-white/[0.02] text-left space-y-2 mb-6">
        {[["Etkinlik",form.type],["Tarih",`${form.date} ${form.time}`],["Kişi",`${form.guests} kisi`],["Lokasyon",form.location],["Tahmini",`${total.toLocaleString()} TL`]].map(([k,v])=>(
          <div key={k} className="flex justify-between text-xs"><span className="text-white/45">{k}</span><span className="text-white/75">{v||"—"}</span></div>
        ))}
      </div>
      <button onClick={()=>{setDone(false);setStep(1);setForm({type:"",date:"",time:"",guests:"",location:"",cöncept:"",services:[],name:"",phone:"",email:"",notes:""});}}
        className="px-6 py-3 rounded-xl text-sm font-medium text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
        + Yeni Rezervasyon
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        {steps.map((s,i)=>(
          <div key={s} className={`flex items-center ${i<steps.length-1?"flex-1":""}`}>
            <div className="flex flex-col items-center">
              <div onClick={()=>i<step-1&&setStep(i+1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step>i+1?"bg-emerald-500 text-white cursor-pointer":step===i+1?"bg-purple-500 text-white":"bg-white/8 text-white/40"}`}>
                {step>i+1?"&#10003;":i+1}
              </div>
              <span className="text-[9px] text-white/35 mt-1 text-center w-14 leading-tight">{s}</span>
            </div>
            {i<steps.length-1&&<div className="flex-1 h-px mx-2 mb-4 transition-all" style={{background:step>i+1?"#8b5cf6":"rgba(255,255,255,0.08)"}}/>}
          </div>
        ))}
      </div>
      <Card className="p-6">
        {step===1&&(
          <div>
            <h3 className="text-sm font-semibold text-white/85 mb-5">Etkinlik Türünü Seçin</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EVENT_TYPES.map(t=>(
                <button key={t} onClick={()=>upd("type",t)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${form.type===t?"border-purple-500 bg-purple-500/15":"border-white/3 hover:border-white/20 bg-white/[0.02]"}`}>
                  <span className="text-3xl">{getIcon(t)}</span>
                  <span className="text-[11px] text-white/70 text-center leading-tight">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step===2&&(
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/85 mb-4">Tarih, Saat ve Bilgiler</h3>
            {form.date&&(() => {
              const d=new Date(form.date);
              const holidays=getHoliday(d.getFullYear(),d.getMonth(),d.getDate());
              if(holidays.length===0)return null;
              return (
                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                  <div className="text-xs font-semibold text-amber-300">⚠️ Dikkat - Özel Gün!</div>
                  {holidays.map((h,i)=>(
                    <div key={i} className="text-[11px] text-amber-200/70">{h.icon} {h.name} - {h.type==="resmi"?"Resmi Tatil":h.type==="bayram"?"Bayram":"Özel Gün"}</div>
                  ))}
                  <div className="text-[10px] text-amber-400/50 mt-1">Bu tarihte yoğunluk bekleniyor. Erken rezervasyon önerilir.</div>
                </div>
              );
            })()}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="Etkinlik Tarihi" type="date" value={form.date} onChange={e=>upd("date",e.target.value)}/>
              <FieldInput label="Saat" type="time" value={form.time} onChange={e=>upd("time",e.target.value)}/>
              <FieldInput label="Kisi Sayisi" type="number" value={form.guests} onChange={e=>upd("guests",e.target.value)} placeholder="Misafir sayisi"/>
              <FieldInput label="Lokasyon Tercihi" value={form.location} onChange={e=>upd("location",e.target.value)} placeholder="Semt, salon adi..."/>
            </div>
          </div>
        )}
        {step===3&&(
          <div>
            <h3 className="text-sm font-semibold text-white/85 mb-4">Konsept Seçin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cöncepts.map(c=>(
                <button key={c} onClick={()=>upd("cöncept",c)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${form.cöncept===c?"border-purple-500 bg-purple-500/15":"border-white/3 hover:border-white/20 bg-white/[0.02]"}`}>
                  <span className="text-sm font-medium text-white/80">{c}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step===4&&(
          <div>
            <h3 className="text-sm font-semibold text-white/85 mb-4">Ek Hizmetler</h3>
            <div className="grid grid-cols-2 gap-3">
              {services.map(([name,price])=>{
                const sel=form.services.includes(name);
                return (
                  <button key={name} onClick={()=>upd("services",sel?form.services.filter(x=>x!==name):[...form.services,name])}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${sel?"border-purple-500 bg-purple-500/15":"border-white/3 hover:border-white/20 bg-white/[0.02]"}`}>
                    <span className="text-sm text-white/75">{name}</span>
                    <span className="text-[10px] text-white/40 whitespace-nowrap">+{price.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
            {servicesPrice>0&&<div className="mt-3 text-right text-xs text-purple-400">Ek hizmetler: +{servicesPrice.toLocaleString()} TL</div>}
          </div>
        )}
        {step===5&&(
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/85 mb-4">İletişim Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Ad Soyad" value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="Adiniz ve soyadiniz"/>
              <FieldInput label="Telefon" type="tel" value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="05XX XXX XXXX"/>
              <FieldInput label="E-posta" type="email" value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="mail@ornek.com"/>
            </div>
            <FieldInput label="Ozel Istekler / Notlar" value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Tema, renk, ozel istekler..." rows={3}/>
          </div>
        )}
        {step===6&&(
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/85 mb-4">Özet & Onay</h3>
            <div className="p-4 rounded-xl bg-white/[0.04] space-y-2">
              {[["Etkinlik",form.type||"—"],["Tarih",form.date||"—"],["Saat",form.time||"—"],["Kişi",form.guests?`${form.guests} kisi`:"—"],["Lokasyon",form.location||"—"],["Konsept",form.cöncept||"—"],["Ad Soyad",form.name||"—"],["Telefon",form.phone||"—"]].map(([k,v])=>(
                <div key={k} className="flex justify-between py-1.5 border-b border-white/3">
                  <span className="text-xs text-white/45">{k}</span><span className="text-xs text-white/75">{v}</span>
                </div>
              ))}
              {form.services.length>0&&(
                <div className="flex justify-between py-1.5 border-b border-white/3">
                  <span className="text-xs text-white/45">Ek Hizmetler</span>
                  <span className="text-xs text-white/75 text-right max-w-[200px]">{form.services.join(", ")}</span>
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl border border-purple-500/25 bg-purple-500/8">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-white/60">Tahmini Toplam</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{form.guests&&`${form.guests} kisi x 80 TL`}{servicesPrice>0&&` + ${servicesPrice.toLocaleString()} TL hizmet`}</div>
                </div>
                <span className="text-2xl font-bold text-purple-300">{total.toLocaleString()} TL</span>
              </div>
              <p className="text-[10px] text-white/30 mt-2">* Kesin fiyat görüşme sonrası belirlenir.</p>
            </div>
            {/* KVKK */}
            <div className="p-4 rounded-xl border border-white/6 bg-white/[0.02]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={kvkk} onChange={e=>setKvkk(e.target.checked)} className="mt-1 w-4 h-4 rounded accent-purple-500 flex-shrink-0"/>
                <div className="text-xs text-white/60 leading-relaxed">
                  <span className="text-white/80 font-medium">KVKK Aydınlatma Metni ve Açık Rıza</span><br/>
                  Kişisel verileriniz (ad, soyad, telefon, e-posta, etkinlik bilgileri), 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Merasim tarafından hizmet sunumu, rezervasyon yönetimi ve müşteri iletişimi amacıyla işlenecektir. Verileriniz, etkinlik tarihinden itibaren <span className="text-purple-400 font-medium">30 gün</span> süreyle saklanacak, ardından otomatik olarak silinecektir. Galeri fotoğraflarınız da aynı süre sonunda kaldırılacaktır. Dilediğiniz zaman verilerinizin silinmesini talep edebilirsiniz.<br/>
                  <span className="text-white/40 mt-1 block">Bu kutucuğu işaretleyerek yukarıdaki koşulları okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.</span>
                </div>
              </label>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/3">
          <GlassBtn onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1}>Geri</GlassBtn>
          {step<6?(
            <button onClick={()=>setStep(s=>s+1)} disabled={step===1&&!form.type}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 transition-all hover:opacity-90" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
              Devam
            </button>
          ):(
            <button onClick={async()=>{
              const newEv={client:form.name||"Yeni Müşteri",type:form.type||"Nişan",date:form.date||"—",time:form.time||"—",location:form.location||"—",guests:parseInt(form.guests)||0,budget:total,paid:0,payment:"Bekliyor",status:"pending",tasks:3,done:0,phone:form.phone||""};
              await addEvent(newEv);
              setDone(true);
            }} disabled={!kvkk}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed" style={{background:kvkk?"linear-gradient(135deg,#34d399,#059669)":"linear-gradient(135deg,#374151,#4b5563)"}}>
              Rezervasyonu Gonder
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ── WHA.Ş.PP ───────────────────────────────────── */
function WhatsAppPage({events}) {
  const [active,setActive]=useState(WA_TEMPLATES[0]);
  const [editBody,setEditBody]=useState(WA_TEMPLATES[0].body);
  const [editing,setEditing]=useState(false);
  const [sent,setSent]=useState([]);
  const [preview,setPreview]=useState(false);
  const catCol={rezervasyon:"blue",hatırlatma:"amber",galeri:"green",odeme:"red",davetiye:"purple"};
  const fill=(body,ev)=>{
    if(!body||!ev)return body||"";
    return body
      .replace(/\{isim\}/g,(ev.client||"").split("&")[0].trim())
      .replace(/\{etkinlik_türü\}/g,ev.type||"")
      .replace(/\{tarih\}/g,ev.date||"").replace(/\{saat\}/g,ev.time||"")
      .replace(/\{lokasyon\}/g,ev.location||"").replace(/\{gun\}/g,"3")
      .replace(/\{galeri_link\}/g,`merasim.app/g/${ev.id}`)
      .replace(/\{davetiye_link\}/g,`merasim.app/i/${ev.id}`)
      .replace(/\{tutar\}/g,((ev.budget||0)-(ev.paid||0)).toLocaleString());
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="overflow-hidden">
        <SectionHeader title="Şablonlar"/>
        <div className="divide-y divide-white/5">
          {WA_TEMPLATES.map(tmpl=>(
            <div key={tmpl.id} onClick={()=>{setActive(tmpl);setEditBody(tmpl.body);setEditing(false);}}
              className={`px-4 py-3 cursor-pointer transition-colors ${active?.id===tmpl.id?"bg-green-500/[0.08] border-l-2 border-green-500":"hover:bg-white/[0.02]"}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{tmpl.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/80 truncate">{tmpl.name}</div>
                  <div className="text-[10px] text-white/40 truncate">{tmpl.trigger}</div>
                </div>
                <Badge color={catCol[tmpl.cat]||"gray"}>{tmpl.cat}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="md:col-span-2 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white/85">{active?.icon} {active?.name}</h3>
            <p className="text-xs text-white/45 mt-0.5">{active?.trigger}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <GlassBtn onClick={()=>setPreview(true)}>Önizle</GlassBtn>
            <GlassBtn onClick={()=>setEditing(!editing)}>{editing?"İptal":"Düzenle"}</GlassBtn>
          </div>
        </div>
        {editing?(
          <textarea value={editBody} onChange={e=>setEditBody(e.target.value)} rows={8}
            className="w-full px-4 py-3 rounded-xl text-sm text-white/80 bg-white/3 border border-purple-500/30 outline-none resize-none font-mono leading-relaxed"/>
        ):(
          <div className="p-4 rounded-xl border border-white/3 bg-white/[0.015]">
            <pre className="text-sm text-white/75 whitespace-pre-wrap leading-relaxed font-sans">{editBody}</pre>
          </div>
        )}
        {editing&&<button onClick={()=>setEditing(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Kaydet</button>}
        <div>
          <p className="text-xs text-white/40 mb-2">Degiskenler</p>
          <div className="flex flex-wrap gap-1.5">
            {["{isim}","{etkinlik_türü}","{tarih}","{saat}","{lokasyon}","{galeri_link}","{davetiye_link}","{tutar}","{gun}"].map(v=>(
              <span key={v} className="text-[10px] px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">{v}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-3">Gonderim Hedefleri</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {events.slice(0,6).map(ev=>(
              <div key={ev.id} className="flex items-center gap-2 p-3 rounded-xl border border-white/3 bg-white/[0.015]">
                <span className="text-base">{getIcon(ev.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/75 truncate">{ev.client}</div>
                  <div className="text-[10px] text-white/45">{ev.phone}</div>
                </div>
                <button onClick={()=>{
                  try{
                    const phone=(ev.phone||"").replace(/\D/g,"");
                    if(!phone){alert("Müşteri telefon numarası bulunamadı.");return;}
                    const msg=fill(editBody,ev);
                    const waPhone=phone.startsWith("0")?"90"+phone.slice(1):phone;
                    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`,"_blank");
                    setSent(p=>[{id:Date.now(),name:ev.client,tmpl:active?.name||""},...p]);
                  }catch(err){console.error(err);}
                }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors flex-shrink-0">
                  Gönder
                </button>
              </div>
            ))}
          </div>
        </div>
        {sent.length>0&&(
          <div>
            <p className="text-xs text-white/40 mb-2">Gonderilen ({sent.length})</p>
            <div className="space-y-1.5 max-h-36 overflow-auto">
              {sent.map(s=>(
                <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/8 border border-green-500/15">
                  <span className="text-green-400 text-xs">&#10003;</span>
                  <span className="text-xs text-white/65 flex-1">{s.tmpl} - {s.name}</span>
                  <span className="text-[10px] text-white/35">Az önce</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      <Modal open={preview} onClose={()=>setPreview(false)} title="WhatsApp Önizlemesi">
        <div className="rounded-2xl overflow-hidden" style={{background:"#111b21"}}>
          <div className="p-4 flex items-center gap-3 border-b border-white/3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl">&#128172;</div>
            <div><div className="text-sm font-semibold text-white">Merasim</div><div className="text-[10px] text-white/40">WhatsApp Business</div></div>
          </div>
          <div className="p-4 min-h-40" style={{background:"#0b141a"}}>
            <div className="max-w-[88%] p-3 rounded-2xl rounded-tl-sm text-sm text-white leading-relaxed" style={{background:"#202c33",whiteSpace:"pre-wrap"}}>
              {fill(editBody,events[0])}
              <div className="text-[10px] text-white/40 text-right mt-1.5">14:32 &#10003;&#10003;</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}


/* ── STAFF ──────────────────────────────────────── */
function StaffPage({events}) {
  const [staff,setStaff]=useState(initStaff);
  const [addOpen,setAddOpen]=useState(false);
  const [form,setForm]=useState({name:"",role:"",phone:"",email:""});
  const upd=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const add=()=>{
    if(!form.name.trim())return;
    setStaff(p=>[...p,{id:Date.now(),...form,status:"aktif",events:0,avatar:form.name[0].toUpperCase(),color:"#8b5cf6"}]);
    setForm({name:"",role:"",phone:"",email:""});setAddOpen(false);
  };
  const toggle=(id)=>setStaff(p=>p.map(s=>s.id===id?{...s,status:s.status==="aktif"?"pasif":"aktif"}:s));
  const del=(id)=>setStaff(p=>p.filter(s=>s.id!==id));
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex gap-3">
          <StatBox label="Toplam" value={staff.length} sub="personel" icon="&#9676;" color="#8b5cf6"/>
          <StatBox label="Aktif"  value={staff.filter(s=>s.status==="aktif").length} sub="çalışıyor" icon="&#9689;" color="#34d399"/>
          <StatBox label="Pasif"  value={staff.filter(s=>s.status==="pasif").length} sub="dışarıda"  icon="&#9680;" color="#fb923c"/>
        </div>
        <button onClick={()=>setAddOpen(true)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>+ Personel Ekle</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(s=>(
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0" style={{background:`linear-gradient(135deg,${s.color},${s.color}88)`}}>{s.avatar}</div>
                <div>
                  <div className="text-sm font-semibold text-white/85">{s.name}</div>
                  <Badge color="purple">{s.role}</Badge>
                </div>
              </div>
              <button onClick={()=>toggle(s.id)}><Badge color={s.status==="aktif"?"green":"red"}>{s.status}</Badge></button>
            </div>
            <div className="space-y-1.5 text-xs text-white/55 mb-4">
              {s.phone&&<div>&#128222; {s.phone}</div>}
              {s.email&&<div>&#9993; {s.email}</div>}
              <div>&#128203; {s.events} etkinlik</div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-xl text-[10px] text-white/50 border border-white/3 hover:border-white/20 transition-colors">Mesaj</button>
              <button className="flex-1 py-1.5 rounded-xl text-[10px] text-white/50 border border-white/3 hover:border-white/20 transition-colors">Görevler</button>
              <button onClick={()=>del(s.id)} className="py-1.5 px-2 rounded-xl text-[10px] text-rose-400/50 border border-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-colors">x</button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <SectionHeader title="Etkinlik Atamaları"/>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/3">
              <th className="pb-3 text-left text-[10px] text-white/40 font-medium uppercase tracking-wider">Etkinlik</th>
              {staff.filter(s=>s.status==="aktif").map(s=>(
                <th key={s.id} className="pb-3 text-center text-[10px] text-white/40 font-medium uppercase tracking-wider px-3 whitespace-nowrap">{s.name.split(" ")[0]}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {events.slice(0,5).map(ev=>(
                <tr key={ev.id}>
                  <td className="py-3 text-xs text-white/70 whitespace-nowrap">{getIcon(ev.type)} {ev.client} <span className="text-white/40">- {ev.date}</span></td>
                  {staff.filter(s=>s.status==="aktif").map(s=>{
                    const assigned=initTasks.some(t=>t.eventId===ev.id&&t.assignee.startsWith(s.name.split(" ")[0]));
                    return <td key={s.id} className="py-3 text-center px-3"><span className={`text-base ${assigned?"text-emerald-400":"text-white/10"}`}>{assigned?"●":"○"}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Yeni Personel Ekle">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="Ad Soyad" value={form.name} onChange={upd("name")} placeholder="Adı soyadı"/>
          <FieldInput label="Görev" value={form.role} onChange={upd("role")} placeholder="Dekorasyon, Fotoğrafçı..."/>
          <FieldInput label="Telefon" value={form.phone} onChange={upd("phone")} placeholder="0532 XXX XXXX"/>
          <FieldInput label="E-posta" value={form.email} onChange={upd("email")} placeholder="mail@firma.com"/>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <GlassBtn onClick={()=>setAddOpen(false)}>İptal</GlassBtn>
          <button onClick={add} className="px-5 py-2 rounded-xl text-xs font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Kaydet</button>
        </div>
      </Modal>
    </div>
  );
}

/* ── CRM ────────────────────────────────────────── */
function CRMPage({events}) {
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState("");
  const clients=events.filter(e=>e.client.toLowerCase().includes(search.toLowerCase())||e.phone.includes(search));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Müşteri adi veya telefon ara..."
          className="flex-1 max-w-sm px-4 py-2 rounded-xl text-sm text-white/80 placeholder-white/25 outline-none border border-white/3 bg-white/3 focus:border-purple-500/40 transition-colors"/>
        <span className="text-xs text-white/40">{clients.length} musteri</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden">
          <SectionHeader title="Müşteriler"/>
          <div className="divide-y divide-white/5 max-h-[600px] overflow-auto">
            {clients.map(c=>(
              <div key={c.id} onClick={()=>setSelected(c)}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${selected?.id===c.id?"bg-purple-500/10 border-l-2 border-purple-500":"hover:bg-white/[0.02]"}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:"rgba(139,92,246,0.15)",color:"#8b5cf6"}}>
                  {c.client[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/80 truncate">{c.client}</div>
                  <div className="text-[10px] text-white/40">{c.phone}</div>
                </div>
                <Badge color={c.status==="confirmed"?"green":"amber"}>{c.status==="confirmed"?"Onaylandı":"Bekliyor"}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="md:col-span-2 p-5">
          {selected?(
            <>
              <div className="flex items-start gap-4 pb-5 border-b border-white/3 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
                  {selected.client[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white">{selected.client}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{selected.type} - {selected.date}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge color={selected.status==="confirmed"?"green":"amber"}>{selected.status==="confirmed"?"Onaylandı":"Bekliyor"}</Badge>
                    <Badge color="purple">{selected.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <GlassBtn onClick={()=>{
                    const phone=selected.phone?.replace(/\D/g,"")||"";
                    const url=`https://wa.me/${phone.startsWith("0")?"90"+phone.slice(1):phone}?text=${encodeURIComponent("Merhaba "+selected.client.split("&")[0].trim()+", "+selected.type+" etkinliğiniz hakkında bilgi vermek istiyorum.")}`;
                    window.open(url,"_blank");
                  }}>WhatsApp</GlassBtn>
                  <GlassBtn onClick={()=>{
                    const phone=selected.phone?.replace(/\D/g,"")||"";
                    window.open(`tel:${phone}`,"_blank");
                  }}>Ara</GlassBtn>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[["Telefon",selected.phone],["Etkinlik",selected.type],["Tarih",selected.date],["Bütçe",`${selected.budget.toLocaleString()} TL`],["Ödenen",`${selected.paid.toLocaleString()} TL`],["Kalan",`${(selected.budget-selected.paid).toLocaleString()} TL`]].map(([k,v])=>(
                  <div key={k} className="p-3 rounded-xl bg-white/[0.02] border border-white/3">
                    <div className="text-[10px] text-white/45 mb-1">{k}</div>
                    <div className="text-sm text-white/80 font-medium">{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs text-white/40 mb-3">Etkinlik Gecmisi</h4>
                <div className="space-y-2">
                  {events.filter(e=>e.phone===selected.phone).map(ev=>(
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/3 bg-white/[0.02]">
                      <span className="text-xl">{getIcon(ev.type)}</span>
                      <div className="flex-1">
                        <div className="text-xs text-white/75">{ev.type}</div>
                        <div className="text-[10px] text-white/45">{ev.date} - {ev.location}</div>
                      </div>
                      <Badge color={ev.status==="confirmed"?"green":"amber"}>{ev.status==="confirmed"?"Onaylandı":"Bekliyor"}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              {selected.notes&&(
                <div className="mt-4 p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
                  <div className="text-[10px] text-purple-400 mb-1.5">Not</div>
                  <div className="text-xs text-white/65">{selected.notes}</div>
                </div>
              )}
            </>
          ):(
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-5xl mb-4 opacity-20">&#128101;</div>
              <div className="text-white/40 text-sm">Detaylari gormek için bir musteri seçin</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ── ANALYTICS ──────────────────────────────────── */
function AnalyticsPage({events, tasks}) {
  const totalRev=events.reduce((s,e)=>s+e.budget,0);
  const totalPaid=events.reduce((s,e)=>s+e.paid,0);
  const totalGuests=events.reduce((s,e)=>s+e.guests,0);
  const byType=EVENT_TYPES.map(t=>({type:t,count:events.filter(e=>e.type===t).length,revenue:events.filter(e=>e.type===t).reduce((s,e)=>s+e.budget,0)})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
  const maxCount=Math.max(...byType.map(x=>x.count),1);
  const confRate=Math.round((events.filter(e=>e.status==="confirmed").length/events.length)*100);
  const payRate=Math.round((totalPaid/totalRev)*100);
  const avgBudget=Math.round(totalRev/events.length);
  const monthlyData=[{m:"Oca",r:32,g:28},{m:"Sub",r:28,g:22},{m:"Mar",r:45,g:38},{m:"Nis",r:51,g:44},{m:"May",r:60,g:52},{m:"Haz",r:77,g:77}];
  const maxM=Math.max(...monthlyData.map(d=>d.r),1);
  const localTasks=tasks||initTasks;
  const taskDone=localTasks.filter(t=>t.status==="tamamlandı").length;
  const taskPct=Math.round((taskDone/localTasks.length)*100);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox label="Toplam Gelir"   value={`${(totalRev/1000).toFixed(0)}k TL`}  sub="YTD"              icon="&#128176;" color="#8b5cf6"/>
        <StatBox label="Onay Orani"     value={`%${confRate}`}                         sub="Onaydi / Toplam"  icon="&#10003;"  color="#34d399"/>
        <StatBox label="Tahsilat"       value={`%${payRate}`}                          sub="Odenen / Butce"   icon="&#9680;"   color="#60a5fa"/>
        <StatBox label="Ort. Butce"     value={`${(avgBudget/1000).toFixed(1)}k TL`}  sub="Etkinlik basi"    icon="&#9672;"   color="#f472b6"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-5">Aylık Gelir (k TL)</h2>
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((d,i)=>(
              <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{height:"90%"}}>
                  <div className="w-full rounded-t-md" style={{height:`${(d.g/maxM)*100}%`,background:"rgba(52,211,153,0.4)",minHeight:4}}/>
                  <div className="w-full" style={{height:`${((d.r-d.g)/maxM)*100}%`,background:"rgba(139,92,246,0.3)",minHeight:d.r>d.g?2:0}}/>
                </div>
                <span className="text-[9px] text-white/40">{d.m}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-emerald-400/50 inline-block"/><span className="text-[10px] text-white/45">Tahsilat</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-purple-400/40 inline-block"/><span className="text-[10px] text-white/45">Kalan</span></div>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-5">Etkinlik Turu Dagilimi</h2>
          <div className="space-y-3">
            {byType.map(item=>(
              <div key={item.type} className="flex items-center gap-3">
                <span className="text-base w-6 text-center flex-shrink-0">{getIcon(item.type)}</span>
                <span className="text-xs text-white/60 w-28 flex-shrink-0 truncate">{item.type}</span>
                <div className="flex-1 h-2 rounded-full bg-white/8">
                  <div className="h-2 rounded-full" style={{width:`${(item.count/maxCount)*100}%`,background:"linear-gradient(90deg,#8b5cf6,#6366f1)"}}/>
                </div>
                <span className="text-xs text-white/40 w-5 text-right flex-shrink-0">{item.count}</span>
                <span className="text-[10px] text-white/35 w-14 text-right flex-shrink-0">{(item.revenue/1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Ödeme Durumu</h2>
          <div className="space-y-3">
            {[{label:"Tam Odendi",count:events.filter(e=>e.payment==="tam").length,color:"#34d399"},{label:"Kapora Alindi",count:events.filter(e=>e.payment==="kapora").length,color:"#60a5fa"},{label:"Ödeme Bekliyor",count:events.filter(e=>e.payment==="bekliyor").length,color:"#f87171"}].map(s=>(
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background:s.color}}/><span className="text-xs text-white/60">{s.label}</span></div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-white/8"><div className="h-1.5 rounded-full" style={{width:`${(s.count/events.length)*100}%`,background:s.color}}/></div>
                  <span className="text-xs text-white/40 w-4 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Gorev Tamamlama</h2>
          <div className="flex items-center justify-center py-3">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="3"
                  strokeDasharray={`${taskPct} 100`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{taskPct}%</span>
                <span className="text-[9px] text-white/40">Tamamlandi</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            {["tamamlandı","devam","bekliyor"].map(s=>(
              <div key={s} className="text-center">
                <div className="text-sm font-bold" style={{color:s==="tamamlandı"?"#34d399":s==="devam"?"#60a5fa":"#fbbf24"}}>{localTasks.filter(t=>t.status===s).length}</div>
                <div className="text-[9px] text-white/40">{TASK_COL[s]?.label||s}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Toplam Misafir</h2>
          <div className="text-3xl font-bold text-white mb-1">{totalGuests.toLocaleString()}</div>
          <div className="text-xs text-white/45 mb-4">Bu ay - {events.length} etkinlik</div>
          <div className="space-y-2">
            {events.sort((a,b)=>b.guests-a.guests).slice(0,4).map(ev=>(
              <div key={ev.id} className="flex items-center gap-2">
                <span className="text-sm">{getIcon(ev.type)}</span>
                <span className="text-xs text-white/55 flex-1 truncate">{ev.client.split("&")[0].trim()}</span>
                <div className="w-16 h-1.5 rounded-full bg-white/8"><div className="h-1.5 rounded-full" style={{width:`${(ev.guests/totalGuests)*100}%`,background:"#8b5cf6"}}/></div>
                <span className="text-[10px] text-white/45 w-6 text-right">{ev.guests}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}


/* ── AI ─────────────────────────────────────────── */
function AIPage() {
  const [mode,setMode]=useState("offer");
  const [input,setInput]=useState("");
  const [msgs,setMsgs]=useState([{role:"assistant",text:"Merhaba! Ben Merasim AI asistanıyım.\n\nTeklif oluşturma, konsept önerisi veya genel sorularinizda yardımcı olabilirim. Aşağıdaki hazır sorulardan birini seçin veya kendiniz yazin."}]);
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  const SYSTEMS={
    offer:"Sen Merasim için çalışan bir Turk organizasyon şirketinin teklif asistanısın. Kullanici etkinlik bilgisi verdiğinde TL cinsinden fiyat aralıkları, dahil hizmetler, notlar ve konsept onerileri içeren profesyonel Turkce teklifler hazırla. Net, sıcak ve özlü ol.",
    cöncept:"Sen Merasim için bir Turk organizasyon firmasinin kreatif direktörüsün. Kullaniçinin belirttigi tema ve etkinlik türüne gore Turkce olarak renk paleti, dekor fikirleri, cicek secimi, masa duzeni, isiklandirma onerileri sun.",
    chat:"Sen Merasim organizasyon platformunun Turkce konusan AI asistanısın. Etkinlik planlamasi, organizasyon ipuçları ve platform kullanımı hakkında kisa, samimi ve pratik cevaplar ver."
  };
  const PROMPTS={
    offer:["50 kişilik nisan teklifi","120 kisi kina bütçesi","Kurumsal yilsonu yemeği"],
    cöncept:["Boho tarzında romantik nisan","Pembe & altin baby shower","Siyah & beyaz modern gece"],
    chat:["En popüler etkinlik trendleri","QR galeri nasıl çalışır?","Organizasyon planlamasi ipuçları"]
  };
  const MODES=[{id:"offer",icon:"&#128203;",label:"Teklif Olustur"},{id:"cöncept",icon:"&#127912;",label:"Konsept Oner"},{id:"chat",icon:"&#128172;",label:"Genel Asistan"}];
  const send=async()=>{
    if(!input.trim()||loading)return;
    const txt=input.trim();setInput("");
    const newMsgs=[...msgs,{role:"user",text:txt}];
    setMsgs(newMsgs);setLoading(true);
    try{
      const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
      if(!API_KEY){
        // Fallback: yerel cevaplar
        const fallbackResponses={
          offer:"📋 **Teklif Taslağı**\n\nSeçtiğiniz etkinlik için tahmini fiyat aralığı:\n\n• **50 kişi:** 8.000 - 15.000 TL\n• **100 kişi:** 15.000 - 28.000 TL\n• **200 kişi:** 28.000 - 50.000 TL\n\nFiyata dahil: Mekan, dekorasyon, catering, DJ\n\n*Not: Kesin fiyat görüşme sonrası belirlenir.*\n\n🔑 AI asistanı tam kapasite kullanmak için Ayarlar > API Key bölümünden Anthropic API anahtarınızı girin.",
          cöncept:"🎨 **Konsept Önerisi**\n\n**Renk Paleti:** Pastel pembe, altın, krem\n\n**Dekorasyon:**\n• Çiçek aranjmanları (güller, lilyumlar)\n• Altın çerçeveli aynalar\n• Mum ışığı aydınlatma\n• Tül drapeler\n\n**Masa Düzeni:**\n• Yuvarlak masalar, altın runner\n• Kristal suplalar\n• Şamdanlar\n\n🔑 AI asistanı tam kapasite kullanmak için Ayarlar > API Key bölümünden Anthropic API anahtarınızı girin.",
          chat:"💬 **Merasim AI Asistan**\n\nSize nasıl yardımcı olabilirim?\n\n• Etkinlik planlaması\n• Bütçe hesaplama\n• Konsept önerileri\n• Davetiye tasarımı\n• Misafir yönetimi\n\n🔑 AI asistanı tam kapasite kullanmak için Ayarlar > API Key bölümünden Anthropic API anahtarınızı girin."
        };
        const response=fallbackResponses[mode]||fallbackResponses.chat;
        setTimeout(()=>{
          setMsgs(p=>[...p,{role:"assistant",text:response}]);
          setLoading(false);
          setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
        },800);
        return;
      }
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEMS[mode],
          messages:newMsgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}))})
      });
      const data=await res.json();
      setMsgs(p=>[...p,{role:"assistant",text:data.content?.[0]?.text||"Bir hata oluştu."}]);
    }catch{
      setMsgs(p=>[...p,{role:"assistant",text:"Bağlantı hatası. Lütfen tekrar deneyin."}]);
    }
    setLoading(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex gap-3">
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>{setMode(m.id);setMsgs([{role:"assistant",text:"Merhaba! Ne yapmami istersiniz?"}]);}}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border ${mode===m.id?"border-purple-500/40 bg-purple-500/15 text-purple-300":"border-white/3 text-white/40 hover:text-white/60 hover:border-white/15"}`}>
            <span dangerouslySetInnerHTML={{__html:m.icon}}/>{m.label}
          </button>
        ))}
      </div>
      <Card className="flex flex-col" style={{height:"58vh"}}>
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {msgs.map((msg,i)=>(
            <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role==="user"?"text-white":"text-white/80 border border-white/3"}`}
                style={{background:msg.role==="user"?"linear-gradient(135deg,#8b5cf6,#6366f1)":"rgba(255,255,255,0.05)"}}>
                {msg.role==="assistant"&&<div className="text-[10px] text-purple-400 font-medium mb-1.5">&#10022; Merasim AI</div>}
                <div style={{whiteSpace:"pre-wrap"}}>{msg.text}</div>
              </div>
            </div>
          ))}
          {loading&&(
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 border border-white/3" style={{background:"rgba(255,255,255,0.05)"}}>
                <div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {PROMPTS[mode].map(p=>(
            <button key={p} onClick={()=>setInput(p)} className="text-[10px] px-3 py-1.5 rounded-full text-white/40 border border-white/3 hover:text-white/70 hover:border-white/20 transition-all">{p}</button>
          ))}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Mesajinizi yazin..."
            className="flex-1 px-4 py-3 rounded-xl text-sm text-white/80 placeholder-white/25 bg-white/3 border border-white/3 focus:border-purple-500/40 outline-none transition-colors"/>
          <button onClick={send} disabled={loading||!input.trim()}
            className="px-5 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-40 transition-all hover:opacity-90" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
            &#8593;
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ── SETTINGS ───────────────────────────────────── */
function SettingsPage({company,setPage}) {
  const [saved,setSaved]=useState(false);
  const [notifs,setNotifs]=useState({rsvp:true,payment:true,task:true,gallery:false,reminder:true});
  const [profile,setProfile]=useState({
    company:company?.name||"",
    email:company?.email||"",
    phone:company?.phone||"",
    address:company?.address||"",
    city:company?.city||"",
    currency:company?.currency||"TRY",
    whatsapp:company?.whatsapp||"",
    instagram:"",
    facebook:"",
    website:""
  });
  const upd=k=>e=>setProfile(p=>({...p,[k]:e.target.value}));
  const save=async()=>{
    if(company?.id){
      await supabase.from('companies').update({
        name:profile.company,
        email:profile.email,
        phone:profile.phone,
        address:profile.address,
        city:profile.city,
        currency:profile.currency,
        whatsapp:profile.whatsapp,
      }).eq('id',company.id);
    }
    setSaved(true);setTimeout(()=>setSaved(false),2500);
  };
  return (
    <div className="max-w-2xl space-y-5">
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white/80">Firma Profili</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="Firma Adı"          value={profile.company}  onChange={upd("company")}  placeholder="Firma adı"/>
          <FieldInput label="E-posta"             value={profile.email}    onChange={upd("email")}    placeholder="info@firma.com"/>
          <FieldInput label="Telefon"             value={profile.phone}    onChange={upd("phone")}    placeholder="0212 XXX XXXX"/>
          <FieldInput label="WhatsApp İş Hattı"   value={profile.whatsapp} onChange={upd("whatsapp")} placeholder="0212 XXX XXXX"/>
          <div className="sm:col-span-2">
            <FieldInput label="Adres"              value={profile.address}  onChange={upd("address")}  placeholder="Firma adresi"/>
          </div>
          <FieldInput label="Şehir"               value={profile.city}     onChange={upd("city")}     placeholder="Bursa"/>
          <FieldSelect label="Para Birimi"        value={profile.currency} onChange={upd("currency")} options={["TRY","USD","EUR"]}/>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-white/80 mb-4">Sosyal Medya</h2>
        <div className="space-y-3">
          <FieldInput label="📸 Instagram" value={profile.instagram} onChange={upd("instagram")} placeholder="https://instagram.com/kullaniciadi"/>
          <FieldInput label="📘 Facebook" value={profile.facebook} onChange={upd("facebook")} placeholder="https://facebook.com/sayfaadi"/>
          <FieldInput label="🌐 Web Sitesi" value={profile.website} onChange={upd("website")} placeholder="https://ornek.com"/>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-white/80 mb-4">Bildirim Tercihleri</h2>
        <div className="space-y-3">
          {[{k:"rsvp",l:"RSVP Bildirimleri",s:"Yeni davetiye cevabı"},{k:"payment",l:"Ödeme Hatırlatmaları",s:"Bekleyen ödemelerde"},{k:"task",l:"Görev Güncellemeleri",s:"Durum değişiminde"},{k:"gallery",l:"Galeri Yüklemeleri",s:"Yeni fotoğraf yüklendiğinde"},{k:"reminder",l:"Etkinlik Hatırlatmaları",s:"24 saat önceden"}].map(n=>(
            <div key={n.k} className="flex items-center justify-between py-2 border-b border-white/3 last:border-0">
              <div>
                <div className="text-sm text-white/75">{n.l}</div>
                <div className="text-xs text-white/45">{n.s}</div>
              </div>
              <button onClick={()=>setNotifs(p=>({...p,[n.k]:!p[n.k]}))}
                className={`w-11 h-6 rounded-full transition-all relative ${notifs[n.k]?"bg-purple-500":"bg-white/15"}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${notifs[n.k]?"left-6":"left-1"}`}/>
              </button>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-white/80 mb-4">Sistem Durumu</h2>
        <div className="space-y-2">
          {[["WhatsApp Business API","Bağlantı bekleniyor"],["QR Sistemi","Dynamic - Token bazlı"],["Depolama","Yerel"],["Otomatik Yedekleme","Günlük - Son: Bugün 03:00"],["SSL Sertifikası","Aktif"]].map(([k,v])=>(
            <div key={k} className="flex items-center justify-between py-2 border-b border-white/3 last:border-0">
              <div>
                <div className="text-sm text-white/70">{k}</div>
                <div className="text-xs text-white/40">{v}</div>
              </div>
              <Badge color="green">Aktif</Badge>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex justify-end">
        <button onClick={save} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{background:saved?"linear-gradient(135deg,#34d399,#059669)":"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
          {saved?"Kaydedildi":"Kaydet"}
        </button>
      </div>
    </div>
  );
}

/* ── NOTIF PANEL ────────────────────────────────── */
function NotifPanel({onClose,setPage,notifs,setNotifs}) {
  const unread=notifs.filter(n=>!n.read).length;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full w-80 z-50 border-l border-white/6 overflow-auto flex flex-col" style={{background:"rgba(17,24,39,0.95)"}}>
        <div className="px-5 py-4 border-b border-white/3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-white/85">Bildirimler</h2>
            {unread>0 && <span className="text-[10px] text-purple-400 mt-0.5">{unread} okunmamis</span>}
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))} className="text-[10px] text-white/40 hover:text-white/60 transition-colors">Hepsini Oku</button>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xl leading-none">x</button>
          </div>
        </div>
        <div className="flex-1 divide-y divide-white/5 overflow-auto">
          {notifs.map(n=>(
            <div key={n.id} onClick={()=>{setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x));if(n.page){setPage(n.page);onClose();}}}
              className={`px-5 py-4 cursor-pointer transition-colors hover:bg-white/[0.02] ${!n.read?"bg-purple-500/[0.04]":""}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs leading-relaxed ${n.read?"text-white/50":"text-white/85 font-medium"}`}>{n.text}</div>
                  <div className="text-[10px] text-white/35 mt-1">{n.time}</div>
                </div>
                {!n.read&&<span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-1"/>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


/* ── ROOT APP ───────────────────────────────────── */
const NAV=[
  {id:"dashboard",   icon:"&#11041;", label:"Dashboard"   },
  {id:"events",      icon:"&#10680;", label:"Etkinlikler" },
  {id:"calendar",    icon:"&#9638;",  label:"Takvim"      },
  {id:"tasks",       icon:"&#10687;", label:"Görevler"    },
  {id:"invitations", icon:"&#9676;",  label:"Davetiyeler" },
  {id:"gallery",     icon:"&#9681;",  label:"Galeri"      },
  {id:"payments",    icon:"&#9680;",  label:"Ödemeler"    },
  {id:"reservation", icon:"&#65291;", label:"Rezervasyon" },
  {id:"whatsapp",    icon:"&#128172;",label:"WhatsApp"    },
  {id:"staff",       icon:"&#9689;",  label:"Personel"    },
  {id:"crm",         icon:"&#128101;",label:"Müşteri CRM" },
  {id:"analytics",   icon:"&#128202;",label:"Analitik"    },
  {id:"ai",          icon:"&#10022;", label:"AI Asistan"  },
  {id:"settings",    icon:"&#9711;",  label:"Ayarlar"     },
];

function MerasimApp() {
  // URL'yi同步 olarak kontrol et — önce public sayfalar
  const initPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const initInvite = initPath.match(/^\/i\/(.+)/);
  const initGallery = initPath.match(/^\/g\/(.+)/);

  const { user, loading } = useAuth()
  const [route, setRoute] = useState(
    initInvite ? 'public-invite' : initGallery ? 'public-gallery' : 'landing'
  )
  const [publicId, setPublicId] = useState(
    initInvite ? initInvite[1] : initGallery ? initGallery[1] : null
  )

  // Kullanıcı giriş yaptığında otomatik dashboard'a yönlendir (public sayfalar hariç)
  useEffect(() => {
    if (user && route !== 'public-invite' && route !== 'public-gallery' && (route === 'auth' || route === 'landing')) {
      setRoute('dashboard')
    }
  }, [user, route])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:"#111827"}}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xs text-white/30">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (route === 'public-invite') return <PublicInvitePage eventId={publicId} onBack={() => setRoute('landing')} />
  if (route === 'public-gallery') return <PublicGalleryPage eventId={publicId} onBack={() => setRoute('landing')} />
  if (route === 'landing') return <LandingPage onNavigate={setRoute} />
  if (route === 'auth') return <AuthPage />
  return <Dashboard />
}

export default function Merasim() {
  return <MerasimApp />
}

function Dashboard() {
  const { user, company, isPro } = useAuth()
  const {
    events, setEvents, addEvent, updateEvent, deleteEvent,
    tasks, setTasks, addTask, updateTask,
    gallery, setGallery,
    guests, addGuest, updateGuest,
    expenses, setExpenses, addExpense, deleteExpense,
    notifs, setNotifs, addNotif, markNotifRead,
    dataLoading,
  } = useData()
  const [page,setPage]=useState("dashboard");
  const [sidebar,setSidebar]=useState(false);
  const [notifOpen,setNotifOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [prefillDate,setPrefillDate]=useState(null);
  const unread=notifs.filter(n=>!n.read).length;

  // Detect mobile
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",handler);
    return ()=>window.removeEventListener("resize",handler);
  },[]);

  useEffect(()=>{
    // On desktop default sidebar open, on mobile closed
    setSidebar(!isMobile);
  },[isMobile]);

  useEffect(()=>{
    const handler=(e)=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();setSearchOpen(true);}};
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);

  // Etkinlik öncesi otomatik hatırlatmalar (7 gün, 3 gün, 1 gün)
  useEffect(()=>{
    const now=new Date();
    events.forEach(ev=>{
      const eventDate=new Date(ev.date);
      const diffDays=Math.ceil((eventDate-now)/(1000*60*60*24));
      if(diffDays===7||diffDays===3||diffDays===1){
        setNotifs(prev=>{
          const key=`reminder-${ev.id}-${diffDays}`;
          if(prev.some(n=>n.id===key))return prev;
          const text=diffDays===7
            ?`${ev.client} - ${ev.type} etkinliğine 7 gün kaldı! Hazırlıklarınızı kontrol edin.`
            :diffDays===3
            ?`${ev.client} - ${ev.type} etkinliğine 3 gün kaldı! Son kontrolleri yapın.`
            :`${ev.client} - ${ev.type} etkinliği YARIN! Her şey hazır mı?`;
          return [{id:key,icon:diffDays===1?"⚡":"⏰",text,time:"Otomatik",read:false,page:"events"},...prev];
        });
      }
    });
  },[events]);

  // 30 gün otomasyonu: Süresi dolan galeri fotoğraflarını sil + teşekkür bildirimi
  useEffect(()=>{
    const now=new Date();
    events.forEach(ev=>{
      const eventDate=new Date(ev.date);
      const diffDays=Math.floor((now-eventDate)/(1000*60*60*24));
      if(diffDays>=30){
        // Galeri fotoğraflarını sil
        const photosBefore=gallery.filter(g=>g.event_id===ev.id).length;
        if(photosBefore>0){
          setGallery(prev=>prev.filter(g=>g.event_id!==ev.id));
        }
        // Teşekkür bildirimi ekle (eğer daha önce eklenmemişse)
        setNotifs(prev=>{
          const alreadyExists=prev.some(n=>n.id===`thanks-${ev.id}`);
          if(alreadyExists)return prev;
          return [{id:`thanks-${ev.id}`,icon:"💐",text:`${ev.client} - ${ev.type} etkinliğinizden 30 gün geçti. Bizi tercih ettiğiniz için teşekkür ederiz! Galeri fotoğrafları KVKK kapsamında otomatik olarak kaldırılmıştır.`,time:"Otomatik",read:false,page:"events"},...prev];
        });
      }
    });
  },[]); // Sadece ilk yüklemede çalışır

  // Close sidebar on mobile when navigating
  const navigate=(p)=>{
    setPage(p);
    if(isMobile) setSidebar(false);
  };

  const PAGES={
    dashboard:<DashboardPage events={events} tasks={tasks} setPage={navigate}/>,
    events:<EventsPage events={events} setEvents={setEvents} updateEvent={updateEvent} setPage={navigate}/>,
    calendar:<CalendarPage events={events} setPage={navigate} setPrefillDate={setPrefillDate}/>,
    tasks:<TasksPage tasks={tasks} setTasks={setTasks} events={events}/>,
    invitations:<InvitationsPage events={events} guests={guests} updateEvent={updateEvent}/>,
    gallery:<GalleryPage events={events} gallery={gallery} setGallery={setGallery} company={company}/>,
    payments:<PaymentsPage events={events}/>,
    reservation:<ReservationPage events={events} addEvent={addEvent} prefillDate={prefillDate} setPrefillDate={setPrefillDate}/>,
    whatsapp:<WhatsAppPage events={events}/>,
    staff:<StaffPage events={events} tasks={tasks}/>,
    crm:<CRMPage events={events}/>,
    analytics:<AnalyticsPage events={events} tasks={tasks}/>,
    ai:<AIPage/>,
    settings:<SettingsPage company={company} setPage={navigate}/>,
  };

  const currentNav = NAV.find(n=>n.id===page);

  return (
    <div className="flex h-screen bg-[#07070e] text-white overflow-hidden" style={{fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebar && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={()=>setSidebar(false)}/>
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-white/[0.1] flex-shrink-0 transition-all duration-300 ${isMobile?"fixed top-0 left-0 h-full z-50":"relative"}`}
        style={{
          width: sidebar ? 240 : (isMobile ? 0 : 64),
          overflow: isMobile && !sidebar ? "hidden" : "visible",
          background:"linear-gradient(180deg,#0e0e1c 0%,#07070e 100%)",
          boxShadow: isMobile && sidebar ? "4px 0 32px rgba(0,0,0,0.5)" : "none",
          minWidth: isMobile && !sidebar ? 0 : undefined,
        }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.1]" style={{minWidth:0}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#111827",border:"1.5px solid rgba(139,92,246,0.4)"}}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="13" r="7" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              <text x="16" y="17" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="url(#logoGrad)">M</text>
              <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#8b5cf6"/><stop offset="1" stopColor="#6366f1"/></linearGradient></defs>
            </svg>
          </div>
          {(sidebar) && (
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-wide text-white whitespace-nowrap">Merasim</div>
              <div className="text-[10px] text-white/35 tracking-widest uppercase whitespace-nowrap">Organizasyon</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto overflow-x-hidden">
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>navigate(item.id)}
              className="w-full flex items-center gap-3 rounded-xl transition-all text-left"
              style={{
                padding: sidebar ? "10px 12px" : "10px 0",
                justifyContent: sidebar ? "flex-start" : "center",
                background:page===item.id?"rgba(139,92,246,0.12)":"transparent",
                color:page===item.id?"#8b5cf6":"rgba(255,255,255,0.42)"
              }}>
              <span className="text-lg flex-shrink-0" dangerouslySetInnerHTML={{__html:item.icon}}/>
              {sidebar && (
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <span className="text-sm font-medium truncate">{item.label}</span>
                  {item.id==="ai"&&<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 flex-shrink-0 whitespace-nowrap">AI</span>}
                  {item.id==="analytics"&&<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex-shrink-0 whitespace-nowrap">YENİ</span>}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/[0.1]">
          <div className="flex items-center gap-3" style={{justifyContent:sidebar?"flex-start":"center"}}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
              {(company?.name||user?.email||"M")[0].toUpperCase()}
            </div>
            {sidebar && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-white/70 truncate">{company?.name||"Kullanıcı"}</div>
                <div className="text-[10px] text-white/40 truncate">{user?.email||""}</div>
              </div>
            )}
            {sidebar && (
              <button onClick={async()=>{await supabase.auth.signOut();window.location.reload();}} className="text-white/20 hover:text-rose-400 transition-colors p-1" title="Çıkış Yap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.1] flex-shrink-0 gap-3"
          style={{background:"#111827"}}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={()=>setSidebar(!sidebar)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/3 transition-all flex-shrink-0 text-lg">
              &#9776;
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white/85 truncate">{currentNav?.label}</h1>
              <p className="text-[10px] text-white/35">Haziran 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search - icon only on mobile */}
            <button onClick={()=>setSearchOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 border border-white/3 hover:border-white/20 transition-all">
              &#128269;
            </button>
            {/* New event - text on desktop, icon on mobile */}
            <button onClick={()=>navigate("reservation")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
              style={{background:"rgba(139,92,246,0.18)",color:"#8b5cf6",border:"1px solid rgba(139,92,246,0.28)"}}>
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:block whitespace-nowrap">Yeni Etkinlik</span>
            </button>
            {/* Notif */}
            <button onClick={()=>setNotifOpen(true)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 transition-all border border-white/3 hover:border-white/20">
              &#128276;
              {unread>0&&<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] flex items-center justify-center font-bold">{unread}</span>}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto" style={{background:"#111827",padding:isMobile?"12px":"24px"}}>
          {PAGES[page]||<div className="text-white/35 text-sm text-center py-20">Sayfa bulunamadı</div>}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav className="flex-shrink-0 border-t border-white/[0.1] flex items-center justify-around px-2 py-2"
            style={{background:"#151b2b"}}>
            {[
              {id:"dashboard",icon:"&#11041;"},
              {id:"events",icon:"&#10680;"},
              {id:"tasks",icon:"&#10687;"},
              {id:"calendar",icon:"&#9638;"},
              {id:"payments",icon:"&#9680;"},
            ].map(item=>(
              <button key={item.id} onClick={()=>navigate(item.id)}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
                style={{color:page===item.id?"#8b5cf6":"rgba(255,255,255,0.35)",background:page===item.id?"rgba(139,92,246,0.1)":"transparent"}}>
                <span className="text-xl" dangerouslySetInnerHTML={{__html:item.icon}}/>
                <span className="text-[9px] font-medium capitalize">{NAV.find(n=>n.id===item.id)?.label}</span>
              </button>
            ))}
            <button onClick={()=>setSidebar(true)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
              style={{color:"rgba(255,255,255,0.35)"}}>
              <span className="text-xl">&#9776;</span>
              <span className="text-[9px] font-medium">Menü</span>
            </button>
          </nav>
        )}
      </div>

      {notifOpen&&<NotifPanel onClose={()=>setNotifOpen(false)} setPage={(p)=>{navigate(p);}} notifs={notifs} setNotifs={setNotifs}/>}
      {searchOpen&&<GlobalSearch events={events} setPage={navigate} onClose={()=>setSearchOpen(false)}/>}
    </div>
  );
}