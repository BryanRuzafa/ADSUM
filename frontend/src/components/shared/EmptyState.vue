<template>
  <div class="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 animate-fade-in">
    <div class="w-24 h-24 mb-6 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600">
      <AppIcon :name="icon" class="w-12 h-12" />
    </div>
    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ title }}</h3>
    <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  title: { type: String, default: 'Sense dades' },
  message: { type: String, default: 'No hem trobat el que estàs buscant.' },
  icon: { type: String, default: 'folder' }
});
</script>
