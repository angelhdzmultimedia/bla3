
       import {container} from 'hardwired'
       import {UserStore} from '../user.store'

      export const useUser = () => container.use(UserStore.providers) 
      
      
      