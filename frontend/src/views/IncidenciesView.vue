<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- CAPÇALERA ACADÈMICA ADSUM PREMIUM -->
    <div class="hero-academic shadow-xl shadow-blue-100 dark:shadow-none flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-6">
        <svg width="300" height="300" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Àrea de Suport</span>
          <span class="badge-estat bg-emerald-400/50 text-white font-extrabold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
            {{ esAdmin ? 'Administració' : (esDocent ? 'Docent' : 'Alumnat') }}
          </span>
        </div>
        <h2 class="text-3xl md:text-5xl font-black tracking-tight uppercase italic leading-none text-white">Bústia d'Incidències</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-2xl text-xs uppercase tracking-widest font-bold">
          {{ esAdmin 
            ? 'Gestió global de la infraestructura de l\'institut, control d\'estats i resolució de queixes materials.' 
            : (esDocent 
                ? 'Control de resolució de queixes, canvis d\'estat i supervisió d\'equips de les aules.' 
                : 'Informa sobre incidències del maquinari o l\'aula a l\'instant mitjançant el plànol interactiu.'
              )
          }}
        </p>
      </div>
    </div>

    <!-- PANELL D'ALUMNE: FORMULARI INTERACTIU I ELS SEUS REPORTS -->
    <div v-if="!esDocent" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- FORMULARI DE REPORT AMB MAPA 2D I ALTRES CRITERIS -->
      <div class="lg:col-span-2 space-y-6">
        <div class="targeta-campus !p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-3xl transition-all hover:shadow-2xl">
          <div class="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-750 pb-4">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <span class="w-2.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
              Registrar Nova Incidència
            </h3>
            <button
              v-if="formulariModificat"
              @click="netejarFormulari"
              class="text-[10px] text-slate-400 hover:text-red-500 font-black uppercase tracking-widest transition-colors flex items-center gap-1 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              Netejar Formulari
            </button>
          </div>

          <form @submit.prevent="enviarIncidencia" class="space-y-8">
            <!-- 1. SELECCIÓ DE PLANTA I AULA -->
            <div class="space-y-4">
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">1. Selecció de la Ubicació</label>
              
              <!-- Pestanyes de Planta segmentades -->
              <div class="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl gap-1">
                <button
                  type="button"
                  @click="pestanyaPlanta = 'planta1'"
                  :class="[
                    pestanyaPlanta === 'planta1'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
                    'flex-1 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all cursor-pointer'
                  ]"
                >
                  Planta 1
                </button>
                <button
                  type="button"
                  @click="pestanyaPlanta = 'planta2'"
                  :class="[
                    pestanyaPlanta === 'planta2'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
                    'flex-1 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all cursor-pointer'
                  ]"
                >
                  Planta 2
                </button>
                <button
                  type="button"
                  @click="pestanyaPlanta = 'altres'"
                  :class="[
                    pestanyaPlanta === 'altres'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
                    'flex-1 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all cursor-pointer'
                  ]"
                >
                  Zones Comunes / Altres
                </button>
              </div>

              <!-- Botons d'Aula corresponents a la planta -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  v-for="aulaOpcio in aulesFiltrades"
                  :key="aulaOpcio"
                  type="button"
                  @click="seleccionarAula(aulaOpcio)"
                  :class="[
                    aulaSeleccionada === aulaOpcio
                      ? 'border-2 border-blue-600 bg-blue-50/80 text-blue-700 shadow-md scale-[1.02] dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-300'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-650 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-200',
                    'py-3.5 px-3 rounded-2xl text-center text-xs font-black uppercase transition-all tracking-wider cursor-pointer'
                  ]"
                >
                  {{ aulaOpcio }}
                </button>
              </div>

              <!-- INPUT PERSONALITZAT SI ÉS ALTRES -->
              <Transition name="slide-down">
                <div v-if="aulaSeleccionada === 'Altres'" class="pt-1">
                  <input
                    type="text"
                    v-model="aulaPersonalitzada"
                    placeholder="Especifica el lloc (ex: Biblioteca, Gimnàs, Menjador...)"
                    required
                    class="w-full bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
              </Transition>
            </div>

            <!-- 2. PLÀNOL INTERACTIU D'AULA 2D -->
            <Transition name="slide-down">
              <div v-if="mostrarPlanolInteractiu" class="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-150 dark:border-slate-750">
                <div class="flex justify-between items-center">
                  <div>
                    <h4 class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Plànol 2D Interactiu de l'Aula</h4>
                    <p class="text-[9px] text-slate-400 dark:text-slate-550 uppercase mt-0.5 font-semibold">Tria l'ordinador, la taula o l'equip afectat al mapa:</p>
                  </div>
                  <span v-if="equipSeleccionat" class="bg-blue-600 text-white font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                    Seleccionat: {{ equipSeleccionat }}
                  </span>
                </div>

                <!-- Quadrícula de l'Aula (Grid 2D) -->
                <div class="grid grid-cols-4 gap-3 bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-inner">
                  
                  <!-- Frontal Aula (Pissarra + Projector + Taula Docent) -->
                  <div class="col-span-4 grid grid-cols-4 gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/50 mb-3">
                    <!-- Pissarra / Projector (Esquerra / Central) -->
                    <button
                      type="button"
                      @click="seleccionarEquip('Projector / Pissarra')"
                      :class="[
                        equipSeleccionat === 'Projector / Pissarra'
                          ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-650',
                        'col-span-3 py-3 rounded-xl text-center text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5'
                      ]"
                    >
                      Projector / Pissarra
                    </button>
                    <!-- Taula Professor -->
                    <button
                      type="button"
                      @click="seleccionarEquip('Taula del Professor')"
                      :class="[
                        equipSeleccionat === 'Taula del Professor'
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-650',
                        'py-3 rounded-xl text-center text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer'
                      ]"
                    >
                      Docent
                    </button>
                  </div>

                  <!-- Ordinadors / Taules d'Alumnes -->
                  <div
                    v-for="indexTaula in 12"
                    :key="indexTaula"
                    class="col-span-1"
                  >
                    <button
                      type="button"
                      @click="seleccionarEquip(`Ordinador ${indexTaula}`)"
                      :class="[
                        equipSeleccionat === `Ordinador ${indexTaula}`
                          ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-650 hover:border-slate-350 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700',
                        'w-full py-4.5 rounded-xl text-center text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer flex flex-col items-center justify-center gap-1'
                      ]"
                    >
                      Taula {{ indexTaula }}
                    </button>
                  </div>
                </div>

                <div class="flex justify-between items-center text-[8px] text-slate-400 uppercase tracking-wider font-semibold px-1">
                  <span>Porta d'Entrada</span>
                  <span>Finestres</span>
                </div>
              </div>
            </Transition>

            <!-- 3. SELECCIÓ DE MOTIU / CATEGORIA AMB GRADIENTS ACTIUS -->
            <div class="space-y-3">
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">3. Quin és el motiu de la incidència?</label>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  v-for="cat in llistaCategories"
                  :key="cat.codi"
                  type="button"
                  @click="seleccionarCategoria(cat.codi)"
                  :class="[
                    categoriaSeleccionada === cat.codi
                      ? cat.gradientActiu + ' text-white shadow-lg scale-105 border-transparent'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-355 dark:hover:border-slate-645 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-850 dark:hover:text-slate-200',
                    'py-5 px-2 rounded-2xl text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer border'
                  ]"
                >
                  <span class="text-[10px] font-black uppercase tracking-widest">{{ cat.etiqueta }}</span>
                </button>
              </div>
            </div>

            <!-- 4. SELECTOR DE PRIORITAT / GRAVETAT -->
            <div class="space-y-3">
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">4. Gravetat o Nivell d'Afectació</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="prio in opcionsPrioritat"
                  :key="prio.codi"
                  type="button"
                  @click="prioritatSeleccionada = prio.codi"
                  :class="[
                    prioritatSeleccionada === prio.codi
                      ? prio.estilActiu + ' text-white ring-4 ' + prio.ringColor
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/45 hover:text-slate-800 dark:hover:text-slate-200',
                    'py-3 px-3 rounded-2xl text-center text-xs font-black uppercase transition-all tracking-wider cursor-pointer border flex items-center justify-center gap-2'
                  ]"
                >
                  {{ prio.etiqueta }}
                </button>
              </div>
            </div>

            <!-- 5. DETALL DEL REPORT I SUGGERIMENTS -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">5. Detalls del report</label>
                <span :class="[descripcio.length < 10 ? 'text-amber-500' : 'text-slate-450', 'text-[9px] font-extrabold uppercase tracking-wider']">
                  {{ descripcio.length }} / 500 caràcters
                </span>
              </div>

              <!-- Suggeriments Ràpids Clamats al Motiu Actiu -->
              <div v-if="suggerimentsDisponibles.length > 0" class="flex flex-wrap gap-2 pt-1 pb-2">
                <span class="text-[8px] font-black text-slate-400 uppercase tracking-wider self-center mr-1">Ràpid:</span>
                <button
                  v-for="sugg in suggerimentsDisponibles"
                  :key="sugg"
                  type="button"
                  @click="afegirSuggeriment(sugg)"
                  class="bg-slate-100 hover:bg-blue-50 dark:bg-slate-750 dark:hover:bg-blue-955/30 text-slate-650 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all border border-slate-200/50 dark:border-slate-700 cursor-pointer"
                >
                  + {{ sugg }}
                </button>
              </div>

              <textarea
                v-model="descripcio"
                rows="4"
                required
                maxlength="500"
                placeholder="Detalla el problema per tal que puguem buscar una resolució immediata..."
                class="w-full bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner resize-none leading-relaxed"
              ></textarea>
            </div>

            <!-- ENVIAMENT D'INCIDÈNCIA -->
            <button
              type="submit"
              :disabled="enviant || descripcio.length < 10"
              class="w-full py-5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-100 dark:shadow-none active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{{ enviant ? 'Tramitant report al centre...' : 'Enviar incidència registrada' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- HISTORIAL LATERAL ELEGANT AMB TIMELINE -->
      <div class="space-y-6">
        <div class="targeta-campus !p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-3xl flex flex-col h-full min-h-[600px]">
          <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-750 pb-4 flex items-center gap-2">
            <span class="w-2.5 h-4 bg-indigo-500 rounded-full"></span>
            Els Meus Reports
          </h3>

          <div v-if="carregant" class="py-16 text-center text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
            Sincronitzant historial...
          </div>

          <!-- ESTAT BUIT AMB IL·LUSTRACIÓ SVG ANIMADA PREMIUM -->
          <div v-else-if="incidencies.length === 0" class="py-20 text-center text-slate-350 dark:text-slate-650 flex flex-col items-center justify-center flex-1">
            <div class="w-32 h-32 mb-6 text-indigo-500/80 animate-float">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="currentColor" fill-opacity="0.06"/>
                <rect x="25" y="32" width="50" height="36" rx="8" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
                <path d="M25 38L50 53L75 38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M70 70L80 80" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M74 74H70V78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="28" cy="18" r="3" fill="currentColor" class="animate-pulse"/>
                <circle cx="78" cy="22" r="2" fill="currentColor" fill-opacity="0.5"/>
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Tot correcte de moment</p>
            <p class="text-[9px] text-slate-400 dark:text-slate-550 uppercase mt-1.5 font-bold max-w-[200px] leading-relaxed">No has reportat cap incidència activa al campus.</p>
          </div>

          <!-- LLISTA AMB ACCORDEÓ I TIMELINE DETALLAT -->
          <div v-else class="space-y-4 max-h-[640px] overflow-y-auto pr-1 no-scrollbar flex-1">
            <div
              v-for="inc in incidencies"
              :key="inc.id"
              class="p-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-slate-700/80 transition-all cursor-pointer"
              @click="commutarIncidencia(inc.id)"
            >
              <!-- Capçalera Targeta Historial -->
              <div class="flex justify-between items-start gap-2 mb-3">
                <span class="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-355 rounded-lg text-[8px] font-black uppercase tracking-wider border border-slate-150 dark:border-slate-700/50">
                  {{ inc.aula }}
                </span>
                <span :class="[obtenirEstilsEstat(inc.estat), 'px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider']">
                  {{ formatarEstat(inc.estat) }}
                </span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <p class="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  {{ formatarCategoria(inc.categoria) }}
                </p>
                <!-- Badge Prioritat -->
                <span :class="[obtenirEstilsPrioritat(inc.prioritat), 'text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest']">
                  {{ inc.prioritat }}
                </span>
              </div>
              <p class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-2 line-clamp-2">
                {{ inc.descripcio }}
              </p>
              
              <div class="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                <span>{{ formatarData(inc.dataCreacio) }}</span>
                <span class="text-blue-500 font-extrabold text-[7px]">{{ incidenciaExpandidaId === inc.id ? 'Tancar detalls' : 'Veure seguiment' }}</span>
              </div>

              <!-- TIMELINE EXPANDIBLE D'ESTAT DEL REPORT (UX PREMIUM) -->
              <Transition name="slide-down">
                <div v-if="incidenciaExpandidaId === inc.id" class="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/85 space-y-4" @click.stop>
                  <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Traçabilitat del Report:</p>
                  
                  <div class="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-750">
                    
                    <!-- Pas 1: Enregistrada -->
                    <div class="relative flex flex-col gap-0.5">
                      <div class="absolute -left-6 top-1.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 flex items-center justify-center"></div>
                      <span class="text-[9px] font-black text-slate-800 dark:text-slate-250 uppercase tracking-wider">Incidència Reportada</span>
                      <span class="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-semibold">El {{ formatarData(inc.dataCreacio) }}</span>
                    </div>

                    <!-- Pas 2: Processant -->
                    <div class="relative flex flex-col gap-0.5">
                      <div :class="[
                        inc.estat === 'en_proces' || inc.estat === 'resolta' ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700',
                        'absolute -left-6 top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-800'
                      ]"></div>
                      <span :class="[
                        inc.estat === 'en_proces' || inc.estat === 'resolta' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-550',
                        'text-[9px] font-black uppercase tracking-wider'
                      ]">En Curs de Resolució</span>
                      <span class="text-[8px] text-slate-400 dark:text-slate-555 uppercase font-semibold">
                        {{ inc.estat === 'en_proces' || inc.estat === 'resolta' ? 'L\'equip de manteniment està assignat.' : 'Pendent de validació.' }}
                      </span>
                    </div>

                    <!-- Pas 3: Resolt -->
                    <div class="relative flex flex-col gap-0.5">
                      <div :class="[
                        inc.estat === 'resolta' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700',
                        'absolute -left-6 top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-800'
                      ]"></div>
                      <span :class="[
                        inc.estat === 'resolta' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-550',
                        'text-[9px] font-black uppercase tracking-wider'
                      ]">Incidència Tancada</span>
                      <span class="text-[8px] text-slate-400 dark:text-slate-555 uppercase font-semibold">
                        {{ inc.estat === 'resolta' ? 'El problema s\'ha solucionat correctament.' : 'En espera d\'actuació.' }}
                      </span>
                    </div>

                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PANELL DOCENT / ADMINISTRADOR: CONTROL I MÈTRIQUES -->
    <div v-else class="space-y-8">
      
      <!-- RESUM METRIQUES / CARDS (KPIs) AMB EFECE INTERACTIU -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-5">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner">TOTAL</div>
          <div>
            <p class="text-[8px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">Total Reports</p>
            <p class="text-3xl font-black text-slate-800 dark:text-white mt-0.5">{{ estadistiques.total }}</p>
          </div>
        </div>
        
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-5">
          <div class="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner">PENDENT</div>
          <div>
            <p class="text-[8px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">Pendents</p>
            <p class="text-3xl font-black text-amber-600 mt-0.5">{{ estadistiques.pendents }}</p>
          </div>
        </div>
        
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-5">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-455 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner text-center">CURS</div>
          <div>
            <p class="text-[8px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">En Resolució</p>
            <p class="text-3xl font-black text-indigo-600 mt-0.5">{{ estadistiques.proces }}</p>
          </div>
        </div>
        
        <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-5">
          <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner">RESOLT</div>
          <div>
            <p class="text-[8px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest">Tancades</p>
            <p class="text-3xl font-black text-emerald-600 mt-0.5">{{ estadistiques.resoltes }}</p>
          </div>
        </div>
      </div>

      <!-- DETALL D'ANALÍTICA: "PUNTS CALENTS" I AULES AMB MÉS REPORTS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- PANELL D'ANALISI LATERAL -->
        <div class="lg:col-span-1 space-y-6">
          <div class="targeta-campus bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-3xl p-6">
            <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span class="w-2.5 h-4 bg-amber-500 rounded-full"></span>
              Punts Calents del Campus
            </h3>
            <p class="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-semibold mb-4 leading-relaxed">Aules amb acumulació de queixes pendents de tancar:</p>
            
            <div v-if="puntsCalentsAules.length === 0" class="py-8 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              No hi ha aules amb queixes actives
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="aulaHot in puntsCalentsAules" :key="aulaHot.aula" class="space-y-1.5">
                <div class="flex justify-between items-center text-[10px] font-black uppercase text-slate-700 dark:text-slate-350">
                  <span>Aula {{ aulaHot.aula }}</span>
                  <span class="text-red-500 font-extrabold">{{ aulaHot.total }} Actius</span>
                </div>
                <!-- Barra de progrés -->
                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-red-500 to-amber-500 h-2 rounded-full transition-all duration-500" 
                    :style="{ width: `${(aulaHot.total / estadistiques.total) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- ANALISI PER MOTIUS -->
            <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mt-8 mb-5 flex items-center gap-2">
              <span class="w-2.5 h-4 bg-blue-600 rounded-full"></span>
              Tipus d'Afectació
            </h3>
            <div class="space-y-3.5">
              <div v-for="(pencentatge, catTipus) in percentatgeMotius" :key="catTipus" class="flex justify-between items-center text-[9px] font-bold uppercase text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                <span class="flex items-center gap-1.5">
                  {{ catTipus }}
                </span>
                <span class="text-slate-800 dark:text-slate-200 font-extrabold">{{ pencentatge }} %</span>
              </div>
            </div>
          </div>
        </div>

        <!-- FILTRES DE CERCAT I TAULA DE REPORTS GENERAL -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- BARRA DE FILTRES ENRIQUIDA -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                Filtres de Cerca
              </h3>
              <input
                type="text"
                v-model="cercaText"
                placeholder="Cerca per nom, descripció o aula..."
                class="w-full sm:w-72 bg-slate-50 dark:bg-slate-700/50 border border-slate-250 dark:border-slate-650 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div class="flex flex-wrap gap-3 items-center">
              <!-- Filtre Categoria -->
              <select
                v-model="filtreCategoria"
                class="bg-slate-50 dark:bg-slate-700 border border-slate-250 dark:border-slate-650 rounded-xl px-4 py-2.5 text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="totes">Totes les categories</option>
                <option value="ordinador">Ordinadors</option>
                <option value="projector">Projectors</option>
                <option value="climatitzacio">Climatització</option>
                <option value="infraestructura">Infraestructura</option>
                <option value="altres">Altres</option>
              </select>

              <!-- Filtre Estat -->
              <select
                v-model="filtreEstat"
                class="bg-slate-50 dark:bg-slate-700 border border-slate-250 dark:border-slate-650 rounded-xl px-4 py-2.5 text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="tots">Tots els estats</option>
                <option value="pendent">Pendents</option>
                <option value="en_proces">En Resolució</option>
                <option value="resolta">Resoltes</option>
              </select>

              <!-- Filtre Prioritat -->
              <select
                v-model="filtrePrioritat"
                class="bg-slate-50 dark:bg-slate-700 border border-slate-250 dark:border-slate-650 rounded-xl px-4 py-2.5 text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="totes">Totes les prioritats</option>
                <option value="baixa">Baixa</option>
                <option value="mitjana">Mitjana</option>
                <option value="alta">Alta</option>
              </select>

              <button
                v-if="cercaText || filtreCategoria !== 'totes' || filtreEstat !== 'tots' || filtrePrioritat !== 'totes'"
                @click="netejarFiltres"
                class="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-955/20 px-3.5 py-2.5 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
              >
                Netejar Filtres
              </button>
            </div>
          </div>

          <!-- LLISTAT DE REPORTS -->
          <div class="targeta-campus !p-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl rounded-3xl">
            <div v-if="carregant" class="py-24 text-center text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Sincronitzant tauler de reports...
            </div>

            <div v-else-if="incidenciesFiltrades.length === 0" class="py-24 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center justify-center">
              <p class="text-xs font-black uppercase tracking-widest">Cap report trobat</p>
              <p class="text-[9px] text-slate-400 uppercase mt-1">No hi ha incidències amb els filtres aplicats.</p>
            </div>

            <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/80 bg-white dark:bg-slate-800">
              <div
                v-for="inc in incidenciesFiltrades"
                :key="inc.id"
                class="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-750/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div class="space-y-3.5 flex-1">
                  <!-- Badges i dates -->
                  <div class="flex flex-wrap items-center gap-3">
                    <span class="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-wider border border-indigo-100/50 dark:border-indigo-900/30">
                      {{ inc.aula }}
                    </span>
                    <span :class="[obtenirEstilsEstat(inc.estat), 'px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider']">
                      {{ formatarEstat(inc.estat) }}
                    </span>
                    <span :class="[obtenirEstilsPrioritat(inc.prioritat), 'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider']">
                      {{ inc.prioritat }}
                    </span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ formatarData(inc.dataCreacio) }}</span>
                  </div>

                  <!-- Detall de l'afectació i l'alumne -->
                  <p class="text-[11px] font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                    {{ formatarCategoria(inc.categoria) }} · Reportat per: 
                    <span class="text-blue-700 dark:text-blue-400 font-bold italic">{{ inc.alumne?.nom }} {{ inc.alumne?.cognoms }}</span>
                  </p>
                  
                  <p class="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-750">
                    {{ inc.descripcio }}
                  </p>
                </div>

                <!-- ACCIONS DE PROFESSOR I ADMINISTRADOR -->
                <div class="flex gap-2.5 self-stretch md:self-auto justify-end items-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-700">
                  <button
                    v-if="inc.estat === 'pendent'"
                    @click="canviarEstat(inc.id, 'en_proces')"
                    class="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-100 dark:shadow-none cursor-pointer"
                  >
                    Iniciar Resolució
                  </button>
                  <button
                    v-if="inc.estat === 'en_proces' || inc.estat === 'pendent'"
                    @click="canviarEstat(inc.id, 'resolta')"
                    class="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-emerald-100 dark:shadow-none cursor-pointer"
                  >
                    Tancar Incidència
                  </button>
                  <span v-if="inc.estat === 'resolta'" class="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-1.5 border border-emerald-100/50 dark:border-emerald-900/30">
                    Resolt i Tancat
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

