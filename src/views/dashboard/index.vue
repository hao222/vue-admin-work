<template>
  <div class="dashboard-container">
    <h1>当前登录用户：{{ name }}</h1>
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      name: this.$store.state.user.name,
      currentRole: 'adminDashboard'
    }
  },
  computed: {
  },
  created() {
  }
}
</script>
