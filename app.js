// Player data
let player = {
    level: 1,
    exp: 0,
    strength: 10,
    agility: 10,
    intelligence: 10,
    statPoints: 0,
    dailyQuestsCompleted: 0,
    gold: 100,
  };
  
  // Quests data
  let quests = [
    { id: '1', title: 'Defeat 10 monsters', completed: false, reward: { exp: 50, gold: 10 } },
    { id: '2', title: 'Train for 30 minutes', completed: false, reward: { exp: 70, gold: 15 } },
    { id: '3', title: 'Restore your mana', completed: false, reward: { exp: 30, gold: 5 } },
    { id: '4', title: 'Complete a dungeon', completed: false, reward: { exp: 100, gold: 20 } },
    { id: '5', title: 'Meditate to increase stats', completed: false, reward: { exp: 40, gold: 10 } },
  ];
  
  let showStatMenu = false;
  
  // Load data from localStorage
  function loadData() {
    const savedPlayer = localStorage.getItem('soloLevelingPlayer');
    const savedQuests = localStorage.getItem('soloLevelingQuests');
    
    if (savedPlayer) player = JSON.parse(savedPlayer);
    if (savedQuests) quests = JSON.parse(savedQuests);
    
    renderApp();
  }
  
  // Save data to localStorage
  function saveData() {
    localStorage.setItem('soloLevelingPlayer', JSON.stringify(player));
    localStorage.setItem('soloLevelingQuests', JSON.stringify(quests));
  }
  
  // Show notification
  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // Complete a quest with animation
  function completeQuest(questId) {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
  
    // Add visual effect
    const questElement = document.querySelector(`.quest-item[data-id="${questId}"]`);
    if (questElement) {
      questElement.classList.add('pulse');
      setTimeout(() => {
        questElement.classList.remove('pulse');
      }, 500);
    }
  
    quest.completed = true;
    player.exp += quest.reward.exp;
    player.gold += quest.reward.gold;
    player.dailyQuestsCompleted += 1;
  
    // Show reward notification
    showNotification(`+${quest.reward.exp} EXP | +${quest.reward.gold} Gold`);
  
    // Check for level up
    const expNeeded = Math.floor(100 * Math.pow(1.2, player.level - 1));
    if (player.exp >= expNeeded) {
      player.level += 1;
      player.exp -= expNeeded;
      player.statPoints += 3;
      
      // Level up animation
      const levelElement = document.querySelector('.player-level');
      if (levelElement) {
        levelElement.classList.add('level-up');
        setTimeout(() => {
          levelElement.classList.remove('level-up');
        }, 500);
      }
      
      showNotification(`LEVEL UP! You reached level ${player.level}!`);
    }
  
    saveData();
    renderApp();
  }
  
  // Reset all quests with confirmation
  function resetQuests() {
    if (confirm('Reset all daily quests? Progress will be saved but quests will be marked incomplete.')) {
      quests.forEach(quest => {
        quest.completed = false;
      });
      player.dailyQuestsCompleted = 0;
      saveData();
      renderApp();
      showNotification('Daily quests reset!');
    }
  }
  
  // Increase a stat with animation
  function increaseStat(stat) {
    if (player.statPoints > 0) {
      player[stat] += 1;
      player.statPoints -= 1;
      
      // Animation
      const statElement = document.querySelector(`.stat-value[data-stat="${stat}"]`);
      if (statElement) {
        statElement.classList.add('level-up');
        setTimeout(() => {
          statElement.classList.remove('level-up');
        }, 300);
      }
      
      showNotification(`${stat.toUpperCase()} increased to ${player[stat]}!`);
      saveData();
      renderApp();
    }
  }
  
  // Toggle stat menu visibility
  function toggleStatMenu() {
    showStatMenu = !showStatMenu;
    renderApp();
  }
  
  // Render the entire app
  function renderApp() {
    renderPlayerInfo();
    renderQuestList();
  }
  
  // Render player info section with animations
  function renderPlayerInfo() {
    const expNeeded = Math.floor(100 * Math.pow(1.2, player.level - 1));
    const expPercentage = Math.min(100, (player.exp / expNeeded) * 100);
    
    let statsMenuHTML = '';
    if (showStatMenu) {
      statsMenuHTML = `
        <div class="stats-menu">
          <div class="stat-row">
            <span class="stat-name">STRENGTH</span>
            <span class="stat-value" data-stat="strength">${player.strength}</span>
            <div class="stat-btn" onclick="increaseStat('strength')" ${player.statPoints === 0 ? 'disabled' : ''}>+</div>
          </div>
          <div class="stat-row">
            <span class="stat-name">AGILITY</span>
            <span class="stat-value" data-stat="agility">${player.agility}</span>
            <div class="stat-btn" onclick="increaseStat('agility')" ${player.statPoints === 0 ? 'disabled' : ''}>+</div>
          </div>
          <div class="stat-row">
            <span class="stat-name">INTELLIGENCE</span>
            <span class="stat-value" data-stat="intelligence">${player.intelligence}</span>
            <div class="stat-btn" onclick="increaseStat('intelligence')" ${player.statPoints === 0 ? 'disabled' : ''}>+</div>
          </div>
        </div>
      `;
    }
  
    document.getElementById('playerInfo').innerHTML = `
      <div class="player-level">LEVEL ${player.level}</div>
      <div class="player-stat">
        <span class="stat-name">EXP:</span>
        <span class="stat-value">${player.exp}/${expNeeded}</span>
      </div>
      <div class="exp-bar-container">
        <div class="exp-bar" style="width: ${expPercentage}%"></div>
      </div>
      <div class="player-stat">
        <span class="stat-name">GOLD:</span>
        <span class="stat-value">${player.gold}</span>
      </div>
      <div class="player-stat">
        <span class="stat-name">QUESTS COMPLETED:</span>
        <span class="stat-value">${player.dailyQuestsCompleted}/${quests.length}</span>
      </div>
      <div class="stats-button" onclick="toggleStatMenu()">
        STAT POINTS: ${player.statPoints} ${player.statPoints > 0 ? '⭐' : ''}
      </div>
      ${statsMenuHTML}
    `;
  }
  
  // Render quest list with hover effects
  function renderQuestList() {
    const questListHTML = quests.map(quest => `
      <div class="quest-item ${quest.completed ? 'completed' : ''}" 
           data-id="${quest.id}"
           onclick="${!quest.completed ? `completeQuest('${quest.id}')` : 'return false'}">
        <div class="quest-title">${quest.title}</div>
        ${quest.completed ? 
          '<div class="quest-status">QUEST COMPLETE</div>' : 
          `<div class="quest-reward">
            <span class="reward-item exp-reward">${quest.reward.exp} EXP</span>
            <span class="reward-item gold-reward">${quest.reward.gold} GOLD</span>
          </div>`}
      </div>
    `).join('');
  
    document.getElementById('questList').innerHTML = questListHTML;
  }
  
  // Initialize the app
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resetButton').addEventListener('click', resetQuests);
    loadData();
    
    // Add animation class to container
    document.querySelector('.container').classList.add('fade-in');
  });