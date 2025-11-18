// import { createContext, useContext, useRef } from 'react'
// import { createStore, useStore } from 'zustand'

// const StoreContext = createContext(null)

// const StoreProvider = ({ children }) => {
//   const storeRef = useRef()
//   if (storeRef.current === null) {
//     storeRef.current = createStore((set) => ({
//       // ...
//     }))
//   }
//   return (
//     <StoreContext.Provider value={storeRef.current}>
//       {children}
//     </StoreContext.Provider>
//   )
// }

// const useStoreInContext = (selector) => {
//   const store = useContext(StoreContext)
//   if (!store) {
//     throw new Error('Missing StoreProvider')
//   }
//   return useStore(store, selector)
// }