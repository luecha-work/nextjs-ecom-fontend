import create from 'zustand'

const useStore = create((set: any) => ({
  spin_status: true,
  language: "TH",
  timeZoneFormat: "DD/MM/YYYY",
  setIsLoading: (status: boolean) => set((state: any) => ({ spin_status: state.spin_status = status })),
  // mobile | desktop

}))

export { useStore }