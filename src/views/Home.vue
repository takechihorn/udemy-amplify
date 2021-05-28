<template>
  <b-container>
    <div>
      <b-row>
        <b-card align-h="center">
          <amplify-authenticator>
            <amplify-sign-out></amplify-sign-out>
          </amplify-authenticator>
        </b-card>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {},
});
</script>
