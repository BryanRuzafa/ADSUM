<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- HERO SECCIÓ: PARES (Estil Premium Dark) -->
    <div class="p-10 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[3rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-6">
             <span class="px-3 py-1 bg-blue-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-blue-400/20">Portal Famílies ADSUM</span>
             <span class="px-3 py-1 bg-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] border border-emerald-500/30">Connexió Activa</span>
          </div>
          <h2 class="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">Benvingut, {{ user?.nom }}</h2>
          <div class="flex items-center gap-3 mt-3">
            <p class="text-blue-200 text-sm font-medium italic opacity-85">
              Gestió centralitzada de: 
            </p>
            <select v-if="children.length > 1" v-model="selectedChild" class="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider focus:outline-none cursor-pointer">
              <option v-for="child in children" :key="child.id" :value="child" class="text-slate-800">{{ child.nom }} {{ child.cognoms }}</option>
            </select>
            <strong v-else-if="selectedChild" class="text-white border-b-2 border-emerald-400 pb-0.5 text-sm uppercase tracking-wide">{{ selectedChild.nom }} {{ selectedChild.cognoms }}</strong>
            <span v-else class="text-xs text-blue-300">Carregant informació dels alumnes...</span>
          </div>
        </div>
        <div class="flex gap-4">
           <div class="bg-white/5 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center min-w-[130px]">
              <p class="text-[9px] font-black uppercase mb-1 opacity-60">Faltes Totals</p>
              <p class="text-2xl font-black italic text-rose-400">{{ stats.faltes }}</p>
           </div>
           <div class="bg-white/5 p-5 rounded-3xl backdrop-blur-md border border-white/10 text-center min-w-[130px]">
              <p class="text-[9px] font-black uppercase mb-1 opacity-60">Assistència</p>
              <p class="text-2xl font-black italic text-emerald-400">{{ stats.assistencia }}%</p>
           </div>
        </div>
      </div>
      <div class="absolute -top-10 -right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
    </div>

    <!-- ESTAT DE CÀRREGA -->
    <div v-if="loading" class="py-20 text-center text-slate-400 text-sm font-black uppercase tracking-widest">
      Carregant informació de les famílies...
    </div>

    <!-- SENSE FILLS COMPTE -->
    <div v-else-if="!selectedChild" class="targeta-campus py-20 text-center text-slate-500">
      <AppIcon name="warning" class="w-12 h-12 mx-auto text-slate-300 mb-4" />
      <p class="font-black uppercase tracking-widest text-xs">No hi ha alumnes associats a aquest compte</p>
      <p class="text-[10px] text-slate-400 mt-2">Posa't en contacte amb la secretaria del centre per vincular el teu compte amb el dels teus fills.</p>
    </div>

    <!-- CONTINGUT DINÀMIC DEL portal -->
    <div v-else class="space-y-8">
      <!-- SECCIÓ 1: CONTROL DE PRESÈNCIA EN TEMPS REAL -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div class="targeta-campus lg:col-span-2">
            <div class="flex justify-between items-center mb-8">
               <div>
                  <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                     <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                     Seguiment de Presència (Avui)
                  </h3>
                  <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Sincronitzat amb els lectors de porta del centre</p>
               </div>
               <span class="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase">Al centre</span>
            </div>
            
            <div class="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
               <div v-for="log in attendanceTimeline" :key="log.id" class="relative pl-12 group">
                  <div :class="log.active ? 'bg-emerald-500 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-200'" class="absolute left-0 top-1 w-10 h-10 rounded-xl border-4 border-white flex items-center justify-center text-white z-10 transition-all">
                     <AppIcon :name="log.icon" class="w-4 h-4" />
                  </div>
                  <div :class="log.active ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-transparent'" class="p-4 rounded-2xl border transition-all">
                     <div class="flex justify-between items-center">
                        <p class="text-xs font-black text-slate-800 uppercase italic">{{ log.subject }}</p>
                        <span class="text-[10px] font-black text-slate-400 italic">{{ log.time }}</span>
                     </div>
                     <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{{ log.location }} · {{ log.status }}</p>
                  </div>
               </div>
            </div>
         </div>

         <!-- GESTIÓ DE FALTES I JUSTIFICACIONS -->
         <div class="space-y-6">
            <div class="targeta-campus bg-emerald-600 text-white border-none shadow-xl shadow-emerald-200 overflow-hidden relative">
               <div class="relative z-10">
                  <h3 class="text-xl font-black italic uppercase leading-tight mb-2">Tràmits de Faltes</h3>
                  <p class="text-emerald-100 text-xs font-medium italic opacity-90 mb-8">Tens {{ stats.faltes }} faltes pendents de justificació.</p>
                  
                  <div class="p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md mb-6 border-dashed text-center">
                     <AppIcon name="upload" class="w-8 h-8 text-emerald-200 mx-auto mb-3" />
                     <p class="text-[10px] font-black uppercase tracking-widest text-white">Puja el justificant</p>
                     <p class="text-[8px] text-emerald-200 mt-1 uppercase">PDF, JPG o PNG</p>
                  </div>
                  
                  <button @click="showJustifyModal = true" class="w-full py-4 bg-white text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Iniciar Justificació</button>
               </div>
               <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div class="targeta-campus border-l-8 border-blue-500">
               <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-4">Avisos del Tutor</h3>
               <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p class="text-xs font-bold text-blue-900 mb-1">Reunió Trimestral</p>
                  <p class="text-[9px] text-blue-700 italic">Dimecres 15 de maig a les 18:30h.</p>
               </div>
            </div>
         </div>
      </div>

      <!-- SECCIÓ 2: CANAL DIRECTE I COMUNITAT -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="targeta-campus">
            <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
               <div class="w-1 h-3 bg-slate-900 rounded-full"></div>
               Canal Directe: Contacte Institucional
            </h3>
            <div class="space-y-4">
               <div v-for="contact in teachers" :key="contact.email" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group">
                  <div class="flex items-center gap-4">
                     <div class="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                        {{ contact.nom?.substring(0, 1) }}{{ contact.cognom?.substring(0, 1) }}
                     </div>
                     <div>
                        <p class="text-xs font-black text-slate-800 uppercase italic">{{ contact.nom }} {{ contact.cognom }}</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{{ contact.role }}</p>
                     </div>
                  </div>
                  <button @click="openChat(contact)" class="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all">
                     <AppIcon name="chat" class="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         <div class="targeta-campus flex flex-col justify-between">
            <div>
               <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                  <div class="w-1 h-3 bg-amber-500 rounded-full"></div>
                  Propers Exàmens i Tasques
               </h3>
               <div class="space-y-4">
                  <div v-for="task in upcomingTasks" :key="task.id" class="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl">
                     <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <AppIcon name="calendar" class="w-5 h-5" />
                     </div>
                     <div class="flex-grow">
                        <p class="text-[11px] font-black text-slate-800 uppercase italic">{{ task.title }}</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{{ task.date }} · {{ task.subject }}</p>
                     </div>
                     <span class="text-[10px] font-black text-amber-600 italic">Pendent</span>
                  </div>
               </div>
            </div>
            <button class="boto-academic w-full mt-8">Veure Calendari Complet</button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: { type: Object, required: true }
});

