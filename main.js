const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");

const expressApp = express();

expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use(
  "/modules",
  express.static(path.join(__dirname, "node_modules"))
);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "public", "icon.ico"),
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
