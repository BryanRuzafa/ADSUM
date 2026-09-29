<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex text-slate-900 dark:text-slate-100 transition-colors duration-300">
    
    <!-- SIDEBAR (Desktop) -->
    <aside 
      class="hidden md:flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 sticky top-0 h-screen z-40 transition-all duration-300 overflow-hidden shadow-xl"
      :class="isCollapsed ? 'w-24' : 'w-72'"
    >
      <!-- Logo Section -->
      <div 
        @click="changeView('home')" 
        class="p-8 flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all duration-300"
        :class="isCollapsed ? 'justify-center p-6' : ''"
      >
        <div class="relative group">
          <img src="/logo.png" alt="ADSUM" class="rounded-xl object-contain bg-white shadow-lg transition-all duration-300" :class="isCollapsed ? 'w-12 h-12' : 'w-16 h-16'" />
          <div v-if="isCollapsed" class="absolute -right-2 -bottom-2 w-4 h-4 bg-primari-normal rounded-full border-2 border-white dark:border-slate-800"></div>
        </div>
        <div v-if="!isCollapsed" class="flex flex-col animate-fade-in">
          <span class="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">ADSUM</span>
          <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Campus Digital</span>
        </div>
      </div>
      
      <!-- Nav Section -->
      <nav class="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
        <button v-for="item in navItems" :key="item.id" 
          @click="changeView(item.id)"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group relative"
          :class="[
            activeView === item.id 
              ? 'bg-primari-normal text-white shadow-lg shadow-blue-200 dark:shadow-none' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primari-normal dark:hover:text-primari-normal',
            isCollapsed ? 'justify-center px-0' : ''
          ]"
        >
          <AppIcon :name="item.icon" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span v-if="!isCollapsed" class="tracking-wide uppercase text-[10px] font-bold animate-fade-in">{{ item.label }}</span>
          
          <!-- Tooltip for collapsed mode -->
          <div v-if="isCollapsed" class="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
            {{ item.label }}
          </div>
        </button>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
        <!-- Collapse Toggle -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="hidden md:flex w-full items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-400 transition-all duration-200"
          :class="isCollapsed ? 'justify-center' : ''"
        >
          <AppIcon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" class="w-4 h-4" />
          <span v-if="!isCollapsed" class="text-[10px] font-black uppercase tracking-widest">Col·lapsar</span>
        </button>

        <div 
          @click="$emit('logout')" 
          class="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-200 cursor-pointer group"
          :class="isCollapsed ? 'justify-center p-3' : ''"
        >
          <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}&backgroundColor=b6e3f4`" class="w-full h-full object-cover" />
          </div>
          <div v-if="!isCollapsed" class="flex-1 overflow-hidden animate-fade-in">
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate uppercase">{{ user?.nom }}</p>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {{ user?.rol === 'professor' ? 'Docent' : user?.rol === 'admin' ? 'Gestor' : 'Alumne' }}
            </p>
          </div>
          <AppIcon v-if="!isCollapsed" name="logout" class="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
      <header class="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-colors duration-300">
        <div class="flex items-center gap-2 md:gap-4">
          <button @click="$emit('logout')" class="md:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors" title="Tornar a l'inici">
            <AppIcon name="home" class="w-5 h-5" />
          </button>
          
          <div @click="changeView('home')" class="md:hidden flex items-center gap-2 cursor-pointer">
            <div class="w-8 h-8 bg-primari-normal rounded flex items-center justify-center text-white text-[10px] font-black">A</div>
            <h1 class="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase">{{ currentTitle }}</h1>
          </div>
          
          <h1 class="hidden md:block text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase">{{ currentTitle }}</h1>
        </div>

        <div class="flex items-center gap-2 md:gap-4">
          <!-- Command Palette Trigger (Desktop) -->
          <button 
            @click="showCommandPalette = true"
            class="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:border-primari-normal transition-all group"
          >
            <AppIcon name="search" class="w-4 h-4" />
            <span class="text-[10px] font-bold uppercase tracking-widest">Cerca ràpida...</span>
            <kbd class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-300 group-hover:text-primari-normal">⌘K</kbd>
          </button>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <button @click="showGemini = true" class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-primari-normal text-blue-400 dark:text-white flex items-center justify-center hover:bg-blue-600 dark:hover:bg-primari-fosc hover:text-white transition-all shadow-lg shadow-blue-100 dark:shadow-none group relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
          </button>
          
          <!-- Notification Bell with Panel -->
          <div class="relative">
            <button @click="showNotifications = !showNotifications" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-primari-normal hover:border-primari-normal transition-all relative">
              <AppIcon name="bell" class="w-5 h-5" />
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
            </button>
            <!-- Dropdown panel -->
            <div v-if="showNotifications" class="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
              <div class="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                <span class="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Notificacions</span>
                <button @click="showNotifications = false" class="text-slate-400 hover:text-rose-500 text-xs">✕</button>
              </div>
              <div class="divide-y divide-slate-50 dark:divide-slate-700 max-h-72 overflow-y-auto">
                <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Nova justificació rebuda</p>
                  <p class="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Fa 5 minuts</p>
                </div>
                <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Sessió de M07 programada</p>
                  <p class="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Fa 2 hores</p>
                </div>
                <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Recordatori: Entrega projecte</p>
                  <p class="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Demà a les 23:59</p>
                </div>
              </div>
              <div class="p-3 bg-slate-50 dark:bg-slate-900/50 text-center">
                <button class="text-[9px] font-black text-primari-normal uppercase tracking-widest hover:underline">Marcar totes com llegides</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="p-6 md:p-10 max-w-7xl mx-auto w-full transition-all duration-500">
        <slot :activeView="activeView" :changeView="changeView" />
      </div>
    </main>

    <!-- BOTTOM NAV (Mobile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 h-16 flex items-center justify-around z-40 transition-colors duration-300">
      <button v-for="item in navItems" :key="item.id" @click="changeView(item.id)"
        class="flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-200"
        :class="activeView === item.id ? 'text-primari-normal' : 'text-slate-400 dark:text-slate-500'"
      >
        <AppIcon :name="item.icon" class="w-5 h-5 transition-transform" :class="{ 'scale-110': activeView === item.id }" />
        <span class="text-[9px] font-bold uppercase tracking-widest">{{ item.label }}</span>
      </button>

      <!-- FAB QR (for alumne) -->
      <button v-if="user?.rol === 'alumne'" @click="showQR = true"
        class="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-primari-normal rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center text-white border-4 border-slate-50 dark:border-slate-900 active:scale-95 transition-all duration-200"
      >
        <AppIcon name="qr" class="w-7 h-7" />
      </button>
    </nav>

    <!-- MODALS -->
    <div v-if="showQR" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in" @click.self="showQR = false">
      <div class="w-full max-w-sm">
        <AttendanceQR @close="showQR = false" />
      </div>
    </div>

    <div v-if="showGemini" class="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] max-h-[80vh] shadow-2xl animate-fade-in">
       <GeminiChat @close="showGemini = false" />
    </div>

     <!-- Command Palette -->
     <div v-if="showCommandPalette" class="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" @click.self="showCommandPalette = false">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
           <div class="p-6 border-b dark:border-slate-700 flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50">
              <AppIcon name="search" class="w-6 h-6 text-slate-400" />
              <input 
                v-model="searchQuery" 
                @input="handleSearchInput" 
                autofocus 
                placeholder="Cerca ràpida: Bryan, Calendari, M03..." 
                class="flex-1 bg-transparent border-none outline-none text-base font-semibold dark:text-white placeholder-slate-400" 
              />
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">ESC</span>
           </div>

           <div class="max-h-[400px] overflow-y-auto p-4 space-y-2 no-scrollbar">
              <!-- Loading state -->
              <div v-if="isSearching" class="py-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
                 Cercant al campus...
              </div>

              <!-- Empty state -->
              <div v-else-if="searchQuery && searchResults.length === 0" class="py-12 text-center text-slate-400">
                 <AppIcon name="warning" class="w-8 h-8 text-slate-300 mx-auto mb-3" />
                 <p class="text-xs font-black uppercase tracking-widest">No s'han trobat resultats</p>
                 <p class="text-[9px] text-slate-400 uppercase mt-1">Intenta cercar una altra paraula clau</p>
              </div>

              <!-- Start State -->
              <div v-else-if="!searchQuery" class="py-6 px-4 text-slate-400">
                 <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400/85">Suggeriments de Cerca</p>
                 <div class="grid grid-cols-2 gap-4">
                    <div @click="searchQuery = 'Calendari'; performSearch();" class="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all text-left">
                       <p class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">📅 Calendari Escolar</p>
                       <p class="text-[9px] text-slate-400 uppercase mt-0.5">Veure festius i exàmens</p>
                    </div>
                    <div @click="searchQuery = 'Horari'; performSearch();" class="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all text-left">
                       <p class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">🕒 Horari Setmanal</p>
                       <p class="text-[9px] text-slate-400 uppercase mt-0.5">Veure sessions de classe</p>
                    </div>
                 </div>
              </div>

              <!-- Results list -->
              <div v-else class="space-y-1">
                 <div 
                   v-for="item in searchResults" 
                   :key="item.id" 
                   @click="handleSelectResult(item)" 
                   class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 rounded-2xl cursor-pointer transition-all border border-transparent hover:shadow-lg group"
                 >
                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-white transition-all border border-slate-100 dark:border-slate-700">
                          <AppIcon :name="item.type === 'usuari' ? 'users' : item.type === 'modul' ? 'book' : 'link'" class="w-5 h-5" />
                       </div>
                       <div>
                          <p class="text-xs font-black uppercase tracking-tight italic text-slate-800 dark:text-slate-100 group-hover:text-white">{{ item.title }}</p>
                          <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-100 mt-0.5">{{ item.subtitle }}</p>
                       </div>
                    </div>
                    <span class="text-[8px] font-black uppercase tracking-widest bg-slate-200/50 text-slate-500 dark:bg-slate-700 dark:text-slate-300 group-hover:bg-white/20 group-hover:text-white px-3 py-1 rounded-lg">
                       {{ item.type }}
                    </span>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import ThemeToggle from '../components/shared/ThemeToggle.vue';
import AttendanceQR from '../components/alumne/AttendanceQR.vue';
import GeminiChat from '../components/GeminiChat.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['logout', 'change-view']);

const activeView = ref('home');
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true');
const showQR = ref(false);
const showGemini = ref(false);
const showCommandPalette = ref(false);

const navItems = computed(() => {
  if (props.user?.rol === 'pare') {
    return [
      { id: 'home', label: 'Inici', icon: 'home' },
      { id: 'justifications', label: 'Tràmits', icon: 'folder' },
      { id: 'calendar', label: 'Calendari', icon: 'calendar' },
      { id: 'schedule', label: 'Horari', icon: 'clock' },
      { id: 'chat', label: 'Xat', icon: 'chat' }
    ];
  }
  if (props.user?.rol === 'professor') {
    return [
      { id: 'home', label: 'Inici', icon: 'home' },
      { id: 'performance', label: 'Grups', icon: 'stats' },
      { id: 'justifications', label: 'Tràmits', icon: 'folder' },
      { id: 'calendar', label: 'Calendari', icon: 'calendar' },
      { id: 'schedule', label: 'Horari', icon: 'clock' },
      { id: 'toolkit', label: 'Eines', icon: 'lightning' },
      { id: 'booking', label: 'Reserves', icon: 'calendar' },
      { id: 'resources', label: 'Recursos', icon: 'book' },
      { id: 'chat', label: 'Xat', icon: 'chat' },
      { id: 'incidencies', label: 'Bústia', icon: 'list' }
    ];
  }
  if (props.user?.rol === 'admin') {
    return [
      { id: 'home', label: 'Inici', icon: 'home' },
      { id: 'users', label: 'Usuaris', icon: 'users' },
      { id: 'center', label: 'Centre', icon: 'settings' },
      { id: 'incidencies', label: 'Bústia', icon: 'list' }
    ];
  }
  return [
    { id: 'home', label: 'Inici', icon: 'home' },
    { id: 'performance', label: 'Notes', icon: 'academic' },
    { id: 'calculator', label: 'Simulador', icon: 'calculator' },
    { id: 'tasques', label: 'Deures', icon: 'book' },
    { id: 'justifications', label: 'Tràmits', icon: 'folder' },
    { id: 'calendar', label: 'Calendari', icon: 'calendar' },
    { id: 'schedule', label: 'Horari', icon: 'clock' },
    { id: 'booking', label: 'Reserves', icon: 'calendar' },
    { id: 'resources', label: 'Recursos', icon: 'book' },
    { id: 'chat', label: 'Xat', icon: 'chat' },
    { id: 'attendance', label: 'Històric', icon: 'list' },
    { id: 'incidencies', label: 'Bústia', icon: 'list' }
  ];
});

const changeView = (view) => {
  activeView.value = view;
  emit('change-view', view);
};

const currentTitle = computed(() => navItems.value.find(i => i.id === activeView.value)?.label || 'ADSUM');

// Watch isCollapsed for persistence
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value);
};

// Handle Ctrl+K shortcut
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  isSearching.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/cerca?q=${encodeURIComponent(searchQuery.value)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      searchResults.value = await res.json();
    }
  } catch (e) {
    console.error('Error conducting search:', e);
  } finally {
    isSearching.value = false;
  }
};

let searchTimeout = null;
const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 300);
};

const handleSelectResult = (item) => {
  showCommandPalette.value = false;
  searchQuery.value = '';
  searchResults.value = [];

  if (item.type === 'nav') {
    changeView(item.payload.view);
  } else if (item.type === 'usuari') {
    if (item.payload.rol === 'professor') {
      changeView('chat');
    } else if (props.user?.rol === 'admin') {
      changeView('users');
    } else {
      changeView('home');
    }
  } else if (item.type === 'modul') {
    changeView('performance');
  }
};

const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    showCommandPalette.value = !showCommandPalette.value;
  }
  if (e.key === 'Escape') {
    showCommandPalette.value = false;
  }
};

const showNotifications = ref(false);

// Close notifications on outside click
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', (e) => {
    // Close notifications if clicking outside
    const notifBtn = document.querySelector('[data-notif-btn]');
    if (showNotifications.value && notifBtn && !notifBtn.contains(e.target)) {
      // only close if not clicking the bell area
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style>
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

