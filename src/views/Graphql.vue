<template>
  <b-container align="center">
    <b-card>
      <amplify-authenticator>
        <amplify-sign-out></amplify-sign-out>
      </amplify-authenticator>
    </b-card>
    <b-card style="max-width: 40rem">
      <b-card>
        <h3>GraphQl</h3>
      </b-card>
      <b-card
        align="right"
        sub-title="Get logged in user information"
        class="text-center mt-3"
      >
        <b-card-text>
          Get logged in user information such as username and email address
        </b-card-text>
        <b-button variant="success" type="button" @click="getCurrentUSerInfo()"
          >Get user info</b-button
        >
      </b-card>
      <b-card align="right" sub-title="Add Restaurant" class="text-center mt-3">
        <b-card-text>
          Add a restaurant by filling in the following details:
        </b-card-text>
        <b-form-input
          v-model="restaurant.name"
          placeholder="Enter Restaurant name"
        ></b-form-input>

        <b-form-input
          v-model="restaurant.description"
          placeholder="Enter Restaurant description"
          class="mt-3"
        ></b-form-input>

        <b-form-input
          v-model="restaurant.city"
          placeholder="Enter Restaurant city"
          class="mt-3"
        ></b-form-input>

        <b-button variant="warning" @click="addRestaurant()" class="mt-3"
          >Add restaurant</b-button
        >
      </b-card>

      <b-card align="right" sub-title="Get a restaurant" class="text-center">
        <b-card-text>
          Get a restaurant entry by entering the restaurant record id below:
        </b-card-text>
        <b-form-input
          v-model="restaurant.id"
          placeholder="Enter Restaurant id"
        ></b-form-input>
        <b-button
          variant="success"
          type="button"
          @click="getRestaurant()"
          class="mt-3"
          >Get this restaurant</b-button
        >
      </b-card>

      <b-card
        align="right"
        sub-title="List all restaurants"
        class="text-center"
      >
        <b-card-text> List all the restaurants in the database </b-card-text>
        <b-button variant="success" type="button" @click="listAllRestaurants()"
          >List all restaurants</b-button
        >
      </b-card>

      <b-card align="right" sub-title="Update a restaurant" class="text-center">
        <b-card-text>
          Update a restaurant entry by entering the restaurant details below:
        </b-card-text>
        <b-form-input
          v-model="restaurant.id"
          placeholder="Enter Restaurant id"
        ></b-form-input>
        <b-form-input
          v-model="restaurant.name"
          placeholder="Enter Restaurant name"
          class="mt-3"
        ></b-form-input>

        <b-form-input
          v-model="restaurant.description"
          placeholder="Enter Restaurant description"
          class="mt-3"
        ></b-form-input>

        <b-form-input
          v-model="restaurant.city"
          placeholder="Enter Restaurant city"
          class="mt-3"
        ></b-form-input>
        <b-button
          variant="warning"
          type="button"
          @click="updateRestaurant()"
          class="mt-3"
          >Update this restaurant</b-button
        >
      </b-card>

      <b-card align="right" sub-title="Delete a restaurant" class="text-center">
        <b-card-text>
          Delete a restaurant entry by entering the restaurant record id below:
        </b-card-text>
        <b-form-input
          v-model="restaurant.id"
          placeholder="Enter Restaurant id"
        ></b-form-input>
        <b-button
          variant="danger"
          type="button"
          @click="deleteRestaurant()"
          class="mt-3"
          >Delete this restaurant</b-button
        >
      </b-card>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { API, graphqlOperation } from "aws-amplify";
import { listRestaurants } from "../graphql/queries";
import { createRestaurant } from "../graphql/mutations";
import { deleteRestaurant } from "../graphql/mutations";
// import * as queries from "../graphql/queries";
import { getRestaurant } from "../graphql/queries";

import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import { Auth } from "aws-amplify";
import { userInfo } from "../../interfaces/types";

