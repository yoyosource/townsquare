<template>
  <Modal
    class="roles"
    v-if="modals.roles && nonTravellers >= 5"
    @close="toggleModal('roles')"
  >
    <h3>Select the characters for {{ nonTravellers }} players:</h3>
    <ul class="tokens" v-for="(teamRoles, team) in roleSelection" :key="team">
      <li class="count colored" :style="teamColor(team)" :class="[team]">
        {{ teamRoles.reduce((a, { selected }) => a + selected, 0) }} /
        {{ bagSetup[team] || 0 }}
      </li>
      <li
        v-for="role in teamRoles"
        class="colored" :style="teamColor(team)"
        :class="[role.team, role.selected ? 'selected' : '']"
        :key="role.id"
        @click="role.selected = role.selected ? 0 : 1"
      >
        <Token :role="role" />
        <font-awesome-icon icon="exclamation-triangle" v-if="role.setup" />
        <div class="buttons" v-if="allowMultiple">
          <font-awesome-icon
            icon="minus-circle"
            @click.stop="role.selected--"
          />
          <span>{{ role.selected > 1 ? "x" + role.selected : "" }}</span>
          <font-awesome-icon icon="plus-circle" @click.stop="role.selected++" />
        </div>
      </li>
    </ul>
    <label class="multiple" :class="{ checked: allowMultiple }">
      <font-awesome-icon :icon="allowMultiple ? 'check-square' : 'square'" />
      <input type="checkbox" name="allow-multiple" v-model="allowMultiple" />
      Allow duplicate characters
    </label>
    <div class="bottom">
      <div class="button-group">
        <div
          class="button"
          @click="assignRoles"
          :class="{
            disabled: selectedRoles > nonTravellers || !selectedRoles,
          }"
        >
          <font-awesome-icon icon="people-arrows" />
          Assign {{ selectedRoles }} characters randomly
        </div>
        <div class="button" @click="selectRandomRoles">
          <font-awesome-icon icon="random" />
          Shuffle characters
        </div>
      </div>
      <div class="warning" v-if="hasSelectedSetupRoles">
        <font-awesome-icon icon="exclamation-triangle" />
        <span>
          Warning: there are characters selected that modify the game setup! The
          randomizer does not account for these characters.
        </span>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import gameJSON from "./../../game";
import characterTypesJSON from "@/characterTypes";
import Token from "./../Token";
import { mapGetters, mapMutations, mapState } from "vuex";

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default {
  components: {
    Token,
    Modal,
  },
  data: function () {
    return {
      roleSelection: {},
      game: gameJSON,
      characterTypes: characterTypesJSON,
      allowMultiple: false,
    };
  },
  computed: {
    selectedRoles: function () {
      return Object.values(this.roleSelection)
        .map((roles) => roles.reduce((a, { selected }) => a + selected, 0))
        .reduce((a, b) => a + b, 0);
    },
    hasSelectedSetupRoles: function () {
      return Object.values(this.roleSelection).some((roles) =>
        roles.some((role) => role.selected && role.setup),
      );
    },
    bagSetup: function() {
      let index = Math.max(5, this.nonTravellers) - 5;
      if (this.edition.bagSetup) {
        return this.edition.bagSetup[index]
      } else {
        return this.game[index]
      }
    },
    bagSetupCharacterTypes: function() {
      let types = {};
      let bagSetups = this.edition.bagSetup ? this.edition.bagSetup : this.game;
      for (const bagSetup of bagSetups) {
        for (const team in bagSetup) {
          if (bagSetup[team] > 0) {
            types[team] = true;
          }
        }
      }
      return types;
    },
    ...mapState(["roles", "modals", "edition"]),
    ...mapState("players", ["players"]),
    ...mapGetters({ nonTravellers: "players/nonTravellers" }),
  },
  methods: {
    teamColor(team) {
      if (this.edition.characterTypes && this.edition.characterTypes[team]) {
        return { "--color": this.edition.characterTypes[team].color };
      }
      if (this.characterTypes[team]) {
        return { "--color": this.characterTypes[team].color };
      }
      return { "--color": "#ffffff" };
    },
    selectRandomRoles() {
      this.roleSelection = {};
      this.roles.forEach((role) => {
        if (!this.bagSetupCharacterTypes[role.team]) return;
        if (!this.roleSelection[role.team]) {
          this.$set(this.roleSelection, role.team, []);
        }
        this.roleSelection[role.team].push(role);
        this.$set(role, "selected", 0);
      });

      const composition = this.bagSetup;
      Object.keys(composition).forEach((team) => {
        for (let x = 0; x < composition[team]; x++) {
          if (this.roleSelection[team]) {
            const available = this.roleSelection[team].filter(
              (role) => !role.selected,
            );
            if (available.length) {
              randomElement(available).selected = 1;
            }
          }
        }
      });
    },
    assignRoles() {
      if (this.selectedRoles <= this.nonTravellers && this.selectedRoles) {
        // generate list of selected roles and randomize it
        const roles = Object.values(this.roleSelection)
          .map((roles) =>
            roles
              // duplicate roles selected more than once and filter unselected
              .reduce((a, r) => [...a, ...Array(r.selected).fill(r)], []),
          )
          // flatten into a single array
          .reduce((a, b) => [...a, ...b], [])
          .map((a) => [Math.random(), a])
          .sort((a, b) => a[0] - b[0])
          .map((a) => a[1]);
        this.players.forEach((player) => {
          if (player.role.team !== "traveller" && roles.length) {
            const value = roles.pop();
            this.$store.commit("players/update", {
              player,
              property: "role",
              value,
            });
          }
        });
        this.$store.commit("toggleModal", "roles");
      }
    },
    ...mapMutations(["toggleModal"]),
  },
  mounted: function () {
    if (!Object.keys(this.roleSelection).length) {
      this.selectRandomRoles();
    }
  },
  watch: {
    roles() {
      this.selectRandomRoles();
    },
  },
};
</script>

