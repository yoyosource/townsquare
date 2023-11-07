<template>
  <Modal v-if="modals.comms" @close="toggleModal('comms')">
    <h3>
      Messages
    </h3>
    <ul class="messages">
      <li v-for="message in messages" :key="message.id">
        <span class="sender">{{ message.sender }}</span>
        <span class="payload">{{ message.payload }}</span>
      </li>
    </ul>
    <textarea></textarea>
  </Modal>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Modal from "./Modal";
import Token from "../Token";

export default {
  components: { Token, Modal },
  computed: {
    ...mapState(["modals", "messages", "grimoire"]),
  },
  methods: {
    sendMessage(role) {
      this.$store.commit("players/setFabled", {
        fabled: role
      });
      this.$store.commit("toggleModal", "fabled");
    },
    ...mapMutations(["toggleModal"])
  }
};
</script>

<style scoped lang="scss">
@import "../../vars.scss";

ul.tokens li {
  border-radius: 50%;
  width: 8vw;
  margin: 0.5%;
  transition: transform 500ms ease;

  &:hover {
    transform: scale(1.2);
    z-index: 10;
  }
}
</style>
