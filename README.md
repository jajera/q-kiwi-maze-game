# 🥝 Kiwi Maze Escape

A fun, accessible maze game where you guide a kiwi fruit to the goal using your keyboard.

## 🎮 Game Features

- **Procedurally Generated Mazes**: Each game features a unique maze created using advanced recursive backtracking algorithms
- **Guaranteed Solvability**: Every maze is guaranteed to have at least one path from start to finish using A* pathfinding verification
- **Accessible Design**: Full keyboard navigation with screen reader support and ARIA labels
- **Visual Feedback**: Smooth animations and visual effects for an engaging experience
- **Audio Feedback**: Web Audio API sound effects for moves and victory
- **Move Counter**: Track your efficiency with a move counter
- **Responsive Design**: Works on desktop and mobile devices

## 🕹️ How to Play

1. **Objective**: Guide the kiwi fruit (🥝) from the starting position to the goal (🎯)
2. **Controls**: Use arrow keys to move the kiwi fruit through the maze
   - ↑ Arrow Key: Move up
   - ↓ Arrow Key: Move down
   - ← Arrow Key: Move left
   - → Arrow Key: Move right
3. **Goal**: Reach the target in the fewest moves possible
4. **New Game**: Click "New Game" to generate a fresh maze

## 🛠️ Technical Features

### Maze Generation

- **Recursive Backtracking**: Creates complex, solvable mazes with guaranteed connectivity
- **A* Pathfinding**: Ensures optimal path verification and creation when needed
- **Smart Path Addition**: Adds extra paths strategically to create multiple solution routes
- **Random Openings**: Introduces variety with carefully placed openings

### Accessibility

- **Keyboard Navigation**: Full game control via keyboard
- **ARIA Labels**: Screen reader compatible with descriptive labels
- **Focus Management**: Proper focus handling for keyboard users
- **High Contrast**: Clear visual distinction between walls, paths, player, and goal

### Performance

- **Canvas Rendering**: Smooth 60fps rendering using HTML5 Canvas
- **Efficient Algorithms**: Optimized pathfinding and maze generation
- **Responsive Layout**: Adapts to different screen sizes

## 🚀 Getting Started

1. **Clone or Download**: Get the game files to your local machine
2. **Open**: Simply open `index.html` in any modern web browser
3. **Play**: Start playing immediately - no installation required!

## 🎯 Game Mechanics

- **Player**: Represented by a kiwi fruit emoji (🥝)
- **Goal**: Represented by a target emoji (🎯)
- **Walls**: Dark barriers that block movement
- **Paths**: Light areas where the kiwi fruit can move
- **Move Counting**: Every valid move increments the counter
- **Victory Condition**: Reaching the goal triggers celebration and move summary

## 🔧 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **HTML5 Canvas**: Required for game rendering
- **Web Audio API**: Optional for sound effects
- **ES6 Features**: Modern JavaScript features used

## 📱 Mobile Support

The game is fully responsive and works on mobile devices:

- Touch-friendly interface
- Responsive canvas sizing
- Mobile-optimized controls

## 🎨 Customization

The game is built with modular code that allows for easy customization:

- Maze size can be adjusted via `GRID_SIZE` constant
- Visual styling can be modified in `style.css`
- Game mechanics can be extended in `script.js`

## 🏆 Challenge Yourself

- Try to complete mazes in the minimum number of moves
- Generate multiple mazes to find the most challenging ones
- Time yourself to add a speed element to the game

## 🤝 Contributing

This is an open-source project. Feel free to:

- Report bugs or issues
- Suggest new features
- Submit improvements
- Share your high scores!

## 📄 License

This project is open source and available under the MIT License.

---

- **Enjoy navigating your kiwi fruit through the maze! 🥝🎯**
