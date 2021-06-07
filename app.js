function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHP: 100,
      monsterHP: 100,
      currentRound: 0,
      specialAttackCD: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHP < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHP + "%" };
    },
    playerBarStyles() {
      if (this.playerHP < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHP + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound <= this.specialAttackCD;
    },
  },
  watch: {
    playerHP(value) {
      if (value <= 0 && this.monsterHP <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "monster";
      }
    },
    monsterHP(value) {
      if (value <= 0 && this.playerHP <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Monster lost
        this.winner = "player";
      }
    },
  },
  methods: {
    startGame() {
      this.playerHP = 100;
      this.monsterHP = 100;
      this.winner = null;
      this.currentRound = 0;
      this.specialAttackCD = 0;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHP -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 20);
      this.playerHP -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.specialAttackCD = this.currentRound + 3;
      this.currentRound++;
      const attackValue = getRandomValue(0, 30);
      this.monsterHP -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(0, 30);
      if (this.playerHP + healValue > 100) {
        this.playerHP = 100;
      } else {
        this.playerHP += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
