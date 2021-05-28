<template>
  <b-container>
    <b-card>
      <amplify-authenticator v-if="authState !== 'signedin'">
        <amplify-sign-in
          header-text="My Custom Sign In Text"
          slot="sign-in"
          :form-fields.prop="formFields"
        ></amplify-sign-in>
        <amplify-sign-up
          header-text="My Custom Sign Up Text"
          slot="sign-up"
          :form-fields.prop="formFields"
        ></amplify-sign-up>
      </amplify-authenticator>
      <div v-if="authState === 'signedin' && user">
        <!-- <amplify-greetings :username="user.username"></amplify-greetings> -->
        <!-- <amplify-sign-out button-text="Custom Text"></amplify-sign-out> -->
        <div>Hello user, {{ user.username }} have a happy day!</div>
        <amplify-sign-out></amplify-sign-out>
      </div>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  onAuthUIStateChange,
  AuthState,
  CognitoUserInterface,
} from "@aws-amplify/ui-components";

export default Vue.extend({
  name: "Home",
  components: {},

  data() {
    return {
      unsubscribeAuth: undefined,
      // eslint-disable-next-line @typescript-eslint/ban-types
      user: null as CognitoUserInterface | null,
      authState: {} as AuthState,
      formFields: [
        {
          type: "username",
          label: "Custom username Label",
          placeholder: "custom username placeholder",
          required: true,
        },
        {
          type: "password",
          label: "Custom Password Label",
          placeholder: "custom password placeholder",
          required: true,
        },
      ],
    };
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
    });
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  },
});
</script>

<style>
amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: auto;
}
</style>
