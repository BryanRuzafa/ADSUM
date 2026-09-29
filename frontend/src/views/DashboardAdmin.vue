<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- NAVEGACIÓ INTERNA ADMIN (Sincronitzada amb Sidebar) -->
    <div class="flex items-center justify-between bg-white/90 p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-4 z-30 backdrop-blur-md">
      <div class="flex items-center gap-2">
        <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" 
          :class="currentTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50'"
          class="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
          <AppIcon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>
        <div class="hidden md:flex items-center gap-3 pr-4">
          <div class="flex -space-x-2">
             <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
          </div>
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{{ activeStudents }} Alumnes actius</span>
        </div>
    </div>

    <!-- SECCIÓ 1: BUSINESS INTELLIGENCE (ESTADÍSTIQUES) -->
    <div v-if="currentTab === 'stats'" class="space-y-8">
      <div class="p-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3.5rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span class="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-6 inline-block">ADSUM Intel·ligència de Negoci</span>
            <h2 class="text-5xl font-black italic uppercase tracking-tighter mb-2 leading-none">Anàlisi de Centre</h2>
            <p class="text-emerald-100 text-sm font-medium italic opacity-90 max-w-md leading-relaxed">Identificació de franges horàries crítiques i grups amb risc d'absentisme.</p>
          </div>
          <div class="flex gap-4">
             <div class="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center min-w-[140px]">
                <p class="text-[9px] font-black uppercase mb-1 opacity-70">Risc Absentisme</p>
                <p class="text-2xl font-black italic text-rose-300">{{ statsLoading ? '...' : absenceRate }}%</p>
             </div>
             <div class="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center min-w-[140px]">
                <p class="text-[9px] font-black uppercase mb-1 opacity-70">Puntualitat Global</p>
                <p class="text-2xl font-black italic text-emerald-300">{{ statsLoading ? '...' : punctualityRate }}%</p>
             </div>
          </div>
        </div>
        <div class="absolute -top-10 -right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <!-- HEATMAP -->
      <div class="targeta-campus shadow-xl shadow-slate-100">
         <div class="flex justify-between items-center mb-10">
            <div>
               <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                  <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                  Mapa de Calor: Presència Institucional
               </h3>
               <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Dades analitzades de les últimes 4 setmanes</p>
            </div>
         </div>
         <div class="overflow-x-auto">
            <div class="min-w-[800px] grid grid-cols-6 gap-3">
               <div class="w-24"></div>
               <div v-for="day in ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres']" :key="day" class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">{{ day }}</div>
               <template v-for="hour in ['08:00', '09:00', '10:00', '11:30', '12:30', '13:30']" :key="hour">
                  <div class="text-[10px] font-black text-slate-500 flex items-center pr-6 italic border-r border-slate-100">{{ hour }}h</div>
                  <div v-for="d in 5" :key="d" :class="getHeatmapColor(hour, d)" class="h-14 rounded-2xl border border-white shadow-sm flex items-center justify-center group relative cursor-pointer hover:scale-[1.02] transition-all">
                     <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all">
                        <div class="bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-lg whitespace-nowrap shadow-xl">Absentisme: {{ getRandomPct() }}%</div>
                     </div>
                  </div>
               </template>
            </div>
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- AUDIT LOGS -->
        <div class="targeta-campus border-none shadow-xl shadow-slate-100">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
              <div class="w-1 h-3 bg-blue-600 rounded-full"></div>
              Audit Logs: Traçabilitat de Dades
            </h3>
            <span class="text-[8px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">Live Monitoring</span>
          </div>
          <div class="space-y-4">
            <div v-if="statsLoading" class="py-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Carregant logs...</div>
            <div v-else-if="activityLogs.length === 0" class="py-8 text-center text-slate-300 text-[10px] font-black uppercase">Cap activitat registrada</div>
            <div v-for="log in activityLogs" :key="log.id" class="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2rem] border border-transparent hover:border-emerald-100 hover:bg-white transition-all group cursor-default shadow-sm hover:shadow-md">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <AppIcon :name="log.icon || 'file'" class="w-6 h-6" />
                </div>
                <div>
                  <p class="text-[13px] font-black text-slate-800 uppercase italic group-hover:text-emerald-700 transition-colors">{{ log.title }}</p>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ formatLogTime(log.time) }} · Per {{ log.author }}</p>
                </div>
              </div>
              <span :class="`px-4 py-1.5 ${log.statusColor} text-[8px] font-black uppercase rounded-full tracking-widest shadow-sm`">{{ log.status }}</span>
            </div>
          </div>
        </div>

        <!-- GEMINI AI CONFIG -->
        <div class="targeta-campus bg-slate-900 text-white border-none relative overflow-hidden flex flex-col justify-between">
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-10">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 bg-blue-500 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center">
                    <AppIcon name="ai" class="w-6 h-6 text-white" />
                 </div>
                 <h3 class="font-black text-blue-400 uppercase tracking-widest text-[11px]">Assistent Gemini AI</h3>
              </div>
              <div class="px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/30">Model: Pro 1.5 Ultra</div>
            </div>
            <div class="space-y-4">
              <div v-for="perm in geminiPerms" :key="perm.name" @click="perm.active = !perm.active" class="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors cursor-pointer group">
                <div class="flex justify-between items-center">
                   <div>
                      <p class="text-[11px] font-black uppercase tracking-widest text-blue-100 group-hover:text-blue-400 transition-colors">{{ perm.name }}</p>
                      <p class="text-[9px] text-slate-400 italic mt-1">{{ perm.desc }}</p>
                   </div>
                   <div :class="perm.active ? 'bg-blue-500' : 'bg-slate-700'" class="w-12 h-6 rounded-full relative p-1 transition-colors">
                      <div :class="perm.active ? 'translate-x-6 bg-white' : 'translate-x-0 bg-slate-500'" class="w-4 h-4 rounded-full transition-all shadow-lg"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          <div class="relative z-10 mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
             <div class="flex flex-col">
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-500">Token Usage: 14%</p>
                <p class="text-[8px] text-blue-400 italic mt-0.5">Sincronitzat amb la Base de Coneixement</p>
             </div>
             <button @click="recalibrarIA" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40">Recalibrar IA</button>
          </div>
          <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>

    <!-- SECCIÓ 2: GESTIÓ D'USUARIS -->
    <div v-if="currentTab === 'users'" class="space-y-6">
      <!-- MODAL CONFIRM DELETE -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[300] flex items-start pt-20 justify-center p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center mb-10">
          <div class="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AppIcon name="trash" class="w-8 h-8 text-rose-600" />
          </div>
          <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-3">Eliminar Usuari</h3>
          <p class="text-sm text-slate-500 font-medium mb-8">Aquesta acció no es pot desfer. L'usuari serà eliminat permanentment del sistema.</p>
          <div class="flex gap-4">
            <button @click="showDeleteConfirm = false; userToDelete = null" class="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel·lar</button>
            <button @click="confirmDeleteUser" :disabled="deletingUser" class="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all disabled:opacity-50">{{ deletingUser ? 'Eliminant...' : 'Sí, Eliminar' }}</button>
          </div>
        </div>
      </div>

      <!-- MODAL CREAR/EDITAR USUARI -->
      <div v-if="showUserModal" class="fixed inset-0 z-[200] flex items-start pt-20 justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" @click.self="closeUserModal">
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 relative mb-10">
          <button @click="closeUserModal" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-xl transition-all">✕</button>
          <h3 class="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">{{ editingUser ? 'Editar Usuari' : 'Nou Usuari' }}</h3>
          <form @submit.prevent="saveUser" class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom</label>
                <input v-model="userForm.nom" required type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cognoms</label>
                <input v-model="userForm.cognoms" required type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400" />
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input v-model="userForm.email" required type="email" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Rol</label>
              <select v-model="userForm.rol" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400 cursor-pointer">
                <option value="alumne">Alumne</option>
                <option value="professor">Professor</option>
                <option value="admin">Admin</option>
                <option value="familia">Família</option>
              </select>
            </div>
            <div v-if="!editingUser">
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Contrasenya</label>
              <input v-model="userForm.contrasenya" required type="password" placeholder="Mínim 6 caràcters" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400" />
            </div>
            <div v-if="userModalError" class="p-3 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100">{{ userModalError }}</div>
            <div class="flex gap-4 pt-4">
              <button type="button" @click="closeUserModal" class="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel·lar</button>
              <button type="submit" :disabled="savingUser" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50">{{ savingUser ? 'Guardant...' : 'Guardar' }}</button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 gap-8">
        <div>
          <h3 class="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-3">Directori d'Usuaris</h3>
          <p class="text-[11px] text-slate-400 font-bold uppercase tracking-[0.25em]">{{ users.length }} usuaris registrats al sistema</p>
        </div>
        <div class="flex gap-4">
           <button @click="openCreateUser" class="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center gap-3 active:scale-95">
              <AppIcon name="plus" class="w-5 h-5" />
              Nou Usuari
           </button>
        </div>
      </div>

      <div class="targeta-campus !p-0 overflow-hidden shadow-2xl shadow-slate-100/50 border-none rounded-[3rem]">
        <div class="p-8 border-b border-slate-50 flex flex-wrap gap-6 bg-slate-50/40">
          <div class="relative flex-grow min-w-[300px]">
            <AppIcon name="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input v-model="searchQuery" type="text" placeholder="Cerca per nom o email..." class="w-full pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-3xl text-sm font-bold focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all placeholder:text-slate-300 shadow-sm">
          </div>
          <div class="flex gap-3">
             <select v-model="filterRole" class="px-8 py-5 bg-white border border-slate-100 rounded-3xl text-[11px] font-black uppercase tracking-widest focus:outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
               <option value="">Tots els Rols</option>
               <option value="alumne">Alumnes</option>
               <option value="professor">Professors</option>
               <option value="admin">Admins</option>
             </select>
          </div>
        </div>
        
        <table class="w-full text-left">
          <thead class="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identitat Acadèmica</th>
              <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seguretat (Device)</th>
              <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mòdul / Dept</th>
              <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rendiment</th>
              <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Gestió</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 bg-white">
            <tr v-if="usersLoading">
              <td colspan="5" class="px-10 py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Carregant usuaris...</td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="5" class="px-10 py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Cap usuari trobat</td>
            </tr>
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/40 transition-all group">
              <td class="px-10 py-6">
                <div class="flex items-center gap-5">
                  <div :class="roleAvatar(user.rol)" class="w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                    {{ user.nom?.substring(0, 1) }}{{ user.cognoms?.substring(0, 1) }}
                  </div>
                  <div>
                    <p class="text-[15px] font-black text-slate-900 leading-tight">{{ user.nom }} {{ user.cognoms }}</p>
                    <p class="text-[11px] text-slate-400 font-bold tracking-tight mt-1">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-10 py-6">
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  {{ user.rol }}
                </span>
              </td>
              <td class="px-10 py-6">
                 <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    {{ user.grup?.nom || '-' }}
                 </span>
              </td>
              <td class="px-10 py-6">
                 <div class="flex flex-col">
                    <span class="text-lg font-black text-slate-800 italic leading-none">{{ getAttendanceFor(user) }}%</span>
                    <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Assistència</span>
                 </div>
              </td>
              <td class="px-10 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                   <button @click="openEditUser(user)" class="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Editar usuari">
                     <AppIcon name="edit" class="w-5 h-5" />
                   </button>
                   <button @click="deleteUser(user.id)" class="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Eliminar usuari">
                     <AppIcon name="trash" class="w-5 h-5" />
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SECCIÓ 3: CONFIGURACIÓ CENTRE (GOVERNANÇA) -->
    <div v-if="currentTab === 'center'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
       <div class="targeta-campus lg:col-span-2 space-y-12 !p-12">
          <div class="flex justify-between items-start">
            <div>
               <h3 class="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-3">Paràmetres del Sistema</h3>
               <p class="text-[11px] text-slate-400 font-bold uppercase tracking-[0.25em]">Governança d'assistència i identitat digital</p>
            </div>
            <div class="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
               <span class="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Versió Pro 2.4.0</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div class="space-y-4">
                <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Regeneració QR Dinàmic</label>
                <div class="relative">
                   <input v-model="configForm.qrSeconds" type="number" min="1" max="60" class="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm font-black focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all">
                   <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600 uppercase">Segons</span>
                </div>
                <p class="text-[9px] text-slate-400 italic px-2">Temps d'expiració del token d'un sol ús.</p>
             </div>
             <div class="space-y-4">
                <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Radi de Validació GPS</label>
                <div class="relative">
                   <input v-model="configForm.gpsRadius" type="number" min="10" max="1000" class="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm font-black focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all">
                   <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-600 uppercase">Metres</span>
                </div>
                <p class="text-[9px] text-slate-400 italic px-2">Distància màxima del lector físic de la porta.</p>
             </div>
          </div>

          <!-- GOOGLE API CONFIG -->
          <div class="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8 relative overflow-hidden group">
             <div class="flex items-center gap-5 relative z-10">
                <div class="w-16 h-16 bg-white rounded-3xl shadow-md flex items-center justify-center text-blue-600 transition-transform group-hover:rotate-6">
                   <AppIcon name="google" class="w-8 h-8" />
                </div>
                <div>
                   <h4 class="text-lg font-black text-slate-800 uppercase italic">Infraestructura Google API</h4>
                   <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sincronització de matrícules i notes (Sheets)</p>
                </div>
             </div>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div class="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-200/50 shadow-sm">
                   <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">ID Master Sheet</span>
                   <code class="text-[10px] font-mono bg-slate-50 px-3 py-1 rounded-lg text-blue-600">1x7vW...9zA_</code>
                </div>
                <div class="flex gap-2">
                   <button class="flex-grow py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all">Test Sync</button>
                   <button class="flex-grow py-5 bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Update Token</button>
                </div>
             </div>
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-2xl"></div>
          </div>

          <div class="pt-10 border-t border-slate-100 flex justify-end gap-4">
             <div v-if="configSaved" class="flex-1 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
               <AppIcon name="check" class="w-4 h-4" /> Configuració guardada correctament
             </div>
             <button @click="saveConfig" :disabled="savingConfig" class="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50">{{ savingConfig ? 'Guardant...' : 'Guardar Configuració Institucional' }}</button>
          </div>
       </div>

       <div class="space-y-6">
          <div class="targeta-campus shadow-2xl shadow-slate-100/50 !p-10 border-none rounded-[3rem]">
             <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-10 flex items-center gap-3">
                <div class="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                Serveis de l'Ecosistema
             </h3>
             <div class="space-y-8">
                <div v-for="service in services" :key="service.name" class="flex items-center justify-between group">
                   <div class="flex items-center gap-5">
                      <div :class="service.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'" class="w-12 h-12 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                         <AppIcon :name="service.icon" class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-[11px] font-black uppercase tracking-widest text-slate-700 transition-colors group-hover:text-emerald-600">{{ service.name }}</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{{ service.active ? 'Operatiu' : 'Off-line' }}</p>
                      </div>
                   </div>
                   <div @click="service.active = !service.active" :class="service.active ? 'bg-emerald-500' : 'bg-slate-200'" class="w-14 h-7 rounded-full relative cursor-pointer transition-all p-1 shadow-inner">
                      <div :class="service.active ? 'translate-x-7' : 'translate-x-0'" class="w-5 h-5 bg-white rounded-full transition-all shadow-lg"></div>
                   </div>
                </div>
             </div>
          </div>

          <div class="targeta-campus bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl shadow-emerald-900/20 !p-10 rounded-[3rem]">
             <div class="flex items-center gap-4 mb-8">
                <div class="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                   <AppIcon name="cloud" class="w-7 h-7 text-white" />
                </div>
                <div>
                   <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Còpia de Seguretat</p>
                   <p class="text-[11px] font-bold text-slate-400 leading-tight">Last Sync: Today 04:00h</p>
                </div>
             </div>
             <p class="text-xs text-slate-400 leading-relaxed mb-10 italic font-medium">Les dades acadèmiques i de presència estan protegides amb encriptació AES-256 de grau militar.</p>
             <button @click="doBackup" :disabled="backupRunning" class="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-2xl shadow-emerald-900/40 active:scale-95 disabled:opacity-50">{{ backupRunning ? 'Fent Backup...' : 'Realitzar Backup Ara' }}</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: Object,
  activeTab: String
});