const showJustifyModal = ref(false);
const children = ref([]);
const selectedChild = ref(null);
const loading = ref(true);

const attendanceTimeline = ref([]);
const teachers = ref([]);
const upcomingTasks = ref([]);
const stats = ref({ faltes: '...', assistencia: '...' });

const fetchChildren = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/families/fills`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      children.value = await res.json();
      if (children.value.length > 0) {
        selectedChild.value = children.value[0];
      }
    }
  } catch (e) {
    console.error('Error fetching children:', e);
  } finally {
    loading.value = false;
  }
};

const fetchChildData = async (childId) => {
  if (!childId) return;
  try {
    const token = localStorage.getItem('access_token');
    
    // Stats
    const resStats = await fetch(`${API_BASE_URL}/families/fills/${childId}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resStats.ok) stats.value = await resStats.json();

    // Timeline
    const resTimeline = await fetch(`${API_BASE_URL}/families/fills/${childId}/assistencies`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resTimeline.ok) attendanceTimeline.value = await resTimeline.json();

    // Tasks/Exams
    const resTasks = await fetch(`${API_BASE_URL}/families/fills/${childId}/tasques`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resTasks.ok) upcomingTasks.value = await resTasks.json();

    // Teachers
    const resTeachers = await fetch(`${API_BASE_URL}/families/fills/${childId}/professors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resTeachers.ok) teachers.value = await resTeachers.json();

  } catch (e) {
    console.error('Error fetching child data:', e);
  }
};

watch(selectedChild, (newChild) => {
  if (newChild) {
    fetchChildData(newChild.id);
  }
});

onMounted(() => {
  fetchChildren();
});

const openChat = (contact) => {
  alert(`Iniciant xat amb ${contact.nom}... (Pots obrir el xat complet al menú lateral)`);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
