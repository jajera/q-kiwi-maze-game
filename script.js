/**
 * Kiwi Maze Escape Game
 * A browser-based maze game where players guide a kiwi fruit to the goal
 */

class KiwiMazeGame {
    constructor() {
        // Game configuration
        this.GRID_SIZE = 12;
        this.CELL_SIZE = 40;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.player = { x: 1, y: 1 };
        this.goal = { x: this.GRID_SIZE - 2, y: this.GRID_SIZE - 2 };
        this.moves = 0;
        this.gameWon = false;
        this.maze = [];
        
        // Audio context for sound effects
        this.audioContext = null;
        this.initAudio();
        
        // UI elements
        this.moveCountElement = document.getElementById('moveCount');
        this.winMessage = document.getElementById('winMessage');
        this.finalMovesElement = document.getElementById('finalMoves');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        // Initialize game
        this.init();
    }
    
    /**
     * Initialize audio context for sound effects
     */
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    /**
     * Play a sound effect using Web Audio API
     * @param {number} frequency - Sound frequency in Hz
     * @param {number} duration - Sound duration in seconds
     * @param {string} type - Oscillator type ('sine', 'square', 'triangle', 'sawtooth')
     */
    playSound(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    }
    
    /**
     * Initialize the game
     */
    init() {
        this.generateMaze();
        this.setupEventListeners();
        this.render();
        this.canvas.focus();
    }
    
    /**
     * Generate a maze ensuring the goal is always reachable
     * Uses improved recursive backtracking with better connectivity
     */
    generateMaze() {
        // Initialize maze with walls (1) and paths (0)
        this.maze = Array(this.GRID_SIZE).fill().map(() => Array(this.GRID_SIZE).fill(1));
        
        // Generate maze using improved recursive backtracking
        this.generateMazeRecursive();
        
        // Ensure start and goal positions are clear
        this.maze[this.player.y][this.player.x] = 0;
        this.maze[this.goal.y][this.goal.x] = 0;
        
        // Always ensure a guaranteed path exists
        this.ensurePathToGoal();
        
        // Add some additional paths for more interesting gameplay
        this.addExtraPaths();
        
        // Final verification - if still no path, create direct path
        if (!this.hasPathToGoal()) {
            this.createDirectPath();
        }
    }
    
    /**
     * Generate maze using improved recursive backtracking algorithm
     * This ensures a more connected maze with guaranteed solution
     */
    generateMazeRecursive() {
        const visited = Array(this.GRID_SIZE).fill().map(() => Array(this.GRID_SIZE).fill(false));
        const stack = [];
        
        // Start from position (1,1) - always odd coordinates for proper maze generation
        let currentX = 1;
        let currentY = 1;
        this.maze[currentY][currentX] = 0;
        visited[currentY][currentX] = true;
        
        const directions = [
            { x: 0, y: -2 }, // Up
            { x: 2, y: 0 },  // Right
            { x: 0, y: 2 },  // Down
            { x: -2, y: 0 }  // Left
        ];
        
        while (true) {
            // Get unvisited neighbors (2 cells away to maintain wall structure)
            const neighbors = [];
            
            for (const dir of directions) {
                const newX = currentX + dir.x;
                const newY = currentY + dir.y;
                
                if (newX > 0 && newX < this.GRID_SIZE - 1 && 
                    newY > 0 && newY < this.GRID_SIZE - 1 && 
                    !visited[newY][newX]) {
                    neighbors.push({ x: newX, y: newY, dir });
                }
            }
            
            if (neighbors.length > 0) {
                // Choose random neighbor
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Remove wall between current and next cell
                const wallX = currentX + next.dir.x / 2;
                const wallY = currentY + next.dir.y / 2;
                
                this.maze[wallY][wallX] = 0;
                this.maze[next.y][next.x] = 0;
                visited[next.y][next.x] = true;
                
                // Push current to stack and move to next
                stack.push({ x: currentX, y: currentY });
                currentX = next.x;
                currentY = next.y;
            } else if (stack.length > 0) {
                // Backtrack
                const prev = stack.pop();
                currentX = prev.x;
                currentY = prev.y;
            } else {
                break;
            }
        }
        
        // Add some random openings to make maze less predictable
        this.addRandomOpenings();
    }
    
