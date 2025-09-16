import { defineLayer } from "./src/shared/utils"


export default [
  defineLayer({
  name: 'app',
  templates: {
    
  }
}),

  defineLayer({
    name: 'auth',
    group: 'infrastructure',
    templates: {
      
    }
  }),

   defineLayer({
    name: 'theme',
    group: 'infrastructure',
    templates: {
      
    }
  }),

   defineLayer({
    name: 'user',
    group: 'domain',
    templates: {
      
    }
  }),

   defineLayer({
    name: 'shared',
    templates: {
    
    }
  }),

  defineLayer({
    name: 'email',
    group: 'infrastructure',
    templates: {
      server: {
        api: {
          '/email/send': {method: 'POST'}
        }
      }
    }
  }),
]

