<template>
  <Modal class="editions" v-if="modals.edition" @close="toggleModal('edition')">
    <div v-if="!isCustom">
      <h3>Select an edition:</h3>
      <ul class="editions">
        <li
          v-for="edition in editions"
          class="edition"
          :class="['edition-' + edition.id]"
          :style="{
            backgroundImage: `url(${require(
              '../../assets/editions/' + edition.id + '.webp',
            )})`,
          }"
          :key="edition.id"
          @click="setEdition(edition)"
        >
          {{ edition.name }}
        </li>
        <li
          class="edition edition-custom"
          @click="isCustom = true"
          :style="{
            backgroundImage: `url(${require('../../assets/editions/custom.webp')})`,
          }"
        >
          Custom Script / Characters
        </li>
      </ul>
    </div>
    <div class="custom" v-else>
      <h3>Load custom script / characters</h3>
      To write your own custom script, you need to select the characters you want
      to play with in the official
      <a href="https://script.bloodontheclocktower.com/" target="_blank"
        >Script Tool</a
      >
      and then upload the generated JSON either directly here or
      provide a URL to such a hosted JSON file. There are also a multitude of
      existing popular custom scripts, many of which can be found at
      <a href="https://botcscripts.com/?sort=num_favs" target="_blank"
      >botcscripts.com</a
      >.<br />
      <br />
      To play with custom characters, please read
      <a
        href="https://github.com/nicholas-eden/townsquare#custom-character-support"
        target="_blank"
        >the documentation</a
      >
      on how to write a custom character definition file.
      <b>Only load custom JSON files from sources that you trust!</b>
      <h3>Some popular custom scripts:</h3>
      <ul class="scripts">
        <li
          v-for="(script, index) in scripts"
          :key="index"
          @click="handleURL(script[1])"
        >
          {{ script[0] }}
        </li>
      </ul>
      <input
        type="file"
        ref="upload"
        accept="application/json"
        @change="handleUpload"
      />
      <div class="button-group">
        <div class="button" @click="openUpload">
          <font-awesome-icon icon="file-upload" /> Upload JSON
        </div>
        <div class="button" @click="promptURL">
          <font-awesome-icon icon="link" /> Enter URL
        </div>
        <div class="button" @click="readFromClipboard">
          <font-awesome-icon icon="clipboard" /> Use JSON from Clipboard
        </div>
        <div class="button" @click="isCustom = false">
          <font-awesome-icon icon="undo" /> Back
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import editionJSON from "../../editions";
import { mapMutations, mapState } from "vuex";
import Modal from "./Modal";

export default {
  components: {
    Modal,
  },
  data: function () {
    return {
      editions: editionJSON,
      isCustom: false,
      scripts: [
        [
          "No Greater Joy by Steven Medway (Teensyville)",
          "https://gist.githubusercontent.com/tomozbot/fd7297327b907031a8b959e77c253ed2/raw/ee4269bae8ab710d96c36f86049abe033226a2a6/No%2520Greater%2520Joy.json",
        ],
        [
          "Laissez un Faire by Steven Medway (Teensyville)",
          "https://gist.githubusercontent.com/tomozbot/d602aedacf4c60d61ea926f642d5a685/raw/23f8ddccb8599f156dda10f129f6e8bb98ff824f/Laissez%2520un%2520Faire.json",
        ],
        [
          "Catfishing by Emily",
          "https://gist.githubusercontent.com/tomozbot/9ec44c1bb04c3c6450301faf5838e85a/raw/2e19d1ace38d9b682f58bd6704b06826cb29478a/Catfishing.json",
        ],
        [
          "Boozling by Lau",
          "https://gist.githubusercontent.com/tomozbot/5e91a5a9753e149144804f56d1719fc2/raw/90772eaee733308c4eaa0cc0876964531e9f425d/Boozling.json",
        ],
        [
          "Extension Cord by Viva La Sam",
          "https://gist.githubusercontent.com/tomozbot/d2062e520b610552fe7a7c69e3bb972a/raw/d53ea3a7ae10fc4f96f3a4062ea9963e4dc38c30/Extension%2520Cord.json",
        ],
        [
          "Harold Holt's Revenge by Theo",
          "https://gist.githubusercontent.com/tomozbot/8e18fb42ff5ac592b8f1ffc254292440/raw/361f637550429bdeca9c0ad28794789285817336/Harold%2520Holt's%2520Revenge.json",
        ],
      ],
    };
  },
  computed: mapState(["modals"]),
  methods: {
    openUpload() {
      this.$refs.upload.click();
    },
    handleUpload() {
      const file = this.$refs.upload.files[0];
      if (file && file.size) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          try {
            const roles = JSON.parse(reader.result);
            this.parseRoles(roles);
          } catch (e) {
            console.log(e);
            alert("Error reading custom script: " + e.message);
          }
          this.$refs.upload.value = "";
        });
        reader.readAsText(file);
      }
    },
    promptURL() {
      const url = prompt("Enter URL to a custom-script.json file");
      if (url) {
        this.handleURL(url);
      }
    },
    async handleURL(url) {
      const res = await fetch(url);
      if (res && res.json) {
        try {
          const script = await res.json();
          this.parseRoles(script);
        } catch (e) {
          console.log(e);
          alert("Error loading custom script: " + e.message);
        }
      }
    },
    async readFromClipboard() {
      const text = await navigator.clipboard.readText();
      try {
        const roles = JSON.parse(text);
        this.parseRoles(roles);
      } catch (e) {
        console.log(e);
        alert("Error reading custom script: " + e.message);
      }
    },
    parseRoles(roles) {
      if (!roles || !roles.length) return;
      roles = roles.map((role) =>
        typeof role === "string" ? { id: role } : role,
      );
      const metaIndex = roles.findIndex(({ id }) => id === "_meta");
      let meta = {};
      if (metaIndex > -1) {
        meta = roles.splice(metaIndex, 1).pop();
      }
      if (meta.firstNight) {
        meta.firstNight = meta.firstNight.map((id) => this.$store.getters.clean(id));
      }
      if (meta.otherNight) {
        meta.otherNight = meta.otherNight.map((id) => this.$store.getters.clean(id));
      }
      this.$store.commit("setCustomRoles", roles);
      this.$store.commit(
        "setEdition",
        Object.assign({}, meta, { id: "custom" }),
      );
      // check for fabled and set those too, if present
      if (roles.some((role) => this.$store.state.fabled.has(role.id || role))) {
        const fabled = [];
        roles.forEach((role) => {
          if (this.$store.state.fabled.has(role.id || role)) {
            fabled.push(this.$store.state.fabled.get(role.id || role));
          }
        });
        this.$store.commit("players/setFabled", { fabled });
      }
      this.isCustom = false;
    },
    ...mapMutations(["toggleModal", "setEdition"]),
  },
};
</script>

<style scoped lang="scss">
ul.editions .edition {
  font-family: PiratesBay, sans-serif;
  letter-spacing: 1px;
  text-align: center;
  padding-top: 20%;
  background-position: center center;
  background-size: 80% auto;
  background-repeat: no-repeat;
  width: 45%;
  margin: 5px;
  font-size: 120%;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000,
    0 0 5px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  &:hover {
    color: red;
  }
}

.custom {
  text-align: center;
  input[type="file"] {
    display: none;
  }
  .scripts {
    list-style-type: disc;
    font-size: 120%;
    cursor: pointer;
    display: block;
    width: 50%;
    text-align: left;
    margin: 10px auto;
    li:hover {
      color: red;
    }
  }
}
</style>