// Pestanya Planta activa
const pestanyaPlanta = ref('planta1');
const aulaSeleccionada = ref('Aula 101');
const aulaPersonalitzada = ref('');
const equipSeleccionat = ref('');
const categoriaSeleccionada = ref('ordinador');
const prioritatSeleccionada = ref('mitjana');
const descripcio = ref('');

// Llistat i estats
const incidencies = ref([]);
const carregant = ref(false);
const enviant = ref(false);

// Expandir elements en historial
const incidenciaExpandidaId = ref(null);

// Filtres docent/admin
const filtreCategoria = ref('totes');
const filtreEstat = ref('tots');
const filtrePrioritat = ref('totes');
const cercaText = ref('');

// Comprova rols per gestió
const esDocent = computed(() => {
  return props.user?.rol === 'professor' || props.user?.rol === 'admin';
});

const esAdmin = computed(() => {
  return props.user?.rol === 'admin';
});

// Aules predefinides organitzades per Planta
const aulesPerPlanta = {
  planta1: ['Aula 101', 'Aula 102'],
  planta2: ['Aula 201', 'Aula 202'],
  altres: ['Biblioteca', 'Laboratori', 'Gimnàs', 'Passadís', 'Altres']
};

const aulesFiltrades = computed(() => {
  return aulesPerPlanta[pestanyaPlanta.value] || [];
});

