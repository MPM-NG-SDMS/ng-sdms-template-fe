import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

// Create a composable to check if the current device is mobile
export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  // 'sm' is the Tailwind mobile breakpoint (640px)
  const isMobile = breakpoints.smaller('sm')
  return { isMobile }
}
