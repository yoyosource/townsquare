<template>
  <Modal
    class="night-reference"
    :class="{
      storyteller: !session.isSpectator,
    }"
    @close="toggleModal('nightOrder')"
    v-if="modals.nightOrder && roles.size"
  >
    <font-awesome-icon
      @click="toggleModal('reference')"
      icon="address-card"
      class="toggle"
      title="Show Character Reference"
    />
    <h3>
      Night Order
      <br />
      <font-awesome-icon icon="cloud-moon" />
      {{ edition.name || "Custom Script" }}
    </h3>
    <div class="night">
      <ul class="first">
        <li class="headline">First Night</li>
        <li
          v-for="role in rolesFirstNight"
          :key="role.name"
          :class="[role.team]"
          class="colored"
          :style="teamColor(role.team)"
        >
          <span class="name">
            {{ role.name }}
            <span class="player" v-if="role.players.length">
              <br />
              <small
                v-for="(player, index) in role.players"
                :class="{ dead: player.isDead }"
                :key="index"
              >
                <template v-if="!session.isSpectator">
                  <div class="option" @click="setResponded(player, role.id)">
                    {{ player.name }}
                    <font-awesome-icon
                      :icon="[
                        'fas',
                        !!player.hasResponded[role.id]
                          ? 'check-square'
                          : 'square',
                      ]"
                    />
                  </div>
                </template>
                <template v-if="session.isSpectator">{{
                  player.name + (role.players.length > index + 1 ? "," : "")
                }}</template>
              </small>
            </span>
          </span>
          <span
            class="icon"
            v-if="role.id"
            :style="{
              backgroundImage: `url(${
                getImage(role)
              })`,
            }"
          ></span>
          <span class="reminder" v-if="role.firstNightReminder">
            {{ role.firstNightReminder }}
          </span>
        </li>
      </ul>
      <ul class="other">
        <li class="headline">Other Nights</li>
        <li
          v-for="role in rolesOtherNight"
          :key="role.name"
          :class="[role.team]"
          class="colored"
          :style="teamColor(role.team)"
        >
          <span
            class="icon"
            v-if="role.id"
            :style="{
              backgroundImage: `url(${
                getImage(role)
              })`,
            }"
          ></span>
          <span class="name">
            {{ role.name }}
            <span class="player" v-if="role.players.length">
              <br />
              <small
                v-for="(player, index) in role.players"
                :class="{ dead: player.isDead }"
                :key="index"
              >
                <template v-if="!session.isSpectator">
                  <div class="option" @click="setResponded(player, role.id)">
                    <font-awesome-icon
                      :icon="[
                        'fas',
                        !!player.hasResponded[role.id]
                          ? 'check-square'
                          : 'square',
                      ]"
                    />
                    {{ player.name }}
                  </div>
                </template>
                <template v-if="session.isSpectator">{{
                  player.name + (role.players.length > index + 1 ? "," : "")
                }}</template>
              </small>
            </span>
          </span>
          <span class="reminder" v-if="role.otherNightReminder">
            {{ role.otherNightReminder }}
          </span>
        </li>
      </ul>
    </div>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import { mapMutations, mapState } from "vuex";
import characterTypesJSON from "../../characterTypes.json";
import nightJSON from "../../nightsheet.json";