// categories de problemes
const llistaCategories = [
  { codi: 'ordinador', etiqueta: 'Ordinador', gradientActiu: 'bg-gradient-to-br from-blue-600 to-indigo-650' },
  { codi: 'projector', etiqueta: 'Projector', gradientActiu: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  { codi: 'climatitzacio', etiqueta: 'Climatitzacio', gradientActiu: 'bg-gradient-to-br from-cyan-550 to-blue-500' },
  { codi: 'infraestructura', etiqueta: 'Estructura', gradientActiu: 'bg-gradient-to-br from-stone-500 to-amber-800' },
  { codi: 'altres', etiqueta: 'Altres', gradientActiu: 'bg-gradient-to-br from-slate-500 to-slate-700' },
];

// Opcions de prioritat
const opcionsPrioritat = [
  { codi: 'baixa', etiqueta: 'Baixa', estilActiu: 'bg-emerald-600 border-emerald-600', ringColor: 'ring-emerald-500/20' },
  { codi: 'mitjana', etiqueta: 'Mitjana', estilActiu: 'bg-amber-500 border-amber-500', ringColor: 'ring-amber-500/20' },
  { codi: 'alta', etiqueta: 'Alta', estilActiu: 'bg-rose-600 border-rose-600', ringColor: 'ring-rose-500/20' },
];

// Suggeriments ràpids per motius
const plantillesSuggeriments = {
  ordinador: ["No s'encen", "La pantalla parpelleja", "Sense connexio a Internet", "El ratoli/teclat no respon"],
  projector: ["El llum no brilla", "Imatge molt borrosa", "No hi ha sortida d'audio", "L'HDMI falla"],
  climatitzacio: ["L'aire no refreda", "Fa molt de soroll", "El termostat no s'encen"],
  infraestructura: ["Cadira o taula trencada", "La finestra no tanca", "Endoll danyat", "Porta bloquejada"],
  altres: ["Falta material", "Bombeta fosa", "Problema electric global"]
};

const suggerimentsDisponibles = computed(() => {
  return plantillesSuggeriments[categoriaSeleccionada.value] || [];
});

const mostrarPlanolInteractiu = computed(() => {
  return ['Aula 101', 'Aula 102', 'Aula 201', 'Aula 202'].includes(aulaSeleccionada.value);
});

// Observar canvis en aules per resetejar elements
watch(aulaSeleccionada, () => {
  equipSeleccionat.value = '';
});

watch(pestanyaPlanta, (novaPlanta) => {
  const aulesDePlanta = aulesPerPlanta[novaPlanta];
  if (aulesDePlanta && aulesDePlanta.length > 0) {
    aulaSeleccionada.value = aulesDePlanta[0];
  }
});

const seleccionarAula = (opcio) => {
  aulaSeleccionada.value = opcio;
  if (opcio !== 'Altres') {
    aulaPersonalitzada.value = '';
  }
};

const seleccionarEquip = (equip) => {
  equipSeleccionat.value = equip;
};

const seleccionarCategoria = (codi) => {
  categoriaSeleccionada.value = codi;
};

const afegirSuggeriment = (text) => {
  if (descripcio.value) {
    descripcio.value += `, ${text.toLowerCase()}`;
  } else {
    descripcio.value = text;
  }
};

const commutarIncidencia = (id) => {
  if (incidenciaExpandidaId.value === id) {
    incidenciaExpandidaId.value = null;
  } else {
    incidenciaExpandidaId.value = id;
  }
};

const formulariModificat = computed(() => {
  return aulaSeleccionada.value !== 'Aula 101' || 
         aulaPersonalitzada.value !== '' || 
         equipSeleccionat.value !== '' || 
         categoriaSeleccionada.value !== 'ordinador' || 
         prioritatSeleccionada.value !== 'mitjana' || 
         descripcio.value !== '';
});

const netejarFormulari = () => {
  pestanyaPlanta.value = 'planta1';
  aulaSeleccionada.value = 'Aula 101';
  aulaPersonalitzada.value = '';
  equipSeleccionat.value = '';
  categoriaSeleccionada.value = 'ordinador';
  prioritatSeleccionada.value = 'mitjana';
  descripcio.value = '';
};

const netejarFiltres = () => {
  filtreCategoria.value = 'totes';
  filtreEstat.value = 'tots';
  filtrePrioritat.value = 'totes';
  cercaText.value = '';
};

// Envia incidència registrada
const enviarIncidencia = async () => {
  if (descripcio.value.length < 10) return;
  
  enviant.value = true;
  const token = localStorage.getItem('access_token');
  
  // Confecciona ubicació final
  let llocFinal = aulaSeleccionada.value === 'Altres' ? aulaPersonalitzada.value : aulaSeleccionada.value;
  if (mostrarPlanolInteractiu.value && equipSeleccionat.value) {
    llocFinal = `${aulaSeleccionada.value} (${equipSeleccionat.value})`;
  }

  try {
    const resposta = await fetch(`${API_BASE_URL}/incidencies/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        aula: llocFinal,
        categoria: categoriaSeleccionada.value,
        prioritat: prioritatSeleccionada.value,
        descripcio: descripcio.value,
      }),
    });

    if (resposta.ok) {
      netejarFormulari();
      await carregarDades();
    }
  } catch (error) {
    console.error('Error tramitant report:', error);
  } finally {
    enviant.value = false;
  }
};

// Modificació de l'estat (Docent o Admin)
const canviarEstat = async (id, nouEstat) => {
  const token = localStorage.getItem('access_token');

  try {
    const resposta = await fetch(`${API_BASE_URL}/incidencies/canviar-estat/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estat: nouEstat,
      }),
    });

    if (resposta.ok) {
      await carregarDades();
    }
  } catch (error) {
    console.error('Error modificant estat incidència:', error);
  }
};

