Vue.component('x-progress',{
	template:`<div class="weui-progress">
    <div class="weui-progress__bar">
      <div class="weui-progress__inner-bar" :style="{width: percent + '%'}"></div>
    </div>
  </div>`,
  name: 'x-progress',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  }
});