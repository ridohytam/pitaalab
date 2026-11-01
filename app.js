const $ = s => document.querySelector(s);
const state = {
  page: "dashboard", role: "admin",
  orders: [
    {id:"ORD-1024",patient:"Andi Saputra",test:"Darah lengkap",date:"02 Nov 2026",status:"Menunggu"},
    {id:"ORD-1023",patient:"Siti Rahma",test:"Glukosa darah",date:"02 Nov 2026",status:"Diproses"},
    {id:"ORD-1022",patient:"Budi Santoso",test:"Kolesterol",date:"01 Nov 2026",status:"Selesai"}
  ],
  patients: [
    {id:"P-001",name:"Andi Saputra",age:29,gender:"Laki-laki",phone:"0812-0000-1111"},
    {id:"P-002",name:"Siti Rahma",age:34,gender:"Perempuan",phone:"0812-0000-2222"},
    {id:"P-003",name:"Budi Santoso",age:46,gender:"Laki-laki",phone:"0812-0000-3333"}
  ],
  exams: [
    {id:"EX-301",patient:"Andi Saputra",test:"Darah lengkap",doctor:"dr. Maya",result:"Menunggu",date:"02 Nov 2026"},
    {id:"EX-300",patient:"Siti Rahma",test:"Glukosa darah",doctor:"dr. Maya",result:"Normal",date:"02 Nov 2026"},
    {id:"EX-299",patient:"Budi Santoso",test:"Kolesterol",doctor:"dr. Arif",result:"Tinggi",date:"01 Nov 2026"}
  ],
  stock: [
    {name:"Reagen Hematologi",type:"Reagen",qty:8,unit:"botol",min:5},
    {name:"Reagen Glukosa",type:"Reagen",qty:3,unit:"kit",min:5},
    {name:"Tabung EDTA",type:"Bahan habis pakai",qty:120,unit:"pcs",min:30},
    {name:"Mikropipet",type:"Alat",qty:4,unit:"unit",min:2}
  ],
  qc: [{date:"02 Nov 2026",item:"Kontrol Hematologi Level 1",result:"Lulus",operator:"Analis Rina"},{date:"01 Nov 2026",item:"Kontrol Glukosa",result:"Perlu evaluasi",operator:"Analis Dedi"}]
};
const titles={dashboard:"Beranda",orders:"Notifikasi & Order",patients:"Data Pasien",examinations:"Pemeriksaan",inventory:"Stok Reagen & Bahan Alat",quality:"Quality Control",integration:"Integrasi Alat","patient-portal":"Beranda Pasien", "my-orders":"Order Saya", "my-results":"Hasil Pemeriksaan", "doctor-orders":"Order Pasien", "doctor-results":"Hasil Pasien", "doctor-patients":"Daftar Pasien", "doctor-profile":"Profil Dokter", "patient-profile":"Profil Saya"};
const menus = {
 admin: [
  ["dashboard","▦","Beranda"],["orders","▤","Notifikasi & Order"],["patients","♙","Data Pasien"],["examinations","⚕","Pemeriksaan"],["inventory","▣","Stok Reagen & Alat"],["quality","✓","Quality Control"],["integration","⌘","Integrasi Alat"]
 ],
 doctor: [
  ["dashboard","▦","Beranda Dokter"],["doctor-patients","♙","Daftar Pasien"],["doctor-orders","▤","Order Pemeriksaan"],["doctor-results","⚕","Hasil Pemeriksaan"],["doctor-profile","◉","Profil Dokter"]
 ],
 patient: [
  ["patient-portal","▦","Beranda Pasien"],["my-orders","▤","Order Saya"],["my-results","⚕","Hasil Pemeriksaan"],["patient-profile","◉","Profil Saya"]
 ]
};
function renderNavigation(){
 const nav=$("#navigation");
 const makeMenu=([page,icon,label])=>`<button class="nav-link" data-page="${page}">${icon} <span>${label}</span>${page==="orders"?`<i>${state.orders.filter(o=>o.status==="Menunggu").length}</i>`:""}</button>`;
 nav.innerHTML=menus[state.role].map(makeMenu).join("");
 nav.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
 const mobile=$("#mobileNavigation");
 if(mobile){
  mobile.innerHTML=menus[state.role].map(([page,icon,label])=>`<button class="mobile-nav-item ${page===state.page?"active":""}" data-page="${page}"><span class="nav-ico">${icon}</span><span>${label}</span></button>`).join("");
  mobile.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
 }
}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function statusPill(s){let c=s==="Selesai"||s==="Normal"||s==="Lulus"?"green":s==="Menunggu"||s==="Diproses"?"yellow":"red";return `<span class="pill ${c}">${s}</span>`}
function stat(label,value,sub,ico){return `<div class="stat"><div class="stat-top"><span>${label}</span><span class="stat-icon">${ico}</span></div><strong>${value}</strong><small>${sub}</small></div>`}
function table(headers,rows){return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows||""}</tbody></table></div>`}
function dashboard(){
 if(state.role==="patient") return patientPortal();
 if(state.role==="doctor") return doctorDashboard();
 return `<div class="welcome"><div><h2>Selamat datang di LabCare 👋</h2><p>Ringkasan aktivitas laboratorium hari ini.</p></div><button class="btn" onclick="go('orders')">+ Buat order</button></div>
 <div class="stats">${stat("Kunjungan hari ini","42","+12% dari kemarin","♙")}${stat("Order pemeriksaan","28","8 order menunggu","▤")}${stat("Pemeriksaan selesai","19","68% dari total order","✓")}${stat("Stok perlu perhatian","2","Item di bawah batas minimum","▣")}</div>
 <div class="grid-2"><div class="panel"><div class="panel-head"><h3>Statistik kunjungan</h3><span class="muted">7 hari terakhir</span></div>${[["Senin",26],["Selasa",34],["Rabu",29],["Kamis",40],["Jumat",36],["Sabtu",22],["Minggu",18]].map(x=>`<div class="bar-row"><span>${x[0]}</span><div class="bar"><span style="width:${x[1]*2}%"></span></div><b>${x[1]}</b></div>`).join("")}</div>
 <div class="panel"><div class="panel-head"><h3>Aktivitas terbaru</h3><button class="btn secondary" onclick="go('orders')">Lihat order</button></div>
 <div class="notice">🔔 ${state.orders.filter(o=>o.status==="Menunggu").length} order menunggu verifikasi.</div><div class="notice info">ℹ️ Reagen Glukosa berada di bawah stok minimum.</div><div class="notice info">✓ Quality control hematologi terakhir: lulus.</div></div></div>
 <div class="panel"><div class="panel-head"><h3>Order terbaru</h3><span class="muted">Data simulasi</span></div>${table(["ID Order","Pasien","Pemeriksaan","Tanggal","Status"],state.orders.map(o=>`<tr><td>${o.id}</td><td>${o.patient}</td><td>${o.test}</td><td>${o.date}</td><td>${statusPill(o.status)}</td></tr>`).join(""))}</div>`;
}
function doctorDashboard(){return `<div class="welcome"><div><h2>Selamat datang, Dokter</h2><p>Pantau order pemeriksaan dan hasil pasien.</p></div></div><div class="stats">${stat("Pasien hari ini","12","Dalam daftar pemeriksaan","♙")}${stat("Hasil tersedia","8","Siap ditinjau","✓")}${stat("Menunggu hasil","4","Dalam proses lab","◷")}${stat("Order aktif",state.orders.length,"Order terdaftar","▤")}</div><div class="panel"><div class="panel-head"><h3>Hasil pemeriksaan pasien</h3></div>${table(["Pasien","Pemeriksaan","Tanggal","Hasil"],state.exams.map(e=>`<tr><td>${e.patient}</td><td>${e.test}</td><td>${e.date}</td><td>${statusPill(e.result)}</td></tr>`).join(""))}</div>`}
function ordersPage(){return `<div class="welcome"><div><h2>Daftar order pemeriksaan</h2><p>Kelola permintaan pemeriksaan dan pantau statusnya.</p></div><button class="btn" onclick="newOrder()">+ Order baru</button></div><div class="panel"><div class="toolbar"><input class="search" placeholder="Cari pasien / ID order..." oninput="filterRows(this,'ordersTable')"></div><div id="ordersTable">${table(["ID Order","Pasien","Pemeriksaan","Tanggal","Status","Aksi"],state.orders.map((o,i)=>`<tr><td>${o.id}</td><td>${o.patient}</td><td>${o.test}</td><td>${o.date}</td><td>${statusPill(o.status)}</td><td><button class="btn secondary" onclick="advanceOrder(${i})">Ubah status</button></td></tr>`).join(""))}</div></div>`}
function patientsPage(){return `<div class="welcome"><div><h2>Data pasien</h2><p>Data identitas pasien yang terdaftar.</p></div><button class="btn" onclick="addPatient()">+ Pasien baru</button></div><div class="panel">${table(["ID Pasien","Nama","Umur","Jenis kelamin","No. telepon"],state.patients.map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.age} tahun</td><td>${p.gender}</td><td>${p.phone}</td></tr>`).join(""))}</div>`}
function examsPage(){return `<div class="welcome"><div><h2>Pemeriksaan laboratorium</h2><p>Catat pemeriksaan dan hasil yang telah diverifikasi.</p></div><button class="btn" onclick="addExam()">+ Catat pemeriksaan</button></div><div class="panel">${table(["ID","Pasien","Jenis pemeriksaan","Dokter","Tanggal","Hasil"],state.exams.map(e=>`<tr><td>${e.id}</td><td>${e.patient}</td><td>${e.test}</td><td>${e.doctor}</td><td>${e.date}</td><td>${statusPill(e.result)}</td></tr>`).join(""))}</div>`}
function inventoryPage(){return `<div class="welcome"><div><h2>Inventaris laboratorium</h2><p>Pantau stok reagen, bahan habis pakai, dan alat.</p></div><button class="btn" onclick="addStock()">+ Tambah item</button></div><div class="panel">${table(["Nama item","Kategori","Jumlah","Batas minimum","Status","Aksi"],state.stock.map((s,i)=>`<tr><td>${s.name}</td><td>${s.type}</td><td>${s.qty} ${s.unit}</td><td>${s.min} ${s.unit}</td><td>${s.qty<=s.min?'<span class="pill red">Stok rendah</span>':'<span class="pill green">Aman</span>'}</td><td><button class="btn secondary" onclick="restock(${i})">Tambah stok</button></td></tr>`).join(""))}</div>`}
function qualityPage(){return `<div class="welcome"><div><h2>Quality Control (QC)</h2><p>Dokumentasikan kontrol mutu dan evaluasi hasilnya.</p></div><button class="btn" onclick="addQC()">+ Catat QC</button></div><div class="notice info">QC wajib dilakukan sesuai SOP, jadwal, dan petunjuk produsen alat/reagen. Hasil demo ini bukan bukti kelayakan klinis.</div><div class="panel">${table(["Tanggal","Bahan kontrol / parameter","Hasil QC","Petugas"],state.qc.map(q=>`<tr><td>${q.date}</td><td>${q.item}</td><td>${statusPill(q.result)}</td><td>${q.operator}</td></tr>`).join(""))}</div>`}
function integrationPage(){return `<div class="welcome"><div><h2>Integrasi alat laboratorium</h2><p>Contoh rancangan koneksi alat pemeriksaan dengan komputer.</p></div></div><div class="grid-2"><div class="panel"><h3>Status koneksi perangkat</h3><div class="device-box"><div class="device-icon">🧪 ⇄ 💻</div><h3 id="deviceStatus">Belum terhubung</h3><p class="muted">Simulasi koneksi alat melalui USB / Serial / LAN.</p><button class="btn" onclick="connectDevice()">Hubungkan perangkat</button><button class="btn secondary" onclick="disconnectDevice()">Putuskan</button></div></div><div class="panel"><h3>Alur integrasi yang disarankan</h3><ol class="muted" style="line-height:2"><li>Alat menghasilkan data pemeriksaan.</li><li>Komputer menerima data melalui protokol vendor (mis. HL7/ASTM atau API).</li><li>Middleware memvalidasi ID sampel dan format.</li><li>Hasil masuk ke sistem untuk diverifikasi petugas.</li><li>Hasil tervalidasi diteruskan ke dokter/pasien.</li></ol></div></div><div class="notice">Catatan: tombol koneksi hanya simulasi antarmuka. Koneksi perangkat nyata memerlukan model alat, driver, protokol komunikasi, dokumentasi vendor, dan pengujian keamanan.</div>`}
function patientPortal(){return `<div class="patient-banner"><h2>Halo, Andi Saputra 👋</h2><p>Selamat datang di portal pasien LabCare. Pantau order dan hasil pemeriksaan Anda.</p></div><div class="stats">${stat("Order aktif","1","Sedang diproses","▤")}${stat("Hasil tersedia","2","Dapat dilihat","✓")}${stat("Kunjungan","3","Riwayat terdaftar","♙")}${stat("Notifikasi","1","Pembaruan terbaru","♧")}</div><div class="panel"><div class="panel-head"><h3>Status order saya</h3></div>${table(["ID Order","Pemeriksaan","Tanggal","Status"],`<tr><td>ORD-1024</td><td>Darah lengkap</td><td>02 Nov 2026</td><td>${statusPill("Diproses")}</td></tr>`)}</div><div class="panel"><div class="panel-head"><h3>Hasil pemeriksaan</h3><span class="muted">Contoh data</span></div>${table(["Tanggal","Pemeriksaan","Ringkasan hasil","Dokter"],`<tr><td>01 Nov 2026</td><td>Glukosa darah</td><td>${statusPill("Normal")}</td><td>dr. Maya</td></tr><tr><td>29 Okt 2026</td><td>Kolesterol</td><td>${statusPill("Tinggi")}</td><td>dr. Arif</td></tr>`)}</div><div class="notice info">Hasil pada portal ini adalah data contoh. Konsultasikan interpretasi hasil kepada dokter.</div>`}
function myOrdersPage(){return `<div class="welcome"><div><h2>Order pemeriksaan saya</h2><p>Pantau proses pemeriksaan yang terdaftar pada akun Anda.</p></div></div><div class="panel">${table(["ID Order","Pemeriksaan","Tanggal","Status"],`<tr><td>ORD-1024</td><td>Darah lengkap</td><td>02 Nov 2026</td><td>${statusPill("Diproses")}</td></tr><tr><td>ORD-1018</td><td>Glukosa darah</td><td>29 Okt 2026</td><td>${statusPill("Selesai")}</td></tr>`)}</div>`}
function myResultsPage(){return `<div class="welcome"><div><h2>Hasil pemeriksaan saya</h2><p>Hasil yang sudah diterbitkan oleh laboratorium.</p></div></div><div class="panel">${table(["Tanggal","Pemeriksaan","Ringkasan","Dokter"],`<tr><td>29 Okt 2026</td><td>Glukosa darah</td><td>${statusPill("Normal")}</td><td>dr. Maya</td></tr><tr><td>25 Okt 2026</td><td>Kolesterol</td><td>${statusPill("Tinggi")}</td><td>dr. Arif</td></tr>`)}</div><div class="notice info">Hasil ditampilkan sebagai ringkasan contoh. Hubungi dokter untuk interpretasi medis.</div>`}
function profilePage(kind){const patient=kind==="patient";return `<div class="welcome"><div><h2>${patient?"Profil Saya":"Profil Dokter"}</h2><p>Informasi akun ${patient?"pasien":"dokter"}.</p></div></div><div class="panel"><div class="form-grid"><div class="field"><label>Nama</label><input value="${patient?"Andi Saputra":"dr. Maya Putri"}" readonly></div><div class="field"><label>Peran</label><input value="${patient?"Pasien":"Dokter"}" readonly></div><div class="field"><label>${patient?"ID Pasien":"Nomor STR"}</label><input value="${patient?"P-001":"Contoh - belum diisi"}" readonly></div><div class="field"><label>Email</label><input value="${patient?"andi@email.test":"maya@klinik.test"}" readonly></div></div><div class="notice info">Data profil ini hanya contoh untuk demonstrasi.</div></div>`}
function doctorPatientsPage(){return `<div class="welcome"><div><h2>Daftar pasien</h2><p>Pasien yang terdaftar untuk pemeriksaan laboratorium.</p></div></div><div class="panel">${table(["ID Pasien","Nama","Umur","Jenis kelamin","Kontak"],state.patients.map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.age} tahun</td><td>${p.gender}</td><td>${p.phone}</td></tr>`).join(""))}</div>`}
function doctorOrdersPage(){return `<div class="welcome"><div><h2>Order pemeriksaan pasien</h2><p>Tinjau permintaan pemeriksaan dari pasien.</p></div></div><div class="panel">${table(["ID Order","Pasien","Pemeriksaan","Tanggal","Status"],state.orders.map(o=>`<tr><td>${o.id}</td><td>${o.patient}</td><td>${o.test}</td><td>${o.date}</td><td>${statusPill(o.status)}</td></tr>`).join(""))}</div>`}
function doctorResultsPage(){return `<div class="welcome"><div><h2>Hasil pemeriksaan pasien</h2><p>Tinjau hasil pemeriksaan yang tersedia.</p></div></div><div class="panel">${table(["ID","Pasien","Pemeriksaan","Tanggal","Hasil"],state.exams.map(e=>`<tr><td>${e.id}</td><td>${e.patient}</td><td>${e.test}</td><td>${e.date}</td><td>${statusPill(e.result)}</td></tr>`).join(""))}</div>`}
function render(){renderNavigation();$("#pageTitle").textContent=titles[state.page]||"Beranda";document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===state.page));const pages={dashboard,orders:ordersPage,patients:patientsPage,examinations:examsPage,inventory:inventoryPage,quality:qualityPage,integration:integrationPage,"patient-portal":patientPortal,"my-orders":myOrdersPage,"my-results":myResultsPage,"patient-profile":()=>profilePage("patient"),"doctor-patients":doctorPatientsPage,"doctor-orders":doctorOrdersPage,"doctor-results":doctorResultsPage,"doctor-profile":()=>profilePage("doctor")};$("#pageContent").innerHTML=(pages[state.page]||dashboard)();}
function go(page){state.page=page;render();$("#sidebar").classList.remove("open")}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
$("#roleSelect").addEventListener("change",e=>{state.role=e.target.value;state.page=state.role==="patient"?"patient-portal":"dashboard";render();toast("Tampilan "+e.target.options[e.target.selectedIndex].text+" aktif")});
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#today").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
function newOrder(){const name=prompt("Nama pasien:");if(!name)return;const test=prompt("Jenis pemeriksaan:","Darah lengkap");if(!test)return;state.orders.unshift({id:"ORD-"+(1025+state.orders.length),patient:name,test,date:new Date().toLocaleDateString("id-ID"),status:"Menunggu"});render();toast("Order berhasil ditambahkan (demo)")}
function advanceOrder(i){const steps=["Menunggu","Diproses","Selesai"];state.orders[i].status=steps[(steps.indexOf(state.orders[i].status)+1)%3];render();toast("Status order diperbarui")}
function addPatient(){const name=prompt("Nama pasien:");if(!name)return;const age=Number(prompt("Umur pasien:","25"));const phone=prompt("Nomor telepon:","");state.patients.push({id:"P-"+String(state.patients.length+1).padStart(3,"0"),name,age,gender:"Belum diisi",phone:phone||"-"});render();toast("Pasien ditambahkan (demo)")}
function addExam(){const patient=prompt("Nama pasien:");if(!patient)return;const test=prompt("Jenis pemeriksaan:");if(!test)return;state.exams.unshift({id:"EX-"+(301+state.exams.length),patient,test,doctor:"Belum ditentukan",date:new Date().toLocaleDateString("id-ID"),result:"Menunggu"});render();toast("Pemeriksaan dicatat (demo)")}
function addStock(){const name=prompt("Nama item:");if(!name)return;const qty=Number(prompt("Jumlah stok:","1"));state.stock.push({name,type:"Bahan habis pakai",qty,unit:"pcs",min:5});render();toast("Item inventaris ditambahkan")}
function restock(i){const n=Number(prompt("Jumlah tambahan:", "10"));if(n>0){state.stock[i].qty+=n;render();toast("Stok berhasil diperbarui")}}
function addQC(){const item=prompt("Nama bahan kontrol / parameter:");if(!item)return;const result=prompt("Hasil QC (Lulus / Perlu evaluasi):","Lulus");state.qc.unshift({date:new Date().toLocaleDateString("id-ID"),item,result:result==="Lulus"?"Lulus":"Perlu evaluasi",operator:"Petugas"});render();toast("Catatan QC ditambahkan")}
function connectDevice(){$("#deviceStatus").textContent="Terhubung (simulasi)";toast("Koneksi simulasi aktif — belum terhubung ke alat nyata")}
function disconnectDevice(){$("#deviceStatus").textContent="Belum terhubung";toast("Koneksi simulasi diputus")}
function filterRows(input,id){const q=input.value.toLowerCase();document.querySelectorAll(`#${id} tbody tr`).forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?"":"none")}
render();


function setViewMode(mode){
 const mobile=mode==="mobile";
 document.body.classList.toggle("mobile-preview",mobile);
 const webBtn=$("#webViewBtn"),mobileBtn=$("#mobileViewBtn");
 if(webBtn){webBtn.classList.toggle("active",!mobile);webBtn.setAttribute("aria-pressed",String(!mobile))}
 if(mobileBtn){mobileBtn.classList.toggle("active",mobile);mobileBtn.setAttribute("aria-pressed",String(mobile))}
}
$("#webViewBtn")?.addEventListener("click",()=>setViewMode("web"));
$("#mobileViewBtn")?.addEventListener("click",()=>setViewMode("mobile"));