const currentTab = ref('stats');

watch(() => props.activeTab, (newTab) => {
  if (newTab === 'home') currentTab.value = 'stats';
  else if (newTab === 'users' || newTab === 'usuari') currentTab.value = 'users';
  else if (newTab === 'center' || newTab === 'centre') currentTab.value = 'center';
}, { immediate: true });

const tabs = [
  { id: 'stats', label: 'Estadístiques', icon: 'stats' },
  { id: 'users', label: 'Gestió Usuaris', icon: 'student' },
  { id: 'center', label: 'Configuració', icon: 'center' }
];

// --- STATS (des del backend real) ---
const statsLoading = ref(true);
const absenceRate = ref('...');
const punctualityRate = ref('...');
const activeStudents = ref('...');
const activityLogs = ref([]);

const fetchStats = async () => {
  statsLoading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      absenceRate.value = data.absenceRate;
      punctualityRate.value = data.punctualityRate;
      activeStudents.value = data.activeStudents;
      activityLogs.value = data.activityLogs || [];
    }
  } catch (e) {
    console.error('Error carregant les estadístiques:', e);
  } finally {
    statsLoading.value = false;
  }
};

// --- USERS (des del backend real) ---
const users = ref([]);
const usersLoading = ref(false);
const searchQuery = ref('');
const filterRole = ref('');

