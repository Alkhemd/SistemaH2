// Declaraciones globales temporales para módulos de GSAP y @gsap/react
// Evitan errores de TypeScript por rutas de submódulos sin declaraciones.
declare module 'gsap/ScrollTrigger' {
  const ScrollTrigger: any;
  export { ScrollTrigger };
}

declare module 'gsap/SplitText' {
  export const SplitText: any;
}

declare module '@gsap/react' {
  export function useGSAP(...args: any[]): any;
}

declare module 'gsap' {
  const gsap: any;
  export { gsap };
  export default gsap;
}