// Carrega llistats de backend
const carregarDades = async () => {
  carregant.value = true;
  const token = localStorage.getItem('access_token');
  const endpoint = esDocent.value ? 'llistat' : 'meves';

  try {
    const resposta = await fetch(`${API_BASE_URL}/incidencies/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.ok) {
      incidencies.value = await resposta.json();
    }
  } catch (error) {
    console.error('Error recollint incidències:', error);
  } finally {
    carregant.value = false;
  }
};

// KPIs Estadístics globals
const estadistiques = computed(() => {
  return {
    total: incidencies.value.length,
    pendents: incidencies.value.filter((i) => i.estat === 'pendent').length,
    proces: incidencies.value.filter((i) => i.estat === 'en_proces').length,
    resoltes: incidencies.value.filter((i) => i.estat === 'resolta').length,
  };
});

// Punts calents: Aules actives amb incidències sense tancar
const puntsCalentsAules = computed(() => {
  const aulesComptador = {};
  
  incidencies.value.forEach((inc) => {
    if (inc.estat !== 'resolta') {
      const nomNetAula = inc.aula.split(' ')[0] + (inc.aula.split(' ')[1] ? ' ' + inc.aula.split(' ')[1] : '');
      aulesComptador[nomNetAula] = (aulesComptador[nomNetAula] || 0) + 1;
    }
  });

  return Object.entries(aulesComptador)
    .map(([aula, total]) => ({ aula, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
});

// Percentatge de queixes per tipus d'afectació
const percentatgeMotius = computed(() => {
  if (incidencies.value.length === 0) return {};
  const comptador = {
    Ordinadors: 0,
    Projectors: 0,
    Clima: 0,
    Estructura: 0,
    Altres: 0
  };

  incidencies.value.forEach((inc) => {
    if (inc.categoria === 'ordinador') comptador.Ordinadors++;
    else if (inc.categoria === 'projector') comptador.Projectors++;
    else if (inc.categoria === 'climatitzacio') comptador.Clima++;
    else if (inc.categoria === 'infraestructura') comptador.Estructura++;
    else comptador.Altres++;
  });

  const totals = incidencies.value.length;
  return {
    Ordinadors: Math.round((comptador.Ordinadors / totals) * 100),
    Projectors: Math.round((comptador.Projectors / totals) * 100),
    Clima: Math.round((comptador.Clima / totals) * 100),
    Estructura: Math.round((comptador.Estructura / totals) * 100),
    Altres: Math.round((comptador.Altres / totals) * 100)
  };
});

// Filtres actius del tauler
const incidenciesFiltrades = computed(() => {
  return incidencies.value.filter((inc) => {
    const coincideixCategoria = filtreCategoria.value === 'totes' || inc.categoria === filtreCategoria.value;
    const coincideixEstat = filtreEstat.value === 'tots' || inc.estat === filtreEstat.value;
    const coincideixPrioritat = filtrePrioritat.value === 'totes' || inc.prioritat === filtrePrioritat.value;
    
    // Cerca lliure de text
    let coincideixText = true;
    if (cercaText.value.trim()) {
      const cercaNeta = cercaText.value.toLowerCase();
      const descripcioNeta = inc.descripcio?.toLowerCase() || '';
      const aulaNeta = inc.aula?.toLowerCase() || '';
      const nomAlumne = `${inc.alumne?.nom} ${inc.alumne?.cognoms}`.toLowerCase();
      coincideixText = descripcioNeta.includes(cercaNeta) || 
                       aulaNeta.includes(cercaNeta) || 
                       nomAlumne.includes(cercaNeta);
    }

    return coincideixCategoria && coincideixEstat && coincideixPrioritat && coincideixText;
  });
});

// Formatadors i mètodes d'estils
const formatarData = (dataText) => {
  if (!dataText) return '';
  const d = new Date(dataText);
  return d.toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatarEstat = (estat) => {
  const estats = {
    pendent: 'Pendent',
    en_proces: 'En resolucio',
    resolta: 'Resolta',
  };
  return estats[estat] || estat;
};

const formatarCategoria = (cat) => {
  const categories = {
    ordinador: 'Ordinador',
    projector: 'Projector',
    climatitzacio: 'Climatitzacio',
    infraestructura: 'Infraestructura',
    altres: 'Altres categories',
  };
  return categories[cat] || cat;
};

const obtenirEstilsEstat = (estat) => {
  const estils = {
    pendent: 'bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30',
    en_proces: 'bg-blue-50 dark:bg-blue-955/20 text-blue-650 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30',
    resolta: 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
  };
  return estils[estat] || 'bg-slate-50 text-slate-655';
};

const obtenirEstilsPrioritat = (prio) => {
  const estils = {
    baixa: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20',
    mitjana: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20',
    alta: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/20',
  };
  return estils[prio] || 'bg-slate-100 text-slate-500';
};

onMounted(async () => {
  await carregarDades();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