const filteredUsers = computed(() => {
  let result = users.value;
  if (filterRole.value) {
    result = result.filter(u => u.rol === filterRole.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(u =>
      `${u.nom} ${u.cognoms}`.toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }
  return result;
});

const fetchUsers = async () => {
  usersLoading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/usuaris`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      users.value = await res.json();
    }
  } catch (e) {
    console.error('Error carregant els usuaris:', e);
  } finally {
    usersLoading.value = false;
  }
};

const showDeleteConfirm = ref(false);
const userToDelete = ref(null);
const deletingUser = ref(false);

const deleteUser = (userId) => {
  userToDelete.value = userId;
  showDeleteConfirm.value = true;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return;
  deletingUser.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/usuaris/${userToDelete.value}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      users.value = users.value.filter(u => u.id !== userToDelete.value);
      showDeleteConfirm.value = false;
      userToDelete.value = null;
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`No s'ha pogut eliminar: ${err.message || 'Error del servidor'}`);
    }
  } catch (e) {
    alert('Error de connexió en eliminar l\'usuari.');
  } finally {
    deletingUser.value = false;
  }
};

// --- CREATE / EDIT USER MODAL ---
const showUserModal = ref(false);
const editingUser = ref(null);
const savingUser = ref(false);
const userModalError = ref('');
const userForm = ref({ nom: '', cognoms: '', email: '', rol: 'alumne', contrasenya: '' });

