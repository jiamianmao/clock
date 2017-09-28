<template>
  <div id="app">
    <router-view :s_data="s_data"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      s_data : {}
    }
  }
}
</script>

<style>
</style>
