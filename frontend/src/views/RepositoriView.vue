<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- HEADER REPOSITORI -->
    <div class="p-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[3rem] text-white shadow-2xl shadow-amber-200 relative overflow-hidden group">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span class="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-6 inline-block">Ecosistema ADSUM</span>
          <h2 class="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">Repositori d'Apunts</h2>
          <p class="text-amber-100 text-sm font-medium italic opacity-90 max-w-md">Accedeix i comparteix materials pedagògics organitzats per mòduls.</p>
        </div>
        <button @click="showUploadModal = true" class="px-8 py-4 bg-white text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-900/10 hover:scale-105 transition-all flex items-center gap-2 active:scale-95">
           <AppIcon name="upload" class="w-5 h-5" />
           Pujar Material
        </button>
      </div>
      <div class="absolute -top-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
    </div>

    <!-- MODAL PUJAR MATERIAL -->
    <div v-if="showUploadModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in" @click.self="showUploadModal = false">
      <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 relative">
        <button @click="showUploadModal = false" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-xl transition-all">
          <AppIcon name="x" class="w-5 h-5" />
        </button>
        <h3 class="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Pujar Material</h3>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Comparteix apunts, exercicis i recursos amb el grup</p>
        
        <form @submit.prevent="handleUpload" class="space-y-5">
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Títol del Material</label>
            <input v-model="uploadForm.titol" required type="text" placeholder="Ex: Apunts UF2 - Programació OOP" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5" />
          </div>
          
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fitxer (PDF, DOC, PPT, ZIP...)</label>
            <div class="relative group cursor-pointer">
              <input type="file" @change="handleFileSelect" class="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.png,.jpg" />
              <div class="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 group-hover:border-amber-300 group-hover:bg-amber-50/30 transition-all">
                <AppIcon name="upload" class="w-8 h-8 text-slate-300 group-hover:text-amber-500 transition-colors" />
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ uploadForm.fileName || 'Clica per seleccionar fitxer' }}</span>
                <span v-if="uploadForm.fileName" class="text-[9px] text-emerald-600 font-bold">✓ Fitxer seleccionat</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button type="button" @click="showUploadModal = false" class="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              Cancel·lar
            </button>
            <button type="submit" :disabled="isUploading || !uploadForm.file" class="flex-1 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50 disabled:grayscale">
              {{ isUploading ? 'Pujant...' : 'Publicar Material' }}
            </button>
          </div>
        </form>

        <div v-if="uploadSuccess" class="mt-4 p-4 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl text-center border border-emerald-100">
          ✓ Material publicat correctament!
        </div>
        <div v-if="uploadError" class="mt-4 p-4 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-xl text-center border border-rose-100">
          {{ uploadError }}
        </div>
      </div>
    </div>

    <!-- FILTRES I CERCA -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
       <div class="md:col-span-3 relative">
          <AppIcon name="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input v-model="searchQuery" type="text" placeholder="Cerca apunts, exàmens, exercicis..." class="w-full pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all shadow-xl shadow-slate-200/40">
       </div>
       <select v-model="filterModul" class="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-[10px] font-black uppercase tracking-widest focus:outline-none shadow-xl shadow-slate-200/40 cursor-pointer">
          <option value="">Tots els Mòduls</option>
          <option v-for="m in uniqueModuls" :key="m" :value="m">{{ m }}</option>
       </select>
    </div>

    <!-- GRID DE MATERIALS -->
    <div v-if="loading" class="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
       Carregant recursos...
    </div>
    <div v-else-if="error" class="text-center py-20 text-red-400 font-bold uppercase tracking-widest">
       {{ error }}
    </div>
    <div v-else-if="filteredFitxers.length === 0" class="py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
      <AppIcon name="book" class="w-12 h-12 text-slate-200 mx-auto mb-4" />
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hi ha recursos disponibles</p>
      <p class="text-[9px] text-slate-400 mt-2">Sigues el primer en pujar material!</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div v-for="fitxer in filteredFitxers" :key="fitxer.id" class="targeta-campus group hover:border-amber-200 transition-all cursor-pointer">
          <div class="flex justify-between items-start mb-6">
             <div :class="fitxer.color || 'bg-blue-500'" class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <AppIcon :name="fitxer.icona || 'file'" class="w-7 h-7" />
             </div>
             <div class="flex gap-1">
                <button @click.stop="descarregarFitxer(fitxer.id)" class="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 transition-colors" title="Descarregar">
                   <AppIcon name="download" class="w-4 h-4" />
                </button>
             </div>
          </div>
          <h4 class="text-sm font-black text-slate-900 uppercase italic mb-1 group-hover:text-amber-700 transition-colors">{{ fitxer.titol }}</h4>
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{{ fitxer.modul?.codi }} · {{ fitxer.autor?.nom }} {{ fitxer.autor?.cognoms }}</p>
          
          <div class="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
             <span class="text-[9px] font-black text-slate-400 uppercase">{{ new Date(fitxer.dataPujada).toLocaleDateString() }}</span>
             <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest">{{ fitxer.mida }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: { type: Object, required: true }
});

const fitxers = ref([]);
const loading = ref(true);
const error = ref(null);
const showUploadModal = ref(false);
const searchQuery = ref('');
const filterModul = ref('');
const isUploading = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref('');

const uploadForm = ref({
  titol: '',
  file: null,
  fileName: ''
});

const uniqueModuls = computed(() => {
  const codis = fitxers.value.map(f => f.modul?.codi).filter(Boolean);
  return [...new Set(codis)];
});

const filteredFitxers = computed(() => {
  let result = fitxers.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(f => f.titol?.toLowerCase().includes(q) || f.modul?.codi?.toLowerCase().includes(q));
  }
  if (filterModul.value) {
    result = result.filter(f => f.modul?.codi === filterModul.value);
  }
  return result;
});

onMounted(async () => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/recursos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al carregar els recursos');
    fitxers.value = await res.json();
  } catch (err) {
    console.error('Error carregant repositori:', err);
    error.value = 'No s\'ha pogut carregar el repositori.';
  } finally {
    loading.value = false;
  }
});

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadForm.value.file = file;
    uploadForm.value.fileName = file.name;
    if (!uploadForm.value.titol) {
      uploadForm.value.titol = file.name.replace(/\.[^/.]+$/, '');
    }
  }
};

const handleUpload = async () => {
  if (!uploadForm.value.file) return;
  isUploading.value = true;
  uploadError.value = '';
  uploadSuccess.value = false;

  try {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', uploadForm.value.file);
    formData.append('titol', uploadForm.value.titol);

    const res = await fetch(`${API_BASE_URL}/recursos/pujar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      const nou = await res.json();
      fitxers.value.unshift(nou);
      uploadSuccess.value = true;
      setTimeout(() => {
        showUploadModal.value = false;
        uploadSuccess.value = false;
        uploadForm.value = { titol: '', file: null, fileName: '' };
      }, 1500);
    } else {
      const err = await res.json();
      uploadError.value = err.message || 'Error en pujar el fitxer';
    }
  } catch (err) {
    console.error('Error pujant fitxer:', err);
    uploadError.value = 'Error de connexió. Torna-ho a provar.';
  } finally {
    isUploading.value = false;
  }
};

const descarregarFitxer = (id) => {
  const token = localStorage.getItem('access_token');
  const link = document.createElement('a');
  link.href = `${API_BASE_URL}/recursos/descarregar/${id}?token=${token}`;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