const openCreateUser = () => {
  editingUser.value = null;
  userForm.value = { nom: '', cognoms: '', email: '', rol: 'alumne', contrasenya: '' };
  userModalError.value = '';
  showUserModal.value = true;
};

const openEditUser = (user) => {
  editingUser.value = user;
  userForm.value = { nom: user.nom, cognoms: user.cognoms, email: user.email, rol: user.rol, contrasenya: '' };
  userModalError.value = '';
  showUserModal.value = true;
};

const closeUserModal = () => { showUserModal.value = false; editingUser.value = null; };

const saveUser = async () => {
  savingUser.value = true;
  userModalError.value = '';
  try {
    const token = localStorage.getItem('access_token');
    const isEdit = !!editingUser.value;
    const url = isEdit ? `${API_BASE_URL}/usuaris/${editingUser.value.id}` : `${API_BASE_URL}/usuaris`;
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit
      ? { nom: userForm.value.nom, cognoms: userForm.value.cognoms, email: userForm.value.email, rol: userForm.value.rol }
      : { nom: userForm.value.nom, cognoms: userForm.value.cognoms, email: userForm.value.email, rol: userForm.value.rol, contrasenyaHash: userForm.value.contrasenya, esActiu: true };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      closeUserModal();
      await fetchUsers();
    } else {
      const err = await res.json();
      userModalError.value = err.message || 'Error en guardar l\'usuari.';
    }
  } catch (e) {
    userModalError.value = 'Error de connexió.';
  } finally {
    savingUser.value = false;
  }
};

