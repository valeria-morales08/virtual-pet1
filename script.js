// Game Configuration
const CONFIG = {
    MAX_STAT: 100,
    TICK_MS: 2000,
    DECAY: { hunger: 3, happiness: 2, energy: 1 },
    FEED: {hunger: +15, happiness: +5 },
    PLAY: { happiness: +20, hunger: -10, energy: -15, minEnergy: 15 },
    SLEEP: { energy: +40, hunger: -15 },
    EXHAUSTED: { ticks: 3, energyPerTick: 20},
    STAT_LEVELS: { warn: 50, danger: 25}
};

// Pet State Object
function createPet() {
    return {
        name: "Pixel",
        hunger: CONFIG.MAX_STAT,
        happiness: CONFIG.MAX_STAT,
        energy: CONFIG.MAX_STAT,
        isAlive: true,
        restTicks: 0
    };
}
 
let pet = createPet();

function clamp(value){
    return Math.min(CONFIG.MAX_STAT, Math.max(0, value));
}

const hungerVal = document.getElementById("hunger-val");
const happyVal = document.getElementById("happy-val");
const energyVal = document.getElementById("energy-val");

const hungerFill = document.getElementById("hunger-fill");
const happyFill = document.getElementById("happy-fill");
const energyFill = document.getElementById("energy-fill");

const petStatus = document.getElementById("pet-status");
const petAvatar = document.getElementById("pet-avatar");

const feedBtn = document.getElementById("feed-btn");
const playBtn = document.getElementById("play-btn");
const sleepBtn = document.getElementById("sleep-btn");

const resetBtn = document.getElementById("reset-btn");

// Update visual UI elements to match state
function updateUI() {
    hungerVal.textContent = Math.round(pet.hunger);
    happyVal.textContent = Math.round(pet.happiness);
    energyVal.textContent = Math.round(pet.energy);

    setBar(hungerFill, pet.hunger);
    setBar(happyFill, pet.happiness);
    setBar(energyFill, pet.energy);

    const mood = getMood();
    petAvatar.textContent = MOODS[mood].emoji;

    const locked = !pet.isAlive || pet.restTicks > 0;
    feedBtn.disabled = locked;
    playBtn.disabled = locked;
    sleepBtn.disabled = locked;

    resetBtn.hidden = pet.isAlive;
    
    if(!pet.isAlive) {
        petStatus.textContent = MOODS.dead.text;
    }

}

function setBar(fillEl, value) {
    fillEl.style.width = `${value}%`;

    let level = "good";
    if (value < CONFIG.STAT_LEVELS.danger) level = "danger";
    else if (value < CONFIG.STAT_LEVELS.warn) level = "warn";

    fillEl.className = `fill ${level}`;
}

function getMood(){
    if (!pet.isAlive) return "dead";
    if (pet.restTicks > 0) return "exhausted";
    if (pet.hunger < CONFIG.STAT_LEVELS.danger) return "hungry";
    if (pet.energy < CONFIG.STAT_LEVELS.danger) return "tired";
    if (pet.happiness < CONFIG.STAT_LEVELS.danger) return "sad";
    return "happy";
}

const MOODS = {
    happy: { emoji: "😸", text: "Feeling great!" },
    hungry: { emoji: "😾", text: "I'm starving..." },
    tired: {emoji: "😴", text: "So sleepy..." },
    sad: { emoji: "😿", text: "I feel lonely. Play with me!" },
    dead: {emoji: "👻", text: "Your pet ran away or passed out...💀" },
    exhausted: {emoji: "💤", text: "Passed out from exhaustion..." }
};

// Button Interactions
feedBtn.addEventListener("click", () => {
    if (!pet.isAlive) return;
    pet.hunger = clamp(pet.hunger + CONFIG.FEED.hunger);
    pet.happiness = clamp(pet.happiness + CONFIG.FEED.happiness);
    petStatus.textContent = "Yum! That was delicious.";
    updateUI();
});

playBtn.addEventListener("click", () => {
    if (!pet.isAlive) return;
    if (pet.energy < CONFIG.PLAY.minEnergy) {
        petStatus.textContent = "Too tired to play! Let it sleep.";
        return;
    }
    pet.happiness = clamp(pet.happiness + CONFIG.PLAY.happiness);
    pet.hunger = clamp(pet.hunger + CONFIG.PLAY.hunger);
    pet.energy = clamp(pet.energy + CONFIG.PLAY.energy);
    petStatus.textContent = "Had fun playing games!";
    updateUI();
});

sleepBtn.addEventListener("click", () => {
    if (!pet.isAlive) return;
    pet.energy = clamp(pet.energy + CONFIG.SLEEP.energy);
    pet.hunger = clamp(pet.hunger + CONFIG.SLEEP.hunger);
    petStatus.textContent = "Zzz... Feeling a bit better!";
    updateUI();
});

resetBtn.addEventListener("click", () => {
    pet = createPet();
    petStatus.textContent = MOODS.happy.text;
    updateUI();
});

// Time Loop: Stats slowly decay every 2 seconds
function gameLoop() {
    if (!pet.isAlive) return;

    pet.hunger = clamp(pet.hunger - CONFIG.DECAY.hunger);
    pet.happiness = clamp(pet.happiness - CONFIG.DECAY.happiness);

    if (pet.restTicks > 0) {
        //Is resting: recharging energy
        pet.restTicks--;
        pet.energy = clamp(pet.energy + CONFIG.EXHAUSTED.energyPerTick);
    } else {
        pet.energy = clamp(pet.energy - CONFIG.DECAY.energy);
        if (pet.energy <= 0) pet.restTicks = CONFIG.EXHAUSTED.ticks;
    }
    

    // Check if pet dies/escapes
    if (pet.hunger <= 0 || pet.happiness <= 0) {
        pet.isAlive = false;
    }

    if (pet.isAlive) petStatus.textContent = MOODS[getMood()].text;

    updateUI();
}

// Run gameLoop every CONFIG.TICK_MS milliseconds
setInterval(gameLoop, CONFIG.TICK_MS);

// Initial UI sync
updateUI();
