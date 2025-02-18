import Vue from "vue";
import Vuex from "vuex";
import persistence from "./persistence";
import socket from "./socket";
import players from "./modules/players";
import session from "./modules/session";
import editionJSON from "../editions.json";
import rolesJSON from "../roles.json";
import nightJSON from "../nightsheet.json";
import fabledJSON from "../fabled.json";
import jinxesJSON from "../hatred.json";

Vue.use(Vuex);

// helper functions
const clean = (id) => id.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

const getRolesByEdition = (edition = editionJSON[0]) => {
  return new Map(
    rolesFormatted
      .filter((r) => r.edition === edition.id || edition.roles.includes(r.id))
      .sort((a, b) => b.team.localeCompare(a.team))
      .map((role) => [role.id, role]),
  );
};

const firstNightOrder = nightJSON.firstNight;
const getFirstNightOrder = (id) => {
  // -1 will be raised to 0, others will be 1 or greater.
  return firstNightOrder.indexOf(clean(id)) + 1;
};

const otherNightOrder = nightJSON.otherNight;
const getOtherNightOrder = (id) => {
  // -1 will be raised to 0, others will be 1 or greater.
  return otherNightOrder.indexOf(clean(id)) + 1;
};

const rolesFormatted = rolesJSON.map((role) => {
  role.firstNight = getFirstNightOrder(role.id);
  role.otherNight = getOtherNightOrder(role.id);
  return role;
});

const getTravellersNotInEdition = (edition = editionJSON[0]) => {
  return new Map(
    rolesFormatted
      .filter(
        (r) =>
          r.team === "traveller" &&
          r.edition !== edition.id &&
          !edition.roles.includes(r.id),
      )
      .map((role) => [role.id, role]),
  );
};

const set =
  (key) =>
  ({ grimoire }, val) => {
    grimoire[key] = val;
  };

const toggle =
  (key) =>
  ({ grimoire }, val) => {
    if (val === true || val === false) {
      grimoire[key] = val;
    } else {
      grimoire[key] = !grimoire[key];
    }
  };

// global data maps
const editionJSONbyId = new Map(
  editionJSON.map((edition) => [edition.id, edition]),
);
const rolesJSONbyId = new Map(rolesFormatted.map((role) => [role.id, role]));
const fabled = new Map(fabledJSON.map((role) => [role.id, role]));

// jinxes
let jinxes = {};
try {
  // Note: can't fetch live list due to lack of CORS headers
  // fetch("https://bloodontheclocktower.com/script/data/hatred.json")
  //   .then(res => res.json())
  //   .then(jinxesJSON => {
  jinxes = new Map(
    jinxesJSON.map(({ id, jinx }) => [
      clean(id),
      new Map(jinx.map(({ id, reason }) => [clean(id), reason])),
    ]),
  );
  // });
} catch (e) {
  console.error("couldn't load jinxes", e);
}

// base definition for custom roles
const customRole = {
  id: "",
  name: "",
  image: "",
  ability: "",
  edition: "custom",
  firstNight: 0,
  firstNightReminder: "",
  otherNight: 0,
  otherNightReminder: "",
  reminders: [],
  remindersGlobal: [],
  setup: false,
  team: "townsfolk",
  isCustom: true,
};