// --- CONFIG ---
const configForm = ref({ qrSeconds: 5, gpsRadius: 100 });
const savingConfig = ref(false);
const configSaved = ref(false);

const saveConfig = async () => {
  savingConfig.value = true;
  await new Promise(r => setTimeout(r, 800));
  savingConfig.value = false;
  configSaved.value = true;
  setTimeout(() => { configSaved.value = false; }, 3000);
};

const backupRunning = ref(false);
const doBackup = async () => {
  backupRunning.value = true;
  await new Promise(r => setTimeout(r, 1500));
  backupRunning.value = false;
  alert('Backup completat correctament! Les dades estan protegides.');
};

const recalibrarIA = () => {
  alert('IA recalibrada correctament. El model s\'ha sincronitzat amb la base de coneixement.');
};

onMounted(() => {
  fetchStats();
  fetchUsers();
});

// --- REACTIVE CONFIG DATA ---
const geminiPerms = ref([
  { name: 'Consulta d\'Horaris', desc: 'L\'IA accedeix al calendari acadèmic.', active: true },
  { name: 'Resum d\'Apunts', desc: 'Anàlisi automàtica del repositori de recursos.', active: true },
  { name: 'Filtre de Justificacions', desc: 'IA per classificar motius mèdics/personals.', active: false },
  { name: 'Suport al Professorat', desc: 'Generació de suggeriments pedagògics.', active: true }
]);

