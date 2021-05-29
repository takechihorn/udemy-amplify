<template>
  <b-container align="center">
    <b-card>
      <amplify-authenticator>
        <amplify-sign-out></amplify-sign-out>
      </amplify-authenticator>
    </b-card>
    <b-card style="max-width: 40rem">
      <b-card
        align="right"
        sub-title="Get logged in user information"
        class="text-center"
      >
        <b-card-text>
          Get logged in user information such as username and email address
        </b-card-text>
        <b-button variant="primary" type="button" @click="getCurrentUSerInfo()"
          >Get user info</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Create a DataStore object"
        class="text-center mt-3"
      >
        <b-card-text>
          Creates a DataStore object for the logged in user. Enter the value for
          the description field
        </b-card-text>
        <b-form-input
          v-model="todo.description"
          placeholder="Enter description"
        ></b-form-input>
        <b-button variant="primary" @click="createDataStoreTodo()" class="mt-3"
          >Create datastore object</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Get a single DataStore object"
        class="text-center mt-3"
      >
        <b-card-text>
          Get a single DataStore object based on the description field value.
          Enter part of the description field to query
        </b-card-text>
        <b-form-input
          v-model="todo.description"
          placeholder="Enter description term"
        ></b-form-input>
        <b-button
          variant="primary"
          @click="getSingleDatastoreObject()"
          class="mt-3"
          >Get datastore object</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Delete a single DataStore object"
        class="text-center mt-3"
      >
        <b-card-text>
          Delete a single DatStore object. Enter DataStore object ID to delete
        </b-card-text>
        <b-form-input
          v-model="todo.id"
          placeholder="Enter ID here"
        ></b-form-input>

        <b-button
          variant="danger"
          @click="deleteSingleDataStoreObject()"
          class="mt-3"
          >Delete datastore object</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Update a DataStore object"
        class="text-center mt-3"
      >
        <b-card-text>
          Update a DataStore object. Enter the object to update's ID and the new
          description value
        </b-card-text>
        <b-form-input
          v-model="todo.id"
          placeholder="Enter id here"
        ></b-form-input>
        <b-form-input
          v-model="todo.description"
          placeholder="Enter new description here"
          class="mt-3"
        ></b-form-input>
        <b-button
          variant="warning"
          @click="updateSingleDataStoreObject()"
          class="mt-3"
          >Update datastore object</b-button
        >
      </b-card>

      <b-card
        align="right"
        sub-title="List all DataStore objects"
        class="text-center mt-3"
      >
        <b-button variant="primary" @click="listDataStoreTodos()" class="mt-3"
          >List all DataStore objects</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Delete all DataStore objects"
        class="text-center mt-3"
      >
        <b-button variant="danger" @click="deleteAllDataStoreTodo()">
          Delete all data store objects
        </b-button>
      </b-card>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Auth, Hub } from "aws-amplify";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Todo } from "../models";
import { Unsubscribable } from "rxjs";
import { userInfo } from "../../interfaces/types";