export default new Vuex.Store({
  modules: {
    players,
    session,
  },
  state: {
    grimoire: {
      isNight: false,
      isNightOrder: true,
      isPublic: true,
      isMenuOpen: false,
      isStatic: false,
      isMuted: false,
      isImageOptIn: false,
      zoom: 0,
      background: "",

      nightNumber: 0,
      nightStart: null,
      nightEnd: null,
    },
    modals: {
      edition: false,
      fabled: false,
      gameState: false,
      messages: false,
      nightOrder: false,
      reference: false,
      reminder: false,
      role: false,
      roles: false,
      voteHistory: false,
    },
    edition: editionJSONbyId.get("tb"),
    roles: getRolesByEdition(),
    otherTravellers: getTravellersNotInEdition(),
    fabled,
    jinxes,
  },
  getters: {
    /**
     * Return all custom roles, with default values and non-essential data stripped.
     * Role object keys will be replaced with a numerical index to conserve bandwidth.
     * @param roles
     * @returns {[]}
     */
    customRolesStripped: ({ roles }) => {
      const customRoles = [];
      const customKeys = Object.keys(customRole);
      const strippedProps = [];
      roles.forEach((role) => {
        if (!role.isCustom) {
          customRoles.push({ id: role.id });
        } else {
          const strippedRole = {};
          for (let prop in role) {
            if (strippedProps.includes(prop)) {
              continue;
            }
            const value = role[prop];
            if (customKeys.includes(prop) && value !== customRole[prop]) {
              strippedRole[customKeys.indexOf(prop)] = value;
            }
          }
          customRoles.push(strippedRole);
        }
      });
      return customRoles;
    },
    getFirstNightOrder: () => (id) => getFirstNightOrder(id),
    getOtherNightOrder: () => (id) => getOtherNightOrder(id),
    clean: () => (id) => clean(id),
    rolesJSONbyId: () => rolesJSONbyId,
  },
  mutations: {
    setZoom: set("zoom"),
    setBackground: set("background"),
    toggleMuted: toggle("isMuted"),
    toggleMenu: toggle("isMenuOpen"),
    toggleNightOrder: toggle("isNightOrder"),
    toggleStatic: toggle("isStatic"),
    toggleNight({ grimoire, players, edition, session }, val) {
      // Reset the hasResponded var for the next night.
      players.players.map((player) => {
        player.hasResponded = {};
      });

      // This function can be called with an explicit value pushed from the
      // socket. In that case, the value the host has declared takes effect,
      // assuming it is at least a valid boolean.
      if (val === true || val === false) {
        grimoire.isNight = val;
      } else {
        grimoire.isNight = !grimoire.isNight;
      }

      // Record the length of days and nights if is ST.
      if (!session.isSpectator) {
        return;
      }
      if (grimoire.isNight) {
        grimoire.nightNumber++;
        grimoire.nightStart = new Date();

        if (grimoire.nightEnd !== null) {
          const duration = Math.floor(
            Math.abs(grimoire.nightStart - grimoire.nightEnd) / 1000,
          );
          gtag("event", "day_end", {
            duration: duration,
            playerCount: players.players.length,
            nightNumber: grimoire.nightNumber,
            edition: edition.name,
          });
        }
      } else if (grimoire.nightStart !== null) {
        grimoire.nightEnd = new Date();
        const duration = Math.floor(
          Math.abs(grimoire.nightEnd - grimoire.nightStart) / 1000,
        );
        gtag("event", "night_end", {
          duration: duration,
          playerCount: players.players.length,
          nightNumber: grimoire.nightNumber,
          edition: edition.name,
        });
      }
    },
    toggleGrimoire: toggle("isPublic"),
    toggleImageOptIn: toggle("isImageOptIn"),
    toggleModal({ modals }, name) {
      if (name) {
        modals[name] = !modals[name];
      }
      for (let modal in modals) {
        if (modal === name) continue;
        modals[modal] = false;
      }
    },
    /**
     * Store custom roles
     * @param state
     * @param roles Array of role IDs or full role definitions
     */
    setCustomRoles(state, roles) {
      const processedRoles = roles
        // replace numerical role object keys with matching key names
        .map((role) => {
          if (role[0]) {
            const customKeys = Object.keys(customRole);
            const mappedRole = {};
            for (let prop in role) {
              if (customKeys[prop]) {
                mappedRole[customKeys[prop]] = role[prop];
              }
            }
            return mappedRole;
          } else {
            return role;
          }
        })
        // clean up role.id and role.team
        .map((role) => {
          role.id = clean(role.id);
          if (role.team === "traveler") {
            role.team = "traveller";
          }
          return role;
        })
        // map existing roles to base definition or pre-populate custom roles to ensure all properties
        .map((role) => {
          if (Object.keys(role).length === 1 && role.id && rolesJSONbyId.get(role.id)) {
            return rolesJSONbyId.get(role.id);
          }
          return state.roles.get(role.id) || Object.assign({}, customRole, role);
        })
        // default empty icons and placeholders, clean up firstNight / otherNight
        .map((role) => {
          if (rolesJSONbyId.get(role.id)) return role;
          role.imageAlt = // map team to generic icon
            {
              townsfolk: "townsfolk",
              outsider: "outsider",
              minion: "minion",
              demon: "demon",
              fabled: "fabled",
            }[role.team] || "custom";
          role.firstNight = Math.abs(role.firstNight);
          role.otherNight = Math.abs(role.otherNight);
          if (role.jinxes) {
            role.jinxes = new Map(
              role.jinxes.map(({ id, reason }) => [clean(id), reason]),
            );
          }
          return role;
        })
        // filter out roles that don't match an existing role and also don't have name/ability/team
        .filter((role) => role.name && role.ability && role.team)
        // sort by team
        .sort((a, b) => b.team.localeCompare(a.team));
      // convert to Map without Fabled
      state.roles = new Map(
        processedRoles
          .filter((role) => role.team !== "fabled")
          .map((role) => [role.id, role]),
      );
      // update Fabled to include custom Fabled from this script
      state.fabled = new Map([
        ...processedRoles
          .filter((r) => r.team === "fabled")
          .map((r) => [r.id, r]),
        ...fabledJSON.map((role) => [role.id, role]),
      ]);
      // update extraTravellers map to only show travellers not in this script
      state.otherTravellers = new Map(
        rolesFormatted
          .filter(
            (r) => r.team === "traveller" && !roles.some((i) => i.id === r.id),
          )
          .map((role) => [role.id, role]),
      );
    },
    setEdition(state, edition) {
      state.grimoire.nightNumber = 0;
      state.grimoire.nightStart = null;
      state.grimoire.nightEnd = null;

      if (editionJSONbyId.has(edition.id)) {
        state.edition = editionJSONbyId.get(edition.id);
        state.roles = getRolesByEdition(state.edition);
        state.otherTravellers = getTravellersNotInEdition(state.edition);
      } else {
        state.edition = edition;
      }
      state.modals.edition = false;
    },
  },
  plugins: [persistence, socket],
});
