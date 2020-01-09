const parentMixin = {
  mounted () {
    if (this.value >= 0) {
      this.currentIndex = this.value
    }
    this.updateIndex()
  },
  methods: {
    updateIndex () {
      if (!this.$children || !this.$children.length) return
      this.number = this.$children.length
      let children = this.$children
      for (let i = 0; i < children.length; i++) {
        children[i].currentIndex = i
        if (children[i].currentSelected) {
          this.index = i
        }
      }
    }
  },
  props: {
    value: Number
  },
  watch: {
    currentIndex (val, oldVal) {
      oldVal > -1 && this.$children[oldVal] && (this.$children[oldVal].currentSelected = false)
      val > -1 && this.$children[val] && (this.$children[val].currentSelected = true)
      this.$emit('input', val)
      this.$emit('on-index-change', val, oldVal)
    },
    index (val) {
      this.currentIndex = val
    },
    value (val) {
      this.index = val
    }
  },
  data () {
    return {
      index: -1,
      currentIndex: this.index,
      number: this.$children.length
    }
  }
}

const childMixin = {
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$parent.updateIndex()
  },
  beforeDestroy () {
    const $parent = this.$parent
    this.$nextTick(() => {
      $parent.updateIndex()
    })
  },
  methods: {
    onItemClick (hasLink) {
      if (this.$parent.preventDefault) {
        this.$parent.$emit('on-before-index-change', this.currentIndex)
        return
      }
      if (typeof this.disabled === 'undefined' || this.disabled === false) {
        this.currentSelected = true
        this.$parent.currentIndex = this.currentIndex
        this.$nextTick(() => {
          this.$emit('on-item-click', this.currentIndex)
        })
      }
      // if (hasLink === true) {
      //   go(this.link, this.$router)
      // }
    }
  },
  watch: {
    currentSelected (val) {
      if (val) {
        this.$parent.index = this.currentIndex
      }
    },
    selected (val) {
      this.currentSelected = val
    }
  },
  data () {
    return {
      currentIndex: -1,
      currentSelected: this.selected
    }
  }
}
//   export {
//     parentMixin,
//     childMixin
//   }


Vue.component('tab',{
	template:`<div
              class="vux-tab-wrap"
              :class="barPosition === 'top' ? 'vux-tab-bar-top' : ''">
              <div class="vux-tab-container">
                <div
                  class="vux-tab"
                  :class="[{'vux-tab-no-animate': !animate},{ scrollable }]"
                  ref="nav">
                  <slot></slot>
                  <div
                    v-if="animate"
                    class="vux-tab-ink-bar"
                    :class="barClass"
                    :style="barStyle">
                    <span
                      class="vux-tab-bar-inner"
                      :style="innerBarStyle"
                      v-if="customBarWidth"></span>
                  </div>
                </div>
              </div>
            </div>`,
    mounted () {
        // stop bar anmination on first loading
        this.$nextTick(() => {
            setTimeout(() => {
            this.hasReady = true
            }, 0)
        })
    },
    name: 'tab',
  mixins: [parentMixin],
  mounted () {
    // stop bar anmination on first loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.hasReady = true
      }, 0)
    })
  },
  props: {
    lineWidth: {
      type: Number,
      default: 3
    },
    activeColor: String,
    barActiveColor: String,
    defaultColor: String,
    disabledColor: String,
    animate: {
      type: Boolean,
      default: true
    },
    customBarWidth: [Function, String],
    preventDefault: Boolean,
    scrollThreshold: {
      type: Number,
      default: 4
    },
    barPosition: {
      type: String,
      default: 'bottom',
      validator (val) {
        return ['bottom', 'top'].indexOf(val) !== -1
      }
    }
  },
  computed: {
    barLeft () {
      if (this.hasReady) {
        const nav = this.$refs.nav
        const count = this.scrollable ? (nav.offsetWidth / this.$children[this.currentIndex || 0].$el.getBoundingClientRect().width) : this.number
        return `${this.currentIndex * (100 / count)}%`
      }
    },
    barRight () {
      if (this.hasReady) {
        const nav = this.$refs.nav
        const count = this.scrollable ? (nav.offsetWidth / this.$children[this.currentIndex || 0].$el.getBoundingClientRect().width) : this.number
        return `${(count - this.currentIndex - 1) * (100 / count)}%`
      }
    },
    // when prop:custom-bar-width
    innerBarStyle () {
      return {
        width: typeof this.customBarWidth === 'function' ? this.customBarWidth(this.currentIndex) : this.customBarWidth,
        background: this.barActiveColor || this.activeColor
      }
    },
    // end
    barStyle () {
      const commonStyle = {
        left: this.barLeft,
        right: this.barRight,
        display: 'block',
        height: this.lineWidth + 'px',
        transition: !this.hasReady ? 'none' : null
      }
      if (!this.customBarWidth) {
        commonStyle.background = this.barActiveColor || this.activeColor
      } else {
        commonStyle.background = 'transparent' // when=prop:custom-bar-width
      }
      return commonStyle
    },
    barClass () {
      return {
        'vux-tab-ink-bar-transition-forward': this.direction === 'forward',
        'vux-tab-ink-bar-transition-backward': this.direction === 'backward'
      }
    },
    scrollable () {
      return this.number > this.scrollThreshold
    }
  },
  watch: {
    currentIndex (newIndex, oldIndex) {
      this.direction = newIndex > oldIndex ? 'forward' : 'backward'
      this.$emit('on-index-change', newIndex, oldIndex)
      this.hasReady && this.scrollToActiveTab()
    }
  },
  data () {
    return {
      direction: 'forward',
      right: '100%',
      hasReady: false
    }
  },
  methods: {
    scrollToActiveTab () {
      if (!this.scrollable || !this.$children || !this.$children.length) {
        return
      }
      const currentIndexTab = this.$children[this.currentIndex].$el
      let count = 0
      // scroll animation
      const step = () => {
        const scrollDuration = 15
        const nav = this.$refs.nav
        nav.scrollLeft += (currentIndexTab.offsetLeft - (nav.offsetWidth - currentIndexTab.offsetWidth) / 2 - nav.scrollLeft) / scrollDuration
        if (++count < scrollDuration) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }
});

Vue.component('tab-item',{
	template:`<div
                class="vux-tab-item"
                :class="[currentSelected ? activeClass : '', {
                  'vux-tab-selected': currentSelected,
                  'vux-tab-disabled': disabled 
                }]"
                :style="style"
                @click="onItemClick">
                <slot></slot>
                <span
                    :style="{
                    background: badgeBackground,
                    color: badgeColor
                    }"
                    class="vux-tab-item-badge"
                    v-if="typeof badgeLabel !== 'undefined' && badgeLabel !== ''">
                {{ badgeLabel }}</span>
            </div>`,
  name: 'tab-item',
  mixins: [childMixin],
  props: {
    activeClass: String,
    disabled: Boolean,
    badgeBackground: {
      type: String,
      default: '#f74c31'
    },
    badgeColor: {
      type: String,
      default: '#fff'
    },
    badgeLabel: String
  },
  computed: {
    style () {
      return {
        borderWidth: this.$parent.lineWidth + 'px',
        borderColor: this.$parent.activeColor,
        color: this.currentSelected ? this.$parent.activeColor : this.disabled ? this.$parent.disabledColor : this.$parent.defaultColor,
        border: this.$parent.animate ? 'none' : 'auto'
      }
    }
  }
});