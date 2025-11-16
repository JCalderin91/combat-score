import { ref } from 'vue';
import { trackEvent, GameEvents } from '../utils/analytics';

export interface TimelineEvent {
  id: string;
  time: number; // Tiempo en segundos desde el inicio
  type: 'point' | 'foul' | 'exit';
  player: 'A' | 'B';
  value: number; // Valor del evento (puntos, faltas, salidas)
  description: string; // Descripción legible del evento
}

// Estado compartido del panel de timeline
export const isTimelineOpen = ref(false);
export const timelineEvents = ref<TimelineEvent[]>([]);

export function useTimeline() {
  const events = timelineEvents;
  const isOpen = isTimelineOpen;

  const addEvent = (type: 'point' | 'foul' | 'exit', player: 'A' | 'B', value: number, timeElapsed: number) => {
    const event: TimelineEvent = {
      id: `${Date.now()}-${Math.random()}`,
      time: timeElapsed,
      type,
      player,
      value,
      description: getEventDescription(type, player, value),
    };
    
    events.value.push(event);
    // Ordenar por tiempo (más antiguo primero)
    events.value.sort((a: TimelineEvent, b: TimelineEvent) => a.time - b.time);
  };

  const getEventDescription = (type: 'point' | 'foul' | 'exit', player: 'A' | 'B', value: number): string => {
    const playerName = player === 'A' ? 'Peleador A' : 'Peleador B';
    const sign = value >= 0 ? '+' : '';
    const absValue = Math.abs(value);
    
    switch (type) {
      case 'point':
        return `${playerName} ${sign}${value} punto${absValue !== 1 ? 's' : ''}`;
      case 'foul':
        return `${playerName} ${sign}${value} falta${absValue !== 1 ? 's' : ''}`;
      case 'exit':
        return `${playerName} ${sign}${value} salida${absValue !== 1 ? 's' : ''}`;
      default:
        return '';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    events.value = [];
  };

  const openTimeline = () => {
    isOpen.value = true;
    trackEvent(GameEvents.TIMELINE_OPENED, {
      eventsCount: events.value.length,
    });
  };

  const closeTimeline = () => {
    isOpen.value = false;
  };

  return {
    events,
    isOpen,
    addEvent,
    formatTime,
    reset,
    openTimeline,
    closeTimeline,
  };
}

