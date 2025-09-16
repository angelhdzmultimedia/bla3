
      import {cls} from 'hardwired'
      
      export class ThemeStore {
        static providers = cls.singleton(this)
        isDark = useDark({
          initialValue: 'dark'
        })

        init() {
          watchEffect(() => {
            Dark.set(this.isDark.value)
          })
        }

        toggle() {
          const toggle = useToggle(this.isDark)
          toggle()
        }

      }
      