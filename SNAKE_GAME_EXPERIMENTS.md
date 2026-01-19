# 🐍 Snake Game Experiments - Branching Strategy

## Overview

Two experimental branches explore different Snake game implementations while preserving the stable version on `main`.

## 🌳 Branch Structure

```
main (stable/production)
├── snake/transparent-overlay (1-2 hour experiment)
│   └── Goal: Make snake visually crawl OVER portfolio with transparent canvas
└── snake/eats-website (weekend experiment)
    └── Goal: Snake literally EATS and INCORPORATES portfolio elements into its body
```

## 🎯 Experiment 1: Transparent Overlay Branch

**Branch Name:** `snake/transparent-overlay`  
**Time Estimate:** 1-2 hours  
**Success Criteria:** Snake is clearly visible crawling over all portfolio sections  
**Risk Level:** Low (visual changes only)

### Implementation Goals

1. **TRANSPARENT FULLSCREEN CANVAS OVERLAY**
   - Canvas covers entire viewport
   - Transparent background
   - Portfolio remains visible and interactive underneath
   - `pointer-events-none` on canvas to allow interactions

2. **HIGH-VISIBILITY SNAKE DESIGN**
   - Cyan snake head with black outline and glow
   - Magenta body segments with outlines
   - Visible on ALL portfolio backgrounds (dark Hero, medium cards, etc.)
   - Element food: Green star (★) with gold glow
   - Random food: Yellow square with red outline

3. **CONTRAST DETECTION SYSTEM**
   - Sample background color under snake head
   - Auto-adjust outlines if contrast ratio < 4.5
   - White outlines on dark backgrounds

4. **VISUAL ENHANCEMENTS**
   - Drop shadows on all game elements
   - Subtle pulsing animation on snake head
   - Particle trail behind snake head
   - "Ripple" effect when eating near portfolio elements

5. **PERFORMANCE OPTIMIZATION**
   - requestAnimationFrame for 60FPS
   - Object pooling for particles
   - Throttle background sampling to 10fps
   - CSS `will-change: transform` on canvas

### Merge Criteria
- ✅ Snake visible on all portfolio sections
- ✅ No performance issues (>50 FPS)
- ✅ Portfolio remains interactive
- ✅ Code review passes

---

## 🎨 Experiment 2: "Snake Eats Website" Branch

**Branch Name:** `snake/eats-website`  
**Time Estimate:** 6-10 hours (weekend project)  
**Success Criteria:** Portfolio elements detach and become snake body segments  
**Risk Level:** High (architectural changes)

### Implementation Goals

1. **CORE CONCEPT**
   - Snake head follows mouse OR arrow keys
   - Portfolio elements detach when "eaten"
   - Elements become physical snake body segments
   - Portfolio progressively "disappears" as snake grows

2. **ARCHITECTURE REDESIGN**

   **Phase 1: Snake Head as Interactive Element**
   - Mouse-following head OR arrow-key controlled DIV
   - Fixed position, high z-index
   - Pointer events disabled on head

   **Phase 2: Element Detachment System**
   - Clone and detach DOM elements with animation
   - FLIP animation to snake tail position
   - Original element shows "eaten" placeholder
   - Smooth transition animations

   **Phase 3: Snake Body Management**
   - Segments follow head with easing
   - Each segment maintains reference to original element
   - Dynamic positioning system

3. **VISUAL EFFECTS**
   - "Bite" animation on elements (clip-path)
   - Connector lines between segments (SVG)
   - Grayscale filter on eaten elements
   - Smooth following with easing

4. **GAME MECHANICS**
   - AABB collision detection (head vs elements)
   - Scoring: +20 for elements, +10 for random food
   - Combo bonus for consecutive elements
   - "Full website completion" bonus

5. **PROGRESSIVE ENHANCEMENT**
   - Toggle between classic and experimental modes
   - Settings panel option to switch modes
   - Fallback to classic if experimental fails