export default {
  components: {
    Modal,
  },
  data: function() {
    return {
      characterTypes: characterTypesJSON,
      nightOrder: nightJSON
    }
  },
  computed: {
    rolesFirstNight: function () {
      if (!this.edition.firstNight) {
        // TODO: Insert HomeBrew characters into the result
        return getNightOrderByArray(this.nightOrder.firstNight)
      } else {
        return this.getNightOrderByArray(this.edition.firstNight);
      }
    },
    rolesOtherNight: function () {
      if (!this.edition.otherNight) {
        // TODO: Insert HomeBrew characters into the result
        return getNightOrderByArray(this.nightOrder.otherNight)
      } else {
        return this.getNightOrderByArray(this.edition.otherNight);
      }
    },
    ...mapState(["roles", "otherTravellers", "modals", "edition", "grimoire", "session"]),
    ...mapState("players", ["players", "fabled"]),
  },
  methods: {
    teamColor(team) {
      if (!team) {
        return {};
      }
      if (this.edition.characterTypes && this.edition.characterTypes[team]) {
        return { "--color": this.edition.characterTypes[team].color };
      }
      if (this.characterTypes[team]) {
        return { "--color": this.characterTypes[team].color };
      }
      return { "--color": "#ffffff" };
    },
    getImage(role) {
      if (role.id === "dusk" || role.id === "dawn") {
        return require(`../../assets/${role.id}.webp`);
      }

      if (role.image && this.grimoire.isImageOptIn) {
        if (Array.isArray(role.image)) {
          return role.image[0];
        }

        return role.image;
      }

      return require('../../assets/icons/' +
        (role.imageAlt || role.id) +
        '.webp');
    },
    setResponded(player, roleId) {
      var hasResponded = { ...player.hasResponded };
      hasResponded[roleId] = !hasResponded[roleId];
      this.$store.commit("players/update", {
        player: player,
        property: "hasResponded",
        value: hasResponded,
      });
    },
    getNightOrderByArray(editionNightOrder) {
      const nightOrder = [];
      const adjustedRoles = new Map(this.roles);
      for (let role of editionNightOrder) {
        if (role === 'dusk') {
          nightOrder.push(
            {
              id: "dusk",
              name: "Dusk",
              firstNightReminder: "Some Travellers & Fabled act.",
              otherNightReminder: "Some Travellers & Fabled act.",
              players: [],
            }
          );
        } else if (role === 'dawn') {
          nightOrder.push(
            {
              id: "dawn",
              name: "Dawn",
              firstNightReminder: "Wait a few seconds, then start the day.",
              otherNightReminder: "Wait a few seconds, then start the day.",
              players: [],
            },
          );
        } else if (role === 'minioninfo') {
          nightOrder.push(
            {
              id: "minion",
              name: "Minion info",
              team: "minion",
              players: this.players.filter((p) => p.role.team === "minion"),
              firstNightReminder:
                "If there is more than one Minion, they all make eye contact with each other. Show the “This is the Demon” card. Point to the Demon.",
            }
          );
        } else if (role === 'demoninfo') {
          nightOrder.push(
            {
              id: "demon",
              name: "Demon info & bluffs",
              team: "demon",
              players: this.players.filter((p) => p.role.team === "demon"),
              firstNightReminder:
                "Show the “These are your minions” card. Point to each Minion. Show the “These characters are not in play” card. Show 3 character tokens of good characters that are not in play.",
            },
          );
        } else {
          let adjustedRole = adjustedRoles.get(role);
          if (adjustedRole === undefined) {
            adjustedRole = this.fabled.find((r) => r.id === role);
          }
          if (adjustedRole === undefined) {
            continue;
          }

          const players = this.players.filter((p) => {
            if (p.role.id === adjustedRole.id) return true;
            if (this.edition.characterTypes && this.edition.characterTypes[adjustedRole.team] && this.edition.characterTypes[adjustedRole.team].showRemindersInNightOrder) {
              if (p.reminders.some(r => adjustedRole.id === r.role && adjustedRole.remindersGlobal.includes(r.name))) return true;
            }
            if (this.characterTypes[adjustedRole.team] && this.characterTypes[adjustedRole.team].showRemindersInNightOrder) {
              if (p.reminders.some(r => adjustedRole.id === r.role && adjustedRole.remindersGlobal.includes(r.name))) return true;
            }
            return false;
          });

          nightOrder.push(Object.assign({}, adjustedRole, {players: players}));
        }
      }

      return nightOrder;
    },
    ...mapMutations(["toggleModal"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../../vars.scss";

.toggle {
  position: absolute;
  left: 20px;
  top: 15px;
  cursor: pointer;
  &:hover {
    color: red;
  }
}

@media (orientation: portrait) {
  .toggle {
    width: 20px;
    height: 15px;
  }
}

h3 {
  margin: 0 40px;
  svg {
    vertical-align: middle;
  }
  line-height: 90%;
}

h4 {
  text-transform: capitalize;
  display: flex;
  align-items: center;
  height: 20px;
  &:before,
  &:after {
    content: " ";
    width: 100%;
    height: 1px;
    border-radius: 2px;
  }
  &:before {
    margin-right: 15px;
  }
  &:after {
    margin-left: 15px;
  }
}

.storyteller small {
  display: block;
}

.colored {
  .name {
    background: linear-gradient(90deg, var(--color), transparent 35%);
    .night .other & {
      background: linear-gradient(-90deg, var(--color), transparent 35%);
    }
  }
}

ul {
  li {
    display: flex;
    width: 100%;
    margin-bottom: 3px;
    .icon {
      width: 5vh;
      background-size: 100%;
      background-position: 50%;
      background-repeat: no-repeat;
      flex-grow: 0;
      flex-shrink: 0;
      text-align: center;
      margin: 0 2px -10px;
      &:after {
        content: " ";
        display: block;
        padding-top: 66%;
      }
    }
    .name {
      flex-grow: 0;
      flex-shrink: 0;
      width: 15%;
      text-align: right;
      font-size: 110%;
      padding: 5px;
      border-left: 1px solid rgba(255, 255, 255, 0.4);
      border-right: 1px solid rgba(255, 255, 255, 0.4);
      small {
        color: #888;
        margin-right: 5px;
        &.dead {
          text-decoration: line-through;
        }
      }
      @media (orientation: portrait) {
        font-size: 16px;
        line-height: 16px;
      }
    }
    .reminder {
      position: fixed;
      padding: 5px 10px;
      left: 50%;
      bottom: 0;
      width: 500px;
      z-index: 25;
      background: rgba(0, 0, 0, 0.75);
      border-radius: 10px;
      border: 3px solid black;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
      text-align: left;
      pointer-events: none;
      opacity: 0;
      transition: opacity 200ms ease-in-out;
      margin-left: -250px;
    }
    &:hover .reminder {
      opacity: 1;
    }
  }
  &.legend {
    font-weight: bold;
    height: 20px;
    margin-top: 10px;
    li span {
      background: none;
      height: auto;
      font-family: inherit;
      font-size: inherit;
    }
    .icon:after {
      padding-top: 0;
    }
  }
}

.night {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  > *:first-child {
    margin-right: 2vh;
  }
  > * {
    flex-grow: 0;
    flex-wrap: nowrap;
    flex-direction: column;
  }
  .headline {
    display: block;
    font-weight: bold;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    padding: 5px 10px;
    border-radius: 0;
    text-align: center;

    @media (orientation: portrait) {
      font-size: 16px;
      line-height: 16px;
    }
  }
  .name {
    flex-grow: 1;
  }
  .first {
    .name {
      border-left: 0;
    }
  }
  .other {
    li .name {
      text-align: left;
      border-right: 0;
    }
  }
}

/** hide players when town square is set to "public" **/
#townsquare.public ~ .night-reference .modal .player {
  display: none;
}
</style>
