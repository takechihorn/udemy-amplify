<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">NavBar</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item @click="$router.push('/')">Home</b-nav-item>
            <b-nav-item @click="$router.push('dataStore')"
              >DataStore</b-nav-item
            >
            <b-nav-item @click="$router.push('graphQl')">GraphQl</b-nav-item>
            <b-nav-item @click="$router.push('storage')">Storage</b-nav-item>
            <b-nav-item @click="$router.push('authentication')"
              >Authentication</b-nav-item
            >
            <b-nav-item @click="$router.push('restApi')">RestApi</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