### Evaluation Criteria
- ✅ At least 3 elements can detach and follow
- ✅ Animation smoothness acceptable
- ✅ No breaking portfolio functionality
- ✅ User testing positive feedback

### Rollback Plan
If too complex after 4 hours:
- Salvage best ideas for transparent overlay
- Document learnings
- Delete branch, return to main

---

## 🔄 Git Workflow Commands

### Initial Setup (Completed)
```bash
git checkout main
git pull origin main
git commit -m "feat: add SnakeGame component with portfolio element integration"
git push origin main

# Created branches
git checkout -b snake/transparent-overlay
git checkout -b snake/eats-website
git push -u origin snake/transparent-overlay
git push -u origin snake/eats-website
```

### Daily Workflow

**Switch to experiment branch:**
```bash
git checkout snake/transparent-overlay  # or snake/eats-website
# ... make changes ...
git add .
git commit -m "feat: description of changes"
```

**Merge successful experiment to main:**
```bash
git checkout main
git merge snake/transparent-overlay --no-ff
git push origin main
```

**Compare branches:**
```bash
git diff main..snake/transparent-overlay
git diff snake/transparent-overlay..snake/eats-website
```

**View all branches:**
```bash
git branch -av
```

**Abandon failed experiment:**
```bash
git checkout main
git branch -D snake/eats-website  # Delete locally
git push origin --delete snake/eats-website  # Delete remote
```

---

## 📊 Success Metrics

### Transparent Overlay Branch
- [ ] Snake visible on all portfolio sections
- [ ] Maintains 60 FPS during gameplay
- [ ] Portfolio remains fully interactive
- [ ] No console errors or warnings
- [ ] Works on mobile devices

### Eats Website Branch
- [ ] Minimum 3 elements can detach successfully
- [ ] Animation framerate > 30 FPS
- [ ] No broken portfolio functionality
- [ ] Elements correctly follow snake head
- [ ] Game over screen still works

---

## ⏱️ Timeline

### Week 1: Transparent Overlay (Priority)
- **Day 1 (Today):** Implement transparent fullscreen canvas
- **Day 2:** Add contrast detection and visual enhancements
- **Day 3:** Testing and optimization
- **Day 4:** Merge to main if successful

### Week 2: Eats Website (If time permits)
- **Day 1:** Mouse-following head implementation
- **Day 2:** Element detachment animations
- **Day 3:** Body segment following system
- **Day 4:** Polish, performance, edge cases

---

## 🚨 Risk Mitigation

1. **Time Boxing:** Each experiment has strict time limits
2. **Frequent Commits:** Commit every working change
3. **Regular Testing:** Test on actual portfolio after each major change
4. **Backup Strategy:** Keep experimental branches isolated
5. **Progressive Rollout:** Merge only stable, tested features

---

## 🎮 Final Deliverable Options

### Option A (Both Successful)
- `main`: Transparent overlay as default
- Experimental mode toggle in Settings Panel
- Users choose their experience

### Option B (Overlay Only)
- `main`: Polished transparent overlay
- Archive ambitious branch as learning experience
- Consider for future portfolio v2

### Option C (Neither)
- Revert to current working snake on main
- Document experiments for future reference
- Focus on core portfolio features

---

## 📝 Implementation Prompts

### For snake/transparent-overlay branch:
See the detailed implementation prompt in the original request. Focus on making the snake visually crawl OVER the portfolio with high contrast and visibility.

### For snake/eats-website branch:
See the detailed implementation prompt in the original request. Focus on making portfolio elements physically detach and become snake body segments.

---

## ✅ Current Status

- [x] Branches created
- [x] Branches pushed to remote
- [x] Baseline committed to main
- [ ] Transparent overlay implemented
- [ ] Eats website implemented

---

**Last Updated:** $(date)  
**Current Branch:** Check with `git branch`