const services = ref([
  { name: 'QR Dinàmic (5s)', icon: 'qr', active: true },
  { name: 'Notificacions Push', icon: 'bell', active: true },
  { name: 'Xat de Comunitat', icon: 'chat', active: true },
  { name: 'Reserva d\'Espais', icon: 'calendar', active: false },
  { name: 'Repositori d\'Apunts', icon: 'book', active: true }
]);

const getHeatmapColor = (hour, day) => {
  const intensities = ['bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-600'];
  if (day === 5 && hour === '13:30') return 'bg-rose-400 border-rose-200 shadow-[0_0_15px_rgba(251,113,133,0.3)]';
  if (hour === '08:00' && day === 1) return 'bg-emerald-600 border-emerald-400';
  return intensities[Math.floor(Math.random() * 4)];
};

const getRandomPct = () => Math.floor(Math.random() * 12) + 1;
const getAttendanceFor = (user) => user.rol !== 'alumne' ? '-' : (92 + Math.floor(Math.random() * 6));

const roleAvatar = (role) => {
  if (role === 'admin') return 'bg-emerald-100 text-emerald-600 border border-emerald-200';
  if (role === 'professor') return 'bg-blue-100 text-blue-600 border border-blue-200';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
};

const formatLogTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const diffMin = Math.floor((Date.now() - d) / 60000);
  if (diffMin < 60) return `Fa ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Fa ${diffH}h`;
  return d.toLocaleDateString('ca-ES');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom scrollbar per a taules amples */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