<style lang="scss" scoped>
ul.tokens {
  padding-left: 5%;
  li {
    border-radius: 50%;
    width: 5vw;
    margin: 5px;
    opacity: 0.5;
    transition: all 250ms;

    @media (orientation: portrait) {
      width: 7vh;
    }

    &.selected {
      opacity: 1;
      .buttons {
        display: flex;
      }
      .fa-exclamation-triangle {
        display: block;
      }
    }

    &.colored {
      box-shadow:
        0 0 10px var(--color),
        0 0 10px var(--color);
    }

    &:hover {
      transform: scale(1.2);
      z-index: 10;
    }
    .fa-exclamation-triangle {
      position: absolute;
      color: red;
      filter: drop-shadow(0 0 3px black) drop-shadow(0 0 3px black);
      top: 5px;
      right: -5px;
      font-size: 150%;
      display: none;
    }
    .buttons {
      display: none;
      position: absolute;
      top: 95%;
      text-align: center;
      width: 100%;
      z-index: 30;
      font-weight: bold;
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
      span {
        flex-grow: 1;
      }
      svg {
        opacity: 0.25;
        cursor: pointer;
        &:hover {
          opacity: 1;
          color: red;
        }
      }
    }
  }
  .count {
    opacity: 1;
    position: absolute;
    left: 0;
    font-weight: bold;
    font-size: 75%;
    width: 5%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (orientation: portrait) {
      width: 8%;
    }

    &:after {
      content: " ";
      display: block;
      padding-top: 100%;
    }

    color: var(--color)
  }
}

.roles .modal {
  .multiple {
    display: block;
    text-align: center;
    cursor: pointer;
    &.checked,
    &:hover {
      color: red;
    }
    &.checked {
      margin-top: 10px;
    }
    svg {
      margin-right: 5px;
    }
    input {
      display: none;
    }
  }

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    .warning {
      color: red;
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 10;
      svg {
        font-size: 150%;
        vertical-align: middle;
      }
      span {
        display: none;
        text-align: center;
        position: absolute;
        right: -20px;
        bottom: 30px;
        width: 420px;
        background: rgba(0, 0, 0, 0.75);
        padding: 5px;
        border-radius: 10px;
        border: 2px solid black;
      }
      &:hover span {
        display: block;
      }
    }
  }
}
</style>