    /**
     * Check if there's a path from start to goal using BFS
     */
    hasPathToGoal() {
        const queue = [{ x: this.player.x, y: this.player.y }];
        const visited = Array(this.GRID_SIZE).fill().map(() => Array(this.GRID_SIZE).fill(false));
        visited[this.player.y][this.player.x] = true;
        
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.x === this.goal.x && current.y === this.goal.y) {
                return true;
            }
            
            for (const dir of directions) {
                const newX = current.x + dir.x;
                const newY = current.y + dir.y;
                
                if (newX >= 0 && newX < this.GRID_SIZE && 
                    newY >= 0 && newY < this.GRID_SIZE && 
                    !visited[newY][newX] && this.maze[newY][newX] === 0) {
                    visited[newY][newX] = true;
                    queue.push({ x: newX, y: newY });
                }
            }
        }
        
        return false;
    }
    
    /**
     * Add random openings to make the maze more interesting
     */
    addRandomOpenings() {
        const numOpenings = Math.floor(Math.random() * 4) + 2;
        
        for (let i = 0; i < numOpenings; i++) {
            const x = Math.floor(Math.random() * (this.GRID_SIZE - 2)) + 1;
            const y = Math.floor(Math.random() * (this.GRID_SIZE - 2)) + 1;
            
            // Only create opening if it connects two path areas
            if (this.maze[y][x] === 1) {
                const neighbors = [
                    { x: x, y: y - 1 }, { x: x + 1, y: y },
                    { x: x, y: y + 1 }, { x: x - 1, y: y }
                ];
                
                const pathNeighbors = neighbors.filter(n => 
                    n.x >= 0 && n.x < this.GRID_SIZE && 
                    n.y >= 0 && n.y < this.GRID_SIZE && 
                    this.maze[n.y][n.x] === 0
                );
                
                if (pathNeighbors.length >= 2) {
                    this.maze[y][x] = 0;
                }
            }
        }
    }

    /**
     * Ensure there's always a path from start to goal using A* pathfinding
     */
    ensurePathToGoal() {
        if (!this.hasPathToGoal()) {
            // Create a path using A* algorithm to find optimal route
            const path = this.findPathAStar(this.player, this.goal);
            
            if (path.length === 0) {
                // If A* fails, create a simple guaranteed path
                this.createDirectPath();
            } else {
                // Clear the path found by A*
                for (const point of path) {
                    this.maze[point.y][point.x] = 0;
                }
            }
        }
    }

    /**
     * Find path using A* algorithm
     */
    findPathAStar(start, goal) {
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const getKey = (point) => `${point.x},${point.y}`;
        const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        
        gScore.set(getKey(start), 0);
        fScore.set(getKey(start), heuristic(start, goal));
        
        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                if (fScore.get(getKey(openSet[i])) < fScore.get(getKey(current))) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            if (current.x === goal.x && current.y === goal.y) {
                // Reconstruct path
                const path = [];
                let temp = current;
                
                while (temp) {
                    path.unshift(temp);
                    temp = cameFrom.get(getKey(temp));
                }
                
                return path;
            }
            
            openSet.splice(currentIndex, 1);
            
            const neighbors = [
                { x: current.x, y: current.y - 1 },
                { x: current.x + 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x - 1, y: current.y }
            ];
            
            for (const neighbor of neighbors) {
                if (neighbor.x < 0 || neighbor.x >= this.GRID_SIZE ||
                    neighbor.y < 0 || neighbor.y >= this.GRID_SIZE) {
                    continue;
                }
                
                const tentativeGScore = gScore.get(getKey(current)) + 1;
                const neighborKey = getKey(neighbor);
                
                if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));
                    
                    if (!openSet.some(p => p.x === neighbor.x && p.y === neighbor.y)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        
        return []; // No path found
    }

    /**
     * Create a direct path from start to goal as fallback
     */
    createDirectPath() {
        let x = this.player.x;
        let y = this.player.y;
        
        // Create L-shaped path: horizontal first, then vertical
        while (x !== this.goal.x) {
            this.maze[y][x] = 0;
            x += (this.goal.x > x) ? 1 : -1;
        }
        
        while (y !== this.goal.y) {
            this.maze[y][x] = 0;
            y += (this.goal.y > y) ? 1 : -1;
        }
        
        // Ensure goal is reachable
        this.maze[this.goal.y][this.goal.x] = 0;
    }
    
    /**
     * Add extra paths to make the maze more interesting and provide multiple routes
     */
    addExtraPaths() {
        const numExtraPaths = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < numExtraPaths; i++) {
            const x = Math.floor(Math.random() * (this.GRID_SIZE - 4)) + 2;
            const y = Math.floor(Math.random() * (this.GRID_SIZE - 4)) + 2;
            
            // Create small path segments that connect existing paths
            if (Math.random() > 0.5) {
                // Horizontal path segment
                const length = Math.floor(Math.random() * 3) + 2;
                for (let j = 0; j < length && x + j < this.GRID_SIZE - 1; j++) {
                    if (this.hasAdjacentPath(x + j, y)) {
                        this.maze[y][x + j] = 0;
                    }
                }
            } else {
                // Vertical path segment
                const length = Math.floor(Math.random() * 3) + 2;
                for (let j = 0; j < length && y + j < this.GRID_SIZE - 1; j++) {
                    if (this.hasAdjacentPath(x, y + j)) {
                        this.maze[y + j][x] = 0;
                    }
                }
            }
        }
    }

    /**
     * Check if a position has adjacent paths (used for connecting path segments)
     */
    hasAdjacentPath(x, y) {
        const neighbors = [
            { x: x, y: y - 1 }, { x: x + 1, y: y },
            { x: x, y: y + 1 }, { x: x - 1, y: y }
        ];
        
        return neighbors.some(n => 
            n.x >= 0 && n.x < this.GRID_SIZE && 
            n.y >= 0 && n.y < this.GRID_SIZE && 
            this.maze[n.y][n.x] === 0
        );
    }
    
    /**
     * Set up event listeners for game controls
     */
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.playAgainBtn.addEventListener('click', () => this.newGame());
        
        // Canvas focus for accessibility
        this.canvas.addEventListener('click', () => this.canvas.focus());
    }
    
    /**
     * Handle keyboard input for player movement
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyPress(event) {
        if (this.gameWon) return;
        
        // Resume audio context on user interaction
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        let newX = this.player.x;
        let newY = this.player.y;
        
        switch (event.key) {
            case 'ArrowUp':
                newY--;
                event.preventDefault();
                break;
            case 'ArrowDown':
                newY++;
                event.preventDefault();
                break;
            case 'ArrowLeft':
                newX--;
                event.preventDefault();
                break;
            case 'ArrowRight':
                newX++;
                event.preventDefault();
                break;
            default:
                return;
        }
        
        // Check if move is valid
        if (this.isValidMove(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
            this.moves++;
            this.updateMoveCounter();
            this.playSound(300, 0.1); // Move sound
            
            // Check for win condition
            if (this.player.x === this.goal.x && this.player.y === this.goal.y) {
                this.winGame();
            }
            
            this.render();
        } else {
            // Wall collision sound
            this.playSound(150, 0.2, 'square');
        }
    }
    
    /**
     * Check if a move to the specified coordinates is valid
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if move is valid
     */
    isValidMove(x, y) {
        return x >= 0 && x < this.GRID_SIZE && 
               y >= 0 && y < this.GRID_SIZE && 
               this.maze[y][x] === 0;
    }
    
    /**
     * Update the move counter display
     */
    updateMoveCounter() {
        this.moveCountElement.textContent = this.moves;
    }
    
    /**
     * Handle win condition
     */
    winGame() {
        this.gameWon = true;
        this.playSound(900, 0.5); // Success chime
        
        // Show win message
        this.finalMovesElement.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
    }
    
    /**
     * Start a new game
     */
    newGame() {
        // Randomize goal position for variety
        const possibleGoals = [
            { x: this.GRID_SIZE - 2, y: this.GRID_SIZE - 2 },
            { x: this.GRID_SIZE - 2, y: 1 },
            { x: 1, y: this.GRID_SIZE - 2 },
            { x: Math.floor(this.GRID_SIZE / 2), y: this.GRID_SIZE - 2 },
            { x: this.GRID_SIZE - 2, y: Math.floor(this.GRID_SIZE / 2) }
        ];
        
        this.player = { x: 1, y: 1 };
        this.goal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
        this.moves = 0;
        this.gameWon = false;
        
        this.updateMoveCounter();
        this.winMessage.classList.add('hidden');
        this.generateMaze();
        this.render();
        this.canvas.focus();
    }
    
    /**
     * Render the game on the canvas
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.drawMaze();
        
        // Draw goal
        this.drawGoal();
        
        // Draw player
        this.drawPlayer();
    }
    
    /**
     * Draw the maze walls and paths
     */
    drawMaze() {
        for (let y = 0; y < this.GRID_SIZE; y++) {
            for (let x = 0; x < this.GRID_SIZE; x++) {
                const cellX = x * this.CELL_SIZE;
                const cellY = y * this.CELL_SIZE;
                
                if (this.maze[y][x] === 1) {
                    // Draw wall
                    this.ctx.fillStyle = '#8B4513'; // Saddle brown
                    this.ctx.fillRect(cellX, cellY, this.CELL_SIZE, this.CELL_SIZE);
                    
                    // Add texture to walls
                    this.ctx.fillStyle = '#A0522D';
                    this.ctx.fillRect(cellX + 2, cellY + 2, this.CELL_SIZE - 4, this.CELL_SIZE - 4);
                } else {
                    // Draw path
                    this.ctx.fillStyle = '#90EE90'; // Light green
                    this.ctx.fillRect(cellX, cellY, this.CELL_SIZE, this.CELL_SIZE);
                    
                    // Add subtle path texture
                    this.ctx.fillStyle = '#98FB98';
                    this.ctx.fillRect(cellX + 1, cellY + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                }
            }
        }
    }
    
    /**
     * Draw the goal tile with koru symbol
     */
    drawGoal() {
        const goalX = this.goal.x * this.CELL_SIZE;
        const goalY = this.goal.y * this.CELL_SIZE;
        
        // Goal background with glow effect
        this.ctx.fillStyle = '#FFD700'; // Gold
        this.ctx.fillRect(goalX, goalY, this.CELL_SIZE, this.CELL_SIZE);
        
        // Glow effect
        this.ctx.fillStyle = '#FFA500';
        this.ctx.fillRect(goalX + 3, goalY + 3, this.CELL_SIZE - 6, this.CELL_SIZE - 6);
        
        // Draw koru-inspired spiral
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const centerX = goalX + this.CELL_SIZE / 2;
        const centerY = goalY + this.CELL_SIZE / 2;
        
        // Simple spiral pattern
        for (let i = 0; i < 20; i++) {
            const angle = i * 0.3;
            const radius = i * 0.8;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Draw the player (kiwi fruit)
     */
    drawPlayer() {
        const playerX = this.player.x * this.CELL_SIZE;
        const playerY = this.player.y * this.CELL_SIZE;
        
        // Draw kiwi emoji or simple kiwi representation
        this.ctx.font = `${this.CELL_SIZE - 8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Try to use kiwi emoji, fallback to simple representation
        const kiwiEmoji = '🥝';
        this.ctx.fillText(
            kiwiEmoji,
            playerX + this.CELL_SIZE / 2,
            playerY + this.CELL_SIZE / 2
        );
        
        // Add a subtle shadow for better visibility
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillText(
            kiwiEmoji,
            playerX + this.CELL_SIZE / 2 + 1,
            playerY + this.CELL_SIZE / 2 + 1
        );
        
        // Reset fill style
        this.ctx.fillStyle = '#000';
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KiwiMazeGame();
});