export default Vue.extend({
  name: "GraphQl",
  components: {},
  created() {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateRestaurant)
    ) as any;
    subscription.subscribe({
      next: (restaurantData) =>
        console.log(
          "something happened...." + JSON.stringify(restaurantData, null, 2)
        ),
    });
  },
  destroyed() {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateRestaurant)
    ) as any;
    subscription.unsubscribe();
  },
  data() {
    return {
      userInfo: {} as userInfo,

      restaurant: {
        id: "",
        clientId: "",
        name: "",
        description: "",
        city: "",
      },
      restaurants: [],
    };
  },
  methods: {
    resetFields() {
      this.restaurant.id = "";
      this.restaurant.name = "";
      this.restaurant.description = "";
      this.restaurant.city = "";
    },
    async getCurrentUSerInfo() {
      console.log("in getCurrentUSerInfo()...");
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
    async addRestaurant() {
      console.log("adding a restaurant...");

      try {
        let timestamp = Date.now();
        const { name, description, city } = this.restaurant;
        const restaurant = {
          name,
          description,
          city,
          clientId: timestamp.toString(),
        };
        console.log(
          "in addRestaurant(): " + JSON.stringify(restaurant, null, 2)
        );
        const response = await API.graphql(
          graphqlOperation(createRestaurant, { input: restaurant })
        );

        console.log(
          "restaurant successfully added: " + JSON.stringify(response, null, 2)
        );
      } catch (err) {
        console.log("add restaurant error: " + JSON.stringify(err, null, 2));
      }
      this.resetFields();
    },
    async getRestaurant() {
      console.log(
        "getting a restaurant for id: " + this.restaurant.id + "   ...."
      );
      try {
        const restaurant = await API.graphql(
          graphqlOperation(getRestaurant, { id: this.restaurant.id })
          // graphqlOperation(queries.getRestaurant, { id: this.restaurant.id })
        );
        console.log("restaurant: " + JSON.stringify(restaurant, null, 2));
      } catch (err) {
        console.log("get restaurant error: " + JSON.stringify(err, null, 2));
      }
      this.resetFields();
    },
    async listAllRestaurants() {
      console.log("getting restaurant list....");
      try {
        const response = await API.graphql(graphqlOperation(listRestaurants));
        ((response: any) => {
          this.restaurants = response.data.listRestaurants.items;
        })(response);
        //上はthis.restaurants = response.data.listRestaurants.items;を示している
        console.log(
          "list of restaurants: " + JSON.stringify(this.restaurants, null, 2)
        );
      } catch (err) {
        console.log("list restaurants error: " + JSON.stringify(err, null, 2));
      }
    },
    async updateRestaurant() {
      console.log("updating a restaurant....");
      try {
        const restaurantDetails = {
          id: this.restaurant.id,
          description: this.restaurant.description,
          name: this.restaurant.name,
          city: this.restaurant.city,
        };

        const updatedRestaurant = await API.graphql(
          graphqlOperation(mutations.updateRestaurant, {
            input: restaurantDetails,
          })
        );
        console.log(
          "update restaurant: " + JSON.stringify(updatedRestaurant, null, 2)
        );
      } catch (err) {
        console.log("update restaurant error: " + JSON.stringify(err, null, 2));
      }
      this.resetFields();
    },

    async deleteRestaurant() {
      console.log("deleting a restaurant....");
      try {
        const restaurantDetails = {
          id: this.restaurant.id,
        };
        const deletedRestaurant = await API.graphql(
          graphqlOperation(deleteRestaurant, { input: restaurantDetails })
        );
        console.log(
          "deleted restaurant: " + JSON.stringify(deletedRestaurant, null, 2)
        );
      } catch (err) {
        console.log(
          "deleted restaurant error: " + JSON.stringify(err, null, 2)
        );
      }
      this.resetFields();
    },
  },
});
</script>
