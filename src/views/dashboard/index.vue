<template>
  <div class="dashboard-container">
    <h1>当前登录用户：{{ name }}</h1>
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'
import { getName } from '@/utils/auth'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      name: getName(),
      currentRole: 'adminDashboard'
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>
