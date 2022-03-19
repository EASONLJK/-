<template>
  <div>
    <nav-menu></nav-menu>
  <router-view/>
  </div>
</template>

<script>
import NavMenu from "@/components/comment/NavMenu";
export default {
  name: "Home",
  components: {NavMenu}
}
</script>

<style scoped>

</style>