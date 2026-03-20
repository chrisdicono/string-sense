const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// static frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// backend audio files
app.use("/audio", express.static(path.join(__dirname, "backend", "audio-files")));

// backend config folder (settings.json, etc...)
app.use("/config", express.static(path.join(__dirname, "backend", "config")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "pages", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log();
    console.log("   _____ __       _             _____                     ");
    console.log("  / ___// /______(_)___  ____ _/ ___/___  ____  ________  ");
    console.log("  \__ \/ __/ ___/ / __ \/ __ `/\__ \/ _ \/ __ \/ ___/ _ \ ");
    console.log(" ___/ / /_/ /  / / / / / /_/ /___/ /  __/ / / (__  )  __/ ");
    console.log("/____/\__/_/  /_/_/ /_/\__, //____/\___/_/ /_/____/\___/  ");
    console.log("                      /____/                              ");
    console.log("            A BRAIN-CHILD OF CHRIS DICONO ;)              ");
});
