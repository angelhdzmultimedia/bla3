
       import {container} from 'hardwired'
       import {SharedStore} from '../shared.store'

      export const useShared = () => container.use(SharedStore.providers) 
      
      
      