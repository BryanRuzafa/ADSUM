<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- CAPÇALERA -->
    <div class="p-10 md:p-12 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl shadow-violet-200 relative overflow-hidden">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <span class="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-4 inline-block">Agenda Personal</span>
          <h2 class="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Agenda de Deures</h2>
          <p class="text-violet-100 text-sm font-medium max-w-lg">Organitza exercicis, projectes i entregues per mòdul. Controla prioritats, dates límit i el teu progrés.</p>
        </div>
        <button @click="obrirModalNova" class="px-8 py-4 bg-white text-violet-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2">
          <AppIcon name="plus" class="w-5 h-5" />
          Nou Deure
        </button>
      </div>
      <div class="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
    </div>

    <!-- ESTADÍSTIQUES -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="stat in statsCards" :key="stat.label" class="p-5 bg-white rounded-[1.75rem] border border-slate-100 shadow-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
        <p class="text-2xl font-black italic" :class="stat.color">{{ stat.value }}</p>
      </div>
    </div>

    <!-- FILTRES I VISTES -->
    <div class="targeta-campus !p-6 space-y-4">
      <div class="flex flex-col xl:flex-row gap-4 justify-between">
        <div class="relative flex-1 max-w-md">
          <AppIcon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input v-model="filtres.cerca" @input="debounceCarregar" type="text" placeholder="Cerca deures..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-violet-400" />
        </div>
        <div class="flex flex-wrap gap-2">
          <select v-model="filtres.estat" @change="carregarTasques" class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <option value="">Tots els estats</option>
            <option value="pendent">Pendent</option>
            <option value="en_curs">En curs</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancel·lada</option>
          </select>
          <select v-model="filtres.modulId" @change="carregarTasques" class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <option value="">Tots els mòduls</option>
            <option v-for="m in moduls" :key="m.id" :value="m.id">{{ m.codi }} — {{ m.nom }}</option>
          </select>
          <select v-model="filtres.prioritat" @change="carregarTasques" class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <option value="">Prioritat</option>
            <option value="urgent">Urgent</option>
            <option value="alta">Alta</option>
            <option value="mitjana">Mitjana</option>
            <option value="baixa">Baixa</option>
          </select>
          <select v-model="filtres.ordre" @change="carregarTasques" class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <option value="data_limit">Per data límit</option>
            <option value="prioritat">Per prioritat</option>
            <option value="creat_el">Més recents</option>
          </select>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <button v-for="v in vistes" :key="v.id" @click="vistaActiva = v.id"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="vistaActiva === v.id ? 'bg-violet-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'">
          {{ v.label }}
        </button>
        <button @click="carregarTot" class="ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
          <AppIcon name="refresh" class="w-4 h-4" /> Actualitzar
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-24 text-center">
      <div class="inline-block w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregant agenda...</p>
    </div>

  <template v-else>
    <!-- VISTA LLISTA -->
    <div v-if="vistaActiva === 'llista'" class="space-y-4">
      <div v-if="tasquesFiltrades.length === 0" class="targeta-campus !p-16 text-center">
        <AppIcon name="list" class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Cap deure amb aquests filtres</p>
        <button @click="obrirModalNova" class="mt-6 px-6 py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Crear el primer deure</button>
      </div>
      <div v-for="tasca in tasquesFiltrades" :key="tasca.id"
        class="targeta-campus !p-6 hover:border-violet-200 transition-all group"
        :class="{ 'opacity-60': tasca.estat === 'completada' }">
        <div class="flex flex-col lg:flex-row gap-6">
          <button @click="toggleCompletada(tasca)" class="w-12 h-12 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center transition-all"
            :class="tasca.estat === 'completada' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-violet-400'">
            <AppIcon v-if="tasca.estat === 'completada'" name="check" class="w-6 h-6" />
          </button>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span :class="prioritatClass(tasca.prioritat)" class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase">{{ tasca.prioritat }}</span>
              <span class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-slate-100 text-slate-600">{{ tipusLabel(tasca.tipus) }}</span>
              <span v-if="esEndarrerida(tasca)" class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-rose-100 text-rose-600">Endarrerit</span>
              <span v-if="esAvui(tasca)" class="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-amber-100 text-amber-700">Avui</span>
            </div>
            <h4 class="text-lg font-black text-slate-900 uppercase italic group-hover:text-violet-700 transition-colors" :class="{ 'line-through': tasca.estat === 'completada' }">{{ tasca.titol }}</h4>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ nomModul(tasca) }} · {{ formatData(tasca.dataLimit) }}</p>
            <p v-if="tasca.descripcio" class="text-xs text-slate-500 mt-2 line-clamp-2">{{ tasca.descripcio }}</p>
            <div v-if="tasca.etiquetes?.length" class="flex flex-wrap gap-1 mt-3">
              <span v-for="et in tasca.etiquetes" :key="et" class="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-md text-[8px] font-bold">#{{ et }}</span>
            </div>
            <div v-if="tasca.checklist?.length" class="mt-4 space-y-2">
              <div v-for="item in tasca.checklist" :key="item.id" class="flex items-center gap-2">
                <input type="checkbox" :checked="item.fet" @change="toggleChecklistItem(tasca, item)" class="rounded accent-violet-600" />
                <span class="text-xs font-medium" :class="item.fet ? 'line-through text-slate-400' : 'text-slate-700'">{{ item.text }}</span>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-1">
                <span>Progrés</span>
                <span>{{ tasca.percentatgeProgres }}%</span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-violet-500 rounded-full transition-all" :style="{ width: tasca.percentatgeProgres + '%' }"></div>
              </div>
              <input type="range" :value="tasca.percentatgeProgres" @input="actualitzarProgres(tasca, $event)" min="0" max="100" class="w-full mt-2 accent-violet-600 h-1" />
            </div>
          </div>
          <div class="flex lg:flex-col gap-2 flex-shrink-0">
            <a v-if="tasca.enllac" :href="tasca.enllac" target="_blank" rel="noopener" class="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100" title="Obrir enllaç">
              <AppIcon name="send" class="w-5 h-5" />
            </a>
            <button @click="editarTasca(tasca)" class="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-violet-50 hover:text-violet-600"><AppIcon name="edit" class="w-5 h-5" /></button>
            <button @click="duplicarTasca(tasca)" class="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-violet-50 hover:text-violet-600"><AppIcon name="refresh" class="w-5 h-5" /></button>
            <button @click="eliminarTasca(tasca)" class="p-2.5 rounded-xl bg-slate-50 text-rose-400 hover:bg-rose-50 hover:text-rose-600"><AppIcon name="trash" class="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- VISTA KANBAN -->
    <div v-else-if="vistaActiva === 'kanban'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="col in kanbanColumnes" :key="col.estat" class="bg-slate-50 rounded-[2rem] p-4 border border-slate-100 min-h-[320px]">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center justify-between">
          {{ col.label }}
          <span class="px-2 py-0.5 rounded-full bg-white text-slate-700">{{ tasquesPerEstat(col.estat).length }}</span>
        </h3>
        <div class="space-y-3">
          <div v-for="tasca in tasquesPerEstat(col.estat)" :key="tasca.id" @click="editarTasca(tasca)"
            class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-violet-300 hover:shadow-md transition-all">
            <span :class="prioritatClass(tasca.prioritat)" class="text-[7px] font-black uppercase px-1.5 py-0.5 rounded">{{ tasca.prioritat }}</span>
            <p class="font-black text-slate-800 text-sm uppercase italic mt-2 leading-tight">{{ tasca.titol }}</p>
            <p class="text-[9px] text-slate-400 font-bold uppercase mt-2">{{ formatDataCurta(tasca.dataLimit) }}</p>
            <div class="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div class="h-full bg-violet-500" :style="{ width: tasca.percentatgeProgres + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VISTA CALENDARI SETMANAL -->
    <div v-else-if="vistaActiva === 'calendari'" class="targeta-campus !p-6">
      <div class="grid grid-cols-7 gap-2 mb-4">
        <div v-for="dia in diesSetmana" :key="dia.nom" class="text-center">
          <p class="text-[9px] font-black uppercase text-slate-400">{{ dia.nom }}</p>
          <p class="text-lg font-black" :class="dia.esAvui ? 'text-violet-600' : 'text-slate-800'">{{ dia.num }}</p>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2 min-h-[200px]">
        <div v-for="dia in diesSetmana" :key="'c-' + dia.data" class="p-2 rounded-xl border border-slate-100 min-h-[120px]" :class="dia.esAvui ? 'bg-violet-50 border-violet-200' : 'bg-slate-50/50'">
          <div v-for="t in tasquesPerDia(dia.data)" :key="t.id" @click="editarTasca(t)"
            class="mb-1 p-2 rounded-lg text-[8px] font-bold truncate cursor-pointer"
            :class="prioritatBg(t.prioritat)">
            {{ t.titol }}
          </div>
        </div>
      </div>
    </div>

    <!-- PROPERES ENTREGUES -->
    <div v-if="stats?.properes?.length" class="targeta-campus !p-8">
      <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
        <div class="w-1 h-4 bg-violet-600 rounded-full"></div>
        Properes entregues
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="p in stats.properes" :key="p.id" class="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100">
          <p class="text-[9px] font-black text-violet-500 uppercase">{{ nomModul(p) }}</p>
          <p class="font-black text-slate-800 uppercase italic mt-1">{{ p.titol }}</p>
          <p class="text-[10px] text-slate-500 font-bold mt-2">{{ formatData(p.dataLimit) }}</p>
        </div>
      </div>
    </div>
  </template>

    <!-- MODAL CREAR / EDITAR -->
    <div v-if="modalObert" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="tancarModal">
      <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-10 relative">
        <button @click="tancarModal" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-rose-100 rounded-xl">
          <AppIcon name="x" class="w-5 h-5" />
        </button>
        <h3 class="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-1">{{ tascaEdicio?.id ? 'Editar deure' : 'Nou deure' }}</h3>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Omple els detalls de la tasca</p>

        <form @submit.prevent="guardarTasca" class="space-y-5">
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Títol *</label>
            <input v-model="form.titol" required maxlength="200" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400" placeholder="Ex: Entrega UF3 - Vue Components" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Mòdul</label>
              <select v-model="form.modulId" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold">
                <option :value="null">Sense mòdul</option>
                <option v-for="m in moduls" :key="m.id" :value="m.id">{{ m.codi }} — {{ m.nom }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipus</label>
              <select v-model="form.tipus" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold">
                <option value="exercici">Exercici</option>
                <option value="projecte">Projecte</option>
                <option value="estudi">Estudi</option>
                <option value="examen">Examen</option>
                <option value="entrega">Entrega</option>
                <option value="altres">Altres</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Data límit *</label>
              <input v-model="form.dataLimit" type="datetime-local" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" />
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Prioritat</label>
              <select v-model="form.prioritat" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold">
                <option value="baixa">Baixa</option>
                <option value="mitjana">Mitjana</option>
                <option value="alta">Alta</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Descripció</label>
            <textarea v-model="form.descripcio" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold resize-none" placeholder="Detalls, requisits, notes..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Temps estimat (min)</label>
              <input v-model.number="form.tempsEstimatMinuts" type="number" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" />
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Enllaç (URL)</label>
              <input v-model="form.enllac" type="url" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Etiquetes (separades per comes)</label>
            <input v-model="etiquetesText" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" placeholder="vue, entrega, obligatori" />
          </div>
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subtasques / Checklist</label>
              <button type="button" @click="afegirSubtasca" class="text-[9px] font-black text-violet-600 uppercase">+ Afegir</button>
            </div>
            <div v-for="(sub, idx) in form.checklist" :key="sub.id" class="flex gap-2 mb-2">
              <input v-model="sub.text" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" placeholder="Subtasca..." />
              <button type="button" @click="form.checklist.splice(idx, 1)" class="p-2 text-rose-400"><AppIcon name="trash" class="w-4 h-4" /></button>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl">
            <input v-model="form.recordatori" type="checkbox" id="recordatori" class="accent-violet-600 w-5 h-5" />
            <label for="recordatori" class="text-xs font-bold text-violet-800">Activar recordatori abans de la data límit</label>
          </div>
          <div v-if="form.recordatori">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Data del recordatori</label>
            <input v-model="form.dataRecordatori" type="datetime-local" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" />
          </div>
          <div v-if="tascaEdicio?.id">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Estat</label>
            <select v-model="form.estat" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold">
              <option value="pendent">Pendent</option>
              <option value="en_curs">En curs</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancel·lada</option>
            </select>
          </div>
          <div class="flex gap-4 pt-4">
            <button type="button" @click="tancarModal" class="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase">Cancel·lar</button>
            <button type="submit" :disabled="guardant" class="flex-1 py-4 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase disabled:opacity-50">
              {{ guardant ? 'Guardant...' : (tascaEdicio?.id ? 'Actualitzar' : 'Crear deure') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({ user: Object });

const loading = ref(true);
const guardant = ref(false);
const modalObert = ref(false);
const tasques = ref([]);
const moduls = ref([]);
const stats = ref(null);
const tascaEdicio = ref(null);
const vistaActiva = ref('llista');
let debounceTimer = null;

const filtres = ref({
  cerca: '',
  estat: '',
  modulId: '',
  prioritat: '',
  ordre: 'data_limit',
});

const vistes = [
  { id: 'llista', label: 'Llista' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'calendari', label: 'Setmana' },
];

const kanbanColumnes = [
  { estat: 'pendent', label: 'Pendent' },
  { estat: 'en_curs', label: 'En curs' },
  { estat: 'completada', label: 'Completada' },
  { estat: 'cancelada', label: 'Cancel·lada' },
];

const form = ref(formBuit());
const etiquetesText = ref('');

function formBuit() {
  const dema = new Date();
  dema.setDate(dema.getDate() + 3);
  dema.setHours(23, 59, 0, 0);
  return {
    titol: '',
    descripcio: '',
    dataLimit: toDatetimeLocal(dema),
    modulId: null,
    tipus: 'exercici',
    prioritat: 'mitjana',
    estat: 'pendent',
    etiquetes: [],
    checklist: [],
    enllac: '',
    tempsEstimatMinuts: null,
    recordatori: false,
    dataRecordatori: '',
  };
}

function toDatetimeLocal(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json',
});

const statsCards = computed(() => [
  { label: 'Actives', value: stats.value?.actives ?? 0, color: 'text-violet-600' },
  { label: 'Per avui', value: stats.value?.avui ?? 0, color: 'text-amber-600' },
  { label: 'Endarrerides', value: stats.value?.endarrerides ?? 0, color: 'text-rose-600' },
  { label: 'Fetes setmana', value: stats.value?.completadesSetmana ?? 0, color: 'text-emerald-600' },
  { label: 'Total', value: stats.value?.total ?? 0, color: 'text-slate-800' },
  { label: 'Progrés mitjà', value: `${stats.value?.progresMitja ?? 0}%`, color: 'text-indigo-600' },
]);

const tasquesFiltrades = computed(() => {
  if (!filtres.value.tipus) return tasques.value;
  return tasques.value.filter((t) => t.tipus === filtres.value.tipus);
});

const diesSetmana = computed(() => {
  const avui = new Date();
  const dilluns = new Date(avui);
  const dia = avui.getDay();
  dilluns.setDate(avui.getDate() - (dia === 0 ? 6 : dia - 1));
  const noms = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];
  return noms.map((nom, i) => {
    const d = new Date(dilluns);
    d.setDate(dilluns.getDate() + i);
    const dataStr = d.toISOString().slice(0, 10);
    return {
      nom,
      num: d.getDate(),
      data: dataStr,
      esAvui: dataStr === avui.toISOString().slice(0, 10),
    };
  });
});

function tasquesPerEstat(estat) {
  return tasques.value.filter((t) => t.estat === estat);
}

function tasquesPerDia(dataStr) {
  return tasques.value.filter((t) => {
    if (t.estat === 'completada' || t.estat === 'cancelada') return false;
    return new Date(t.dataLimit).toISOString().slice(0, 10) === dataStr;
  });
}

function nomModul(t) {
  return t.modulNom || t.modul?.nom || 'Sense mòdul';
}

function prioritatClass(p) {
  const map = {
    urgent: 'bg-rose-100 text-rose-700',
    alta: 'bg-orange-100 text-orange-700',
    mitjana: 'bg-amber-100 text-amber-700',
    baixa: 'bg-slate-100 text-slate-600',
  };
  return map[p] || map.mitjana;
}

function prioritatBg(p) {
  const map = {
    urgent: 'bg-rose-100 text-rose-800',
    alta: 'bg-orange-100 text-orange-800',
    mitjana: 'bg-amber-100 text-amber-800',
    baixa: 'bg-slate-200 text-slate-700',
  };
  return map[p] || map.mitjana;
}

function tipusLabel(t) {
  const map = { exercici: 'Exercici', projecte: 'Projecte', estudi: 'Estudi', examen: 'Examen', entrega: 'Entrega', altres: 'Altres' };
  return map[t] || t;
}

function formatData(d) {
  return new Date(d).toLocaleString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDataCurta(d) {
  return new Date(d).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' });
}

function esEndarrerida(t) {
  if (t.estat === 'completada' || t.estat === 'cancelada') return false;
  const avui = new Date();
  avui.setHours(0, 0, 0, 0);
  return new Date(t.dataLimit) < avui;
}

function esAvui(t) {
  const d = new Date(t.dataLimit).toDateString();
  return d === new Date().toDateString();
}

async function carregarTot() {
  loading.value = true;
  try {
    const [tRes, sRes, mRes] = await Promise.all([
      fetch(buildUrl(), { headers: authHeaders() }),
      fetch(`${API_BASE_URL}/tasques/estadistiques`, { headers: authHeaders() }),
      fetch(`${API_BASE_URL}/tasques/moduls`, { headers: authHeaders() }),
    ]);
    if (tRes.ok) tasques.value = await tRes.json();
    if (sRes.ok) stats.value = await sRes.json();
    if (mRes.ok) moduls.value = await mRes.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function buildUrl() {
  const p = new URLSearchParams();
  if (filtres.value.estat) p.set('estat', filtres.value.estat);
  if (filtres.value.modulId) p.set('modulId', filtres.value.modulId);
  if (filtres.value.prioritat) p.set('prioritat', filtres.value.prioritat);
  if (filtres.value.cerca) p.set('cerca', filtres.value.cerca);
  if (filtres.value.ordre) p.set('ordre', filtres.value.ordre);
  const q = p.toString();
  return `${API_BASE_URL}/tasques/meves${q ? `?${q}` : ''}`;
}

function carregarTasques() {
  loading.value = true;
  fetch(buildUrl(), { headers: authHeaders() })
    .then((r) => r.json())
    .then((d) => { tasques.value = d; })
    .finally(() => { loading.value = false; });
}

function debounceCarregar() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(carregarTasques, 400);
}

function obrirModalNova() {
  tascaEdicio.value = null;
  form.value = formBuit();
  etiquetesText.value = '';
  modalObert.value = true;
}

function editarTasca(t) {
  tascaEdicio.value = t;
  form.value = {
    titol: t.titol,
    descripcio: t.descripcio || '',
    dataLimit: toDatetimeLocal(new Date(t.dataLimit)),
    modulId: t.modulId,
    tipus: t.tipus,
    prioritat: t.prioritat,
    estat: t.estat,
    checklist: t.checklist ? [...t.checklist] : [],
    enllac: t.enllac || '',
    tempsEstimatMinuts: t.tempsEstimatMinuts,
    recordatori: t.recordatori,
    dataRecordatori: t.dataRecordatori ? toDatetimeLocal(new Date(t.dataRecordatori)) : '',
  };
  etiquetesText.value = (t.etiquetes || []).join(', ');
  modalObert.value = true;
}

function tancarModal() {
  modalObert.value = false;
  tascaEdicio.value = null;
}

function afegirSubtasca() {
  form.value.checklist.push({
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text: '',
    fet: false,
  });
}

async function guardarTasca() {
  guardant.value = true;
  const payload = {
    ...form.value,
    modulId: form.value.modulId || undefined,
    etiquetes: etiquetesText.value.split(',').map((e) => e.trim()).filter(Boolean),
    checklist: form.value.checklist.filter((c) => c.text.trim()),
    dataLimit: new Date(form.value.dataLimit).toISOString(),
    dataRecordatori: form.value.dataRecordatori ? new Date(form.value.dataRecordatori).toISOString() : undefined,
  };
  try {
    const url = tascaEdicio.value?.id
      ? `${API_BASE_URL}/tasques/${tascaEdicio.value.id}`
      : `${API_BASE_URL}/tasques`;
    const res = await fetch(url, {
      method: tascaEdicio.value?.id ? 'PATCH' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      tancarModal();
      await carregarTot();
    }
  } finally {
    guardant.value = false;
  }
}

async function toggleCompletada(t) {
  const nouEstat = t.estat === 'completada' ? 'pendent' : 'completada';
  await fetch(`${API_BASE_URL}/tasques/${t.id}/estat`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ estat: nouEstat }),
  });
  await carregarTot();
}

let progresDebounce = null;

async function actualitzarProgres(t, e) {
  const pct = Number(e.target.value);
  t.percentatgeProgres = pct;

  clearTimeout(progresDebounce);
  progresDebounce = setTimeout(async () => {
    const res = await fetch(`${API_BASE_URL}/tasques/${t.id}/progres`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ percentatge: pct }),
    });
    if (!res.ok) return;

    const updated = await res.json();
    aplicarTascaActualitzada(updated);

    if (updated.estat === 'completada') {
      await actualitzarEstadistiques();
    }
  }, 300);
}

