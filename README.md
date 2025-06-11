# 🌌 3D Solar System Simulation

This project is a 3D simulation of our solar system built using **Three.js**. It displays the Sun at the center and all 8 planets orbiting around it with adjustable speed controls.

### 🎯 Features
- 🌞 Sun and 8 orbiting planets (Mercury to Neptune)
- ⚙️ Real-time orbital speed control via sliders
- 💡 Realistic lighting and 3D camera
- 🖱️ Interactive camera controls (OrbitControls)
- 🌟 Bonus features (pause/resume, tooltips, etc. - if implemented)

---

### 🚀 How to Run Locally

#### 1. Clone the Repo
```bash
git clone https://github.com/GOBI-S/Soloarsystem.git
cd Soloarsystem
```

#### 2. Run in Your Browser
You can open it directly using a Live Server or a local HTTP server.

##### Option 1: Using VS Code + Live Server
- Open folder in VS Code
- Right-click on `index.html` → **Open with Live Server**

##### Option 2: Using Python HTTP Server
```bash
# For Python 3
python -m http.server
# For Python 2
python -m SimpleHTTPServer
```
Then open your browser and go to:  
`http://localhost:8000`

---

### 📂 Folder Structure
```
Soloarsystem/
├── textures          # It Consits of the Texture jpg pictures
├── index.html        # Main HTML file
├── script.js         # JavaScript code using Three.js
├── orbitcontrols.js  # OrbitControls for camera interaction
└── README.md         # Project documentation (this file)
```


---

### ✨ Tech Used
- [Three.js](https://threejs.org/)
- HTML5, JavaScript
- OrbitControls

---

### 👨‍💻 Developed by
**Gobi S**  
Frontend Developer Assignment for [EmptyCup]

---

