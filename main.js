const { app, BrowserWindow } = require("electron");
const path = require("path");
const expressApp = require("./app");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "public", "icon.ico"),
    autoHideMenuBar: true,
  });
  mainWindow.maximize();

  mainWindow.loadURL("http://localhost:3000").catch((err) => {
    console.error("Failed to load URL:", err);
  });
const express = require(path.join(__dirname, "node_modules", "express"));

  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