export default Vue.extend({
  name: "App",
  created() {
    console.log("in created()...");
    this.subscribe();
  },
  mounted() {
    const listener = (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("user signed in");
          // subscribe
          if (!this.subscription) {
            console.log("-- subscibing...");
            this.subscribe();
          } else {
            console.log("-- already subscribed...");
          }
          // to populate local storage
          this.listDataStoreTodos();
          break;
        case "signUp":
          console.log("user signed up");
          break;
        case "signOut":
          console.log("user signed out");
          this.clearLocalStore();
          break;
        case "signIn_failure":
          console.log("user sign in failed");
          break;
        case "configured":
          console.log("the Auth module is configured");
      }
    };
    Hub.listen("auth", listener);
  },
  data() {
    return {
      subscription: {} as Unsubscribable,
      userInfo: {} as userInfo,
      todo: {
        description: "",
        name: "",
        id: "",
      },
      todos: [],
    };
  },
  methods: {
    subscribe() {
      console.log("in subscribe()....");
      this.subscription = DataStore.observe(Todo).subscribe((msg) => {
        console.log(msg.model, msg.opType, msg.element);
      });
    },
    async clearLocalStore() {
      console.log("clear local store....");
      try {
        await DataStore.clear();
        console.log("cleared local storage");
      } catch (err) {
        console.log(
          "clear local storage error: " + JSON.stringify(err, null, 2)
        );
      }
    },
    deleteAllDataStoreTodo() {
      DataStore.delete(Todo, Predicates.ALL)
        .then(() => {
          console.log("all dataStore todos deleted!");
        })
        .catch((error) => {
          console.log("delete error: " + JSON.stringify(error, null, 2));
        });
    },
    async createDataStoreTodo() {
      console.log("in createDataStoreToDo...");
      try {
        let userInfo = await Auth.currentUserInfo();

        if (userInfo.username) {
          console.log(
            "current user information: " + JSON.stringify(userInfo, null, 2)
          );
          this.userInfo = userInfo;
        } else {
          console.log("No user info - not logged in?");
        }

        if (this.userInfo != null) {
          console.log(
            "we have saved user info..." +
              JSON.stringify(this.userInfo, null, 2)
          );
          try {
            var result = await DataStore.save(
              new Todo({
                name: this.userInfo.username,
                description: this.todo.description,
                sub: this.userInfo.attributes.sub,
                email: this.userInfo.attributes.email,
              })
            );
            console.log(
              "datastore object saved: " + JSON.stringify(result, null, 2)
            );
            this.todo.description = "";
          } catch (err) {
            console.log(
              "datastore object error: " + JSON.stringify(err, null, 2)
            );
          }
        } else {
          console.log("no saved user info....");
        }
      } catch (err) {
        console.log("error getting user info: " + JSON.stringify(err, null, 2));
      }
    },
    async updateSingleDataStoreObject() {
      console.log("updateSingleDataStoreObject(), ID: " + this.todo.id);

      const original: any = await DataStore.query(Todo, this.todo.id);
      let result = await DataStore.save(
        Todo.copyOf(original, (updated) => {
          updated.description = this.todo.description;
        })
      );
      console.log("update result: " + JSON.stringify(result, null, 2));
      // reset fields
      this.todo.description = "";
      this.todo.id = "";
    },
    async deleteSingleDataStoreObject() {
      console.log("deleting item, id: " + this.todo.id);
      try {
        const todoDelete: any = await DataStore.query(Todo, this.todo.id);
        let result = DataStore.delete(todoDelete);
        console.log(
          "delete success, deleted item: " + JSON.stringify(result, null, 2)
        );
        this.todo.id = "";
      } catch (err) {
        console.log("delete error: " + JSON.stringify(err, null, 2));
      }
    },
    async getSingleDatastoreObject() {
      console.log(
        "in getSingleDatastoreObject() for ..." + this.todo.description
      );
      try {
        const item = await DataStore.query(Todo, (todo) =>
          todo.description("contains", this.todo.description)
        );
        console.log("list selected todos: " + JSON.stringify(item, null, 2));
        this.todo.description = "";
      } catch (err) {
        console.log(
          "list selected todos errors: " + JSON.stringify(err, null, 2)
        );
      }
    },
    async listDataStoreTodos() {
      try {
        // const todos = await DataStore.query(Todo, Predicates.ALL);
        const todos: any = await DataStore.query(Todo);
        this.todos = todos;
        console.log("list all todos: " + JSON.stringify(todos, null, 2));
      } catch (err) {
        console.log("list all todos errors: " + JSON.stringify(err, null, 2));
      }
    },
    async getCurrentUSerInfo() {
      console.log("in getCurrentUSerInfo()");
      try {
        var currentUser = await Auth.currentUserInfo();
        if (currentUser.username) {
          console.log(
            "current user information: " + JSON.stringify(currentUser, null, 2)
          );
          this.userInfo = currentUser;
        } else {
          console.log(
            "No user info - not logged in? - used saved info?" +
              JSON.stringify(this.userInfo, null, 2)
          );
        }
      } catch (err) {
        console.log(
          "current user information error: " + JSON.stringify(err, null, 2)
        );
      }
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
