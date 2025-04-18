import { startGame } from "../game/game.js";

export const menu = document.createElement("div");
menu.style.position = "absolute";
menu.style.top = "75%";
menu.style.left = "50%";
menu.style.transform = "translate(-50%, -50%)";
menu.style.background = "rgba(0, 0, 0, 0.8)";
menu.style.padding = "20px";
menu.style.borderRadius = "12px";
menu.style.textAlign = "center";
menu.style.color = "white";
menu.style.zIndex = "20";
document.body.appendChild(menu);

//Main Menu
const mainMenu = document.createElement("div");

const startBtn = document.createElement("button");
startBtn.textContent = "Start Run";
startBtn.onclick = () => {
    startGame();
    switchMenu(mainMenu);
  };

const shopBtn = document.createElement("button");
shopBtn.textContent = "Shop";
shopBtn.onclick = () => switchMenu(shopMenu);

const leaderboardBtn = document.createElement("button");
leaderboardBtn.textContent = "Leaderboard";
leaderboardBtn.onclick = () => switchMenu(leaderboardMenu);

[ startBtn, shopBtn, leaderboardBtn ].forEach(btn => {
  btn.style.margin = "10px";
  btn.style.fontSize = "20px";
  btn.style.padding = "10px 20px";
  mainMenu.appendChild(btn);
});

//Shop
const shopMenu = document.createElement("div");
const backFromShop = document.createElement("button");
backFromShop.textContent = "Back";
backFromShop.onclick = () => switchMenu(mainMenu);
shopMenu.appendChild(backFromShop);

//Leaderboard
const leaderboardMenu = document.createElement("div");
const backFromLeaderboard = document.createElement("button");
backFromLeaderboard.textContent = "Back";
backFromLeaderboard.onclick = () => switchMenu(mainMenu);
leaderboardMenu.appendChild(backFromLeaderboard);



function switchMenu(target) {
    [mainMenu, shopMenu, leaderboardMenu].forEach(menu => {
      menu.style.display = "none";
    });
    target.style.display = "block";
  }

  menu.appendChild(mainMenu);
  menu.appendChild(shopMenu);
  menu.appendChild(leaderboardMenu);
  
  switchMenu(mainMenu); // start on main menu
  