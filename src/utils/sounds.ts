import whistleSound from '../assets/referee39s-whistle.mp3';

/**
 * Reproduce el sonido de silbato de árbitro desde el archivo MP3
 */
export function playWhistleSound() {
  try {
    const audio = new Audio(whistleSound);
    audio.volume = 0.8; // Ajustar volumen si es necesario
    audio.play().catch((error) => {
      console.error('Error playing whistle sound:', error);
      // En algunos navegadores, el audio necesita interacción del usuario primero
      // El error se puede ignorar si el usuario ya ha interactuado con la página
    });
  } catch (error) {
    console.error('Error creating audio element:', error);
  }
}