function aplicarTascaActualitzada(updated) {
  const idx = tasques.value.findIndex((x) => x.id === updated.id);
  if (idx >= 0) {
    tasques.value[idx] = updated;
  }
}

async function actualitzarEstadistiques() {
  const res = await fetch(`${API_BASE_URL}/tasques/estadistiques`, { headers: authHeaders() });
  if (res.ok) stats.value = await res.json();
}

async function toggleChecklistItem(tasca, item) {
  item.fet = !item.fet;
  const checklist = tasca.checklist.map((c) => (c.id === item.id ? { ...item } : c));
  const res = await fetch(`${API_BASE_URL}/tasques/${tasca.id}/checklist`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ checklist }),
  });
  if (res.ok) {
    const updated = await res.json();
    aplicarTascaActualitzada(updated);
    await actualitzarEstadistiques();
  }
}

async function duplicarTasca(t) {
  await fetch(`${API_BASE_URL}/tasques/${t.id}/duplicar`, { method: 'POST', headers: authHeaders() });
  await carregarTot();
}

async function eliminarTasca(t) {
  if (!confirm('Eliminar aquest deure?')) return;
  await fetch(`${API_BASE_URL}/tasques/${t.id}`, { method: 'DELETE', headers: authHeaders() });
  await carregarTot();
}

onMounted(carregarTot);
</script>
