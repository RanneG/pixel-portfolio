# Portfolio Data Configuration

This directory contains all customizable portfolio data in JSON format.

## File Structure

- **`personal.json`** - Personal information (name, bio, contact, social links)
- **`stats.json`** - Character stats (projects count, level, attributes, experience)
- **`skills.json`** - Skills and categories
- **`projects.json`** - Project portfolio items
- **`config.json`** - Site-wide configuration (title, theme, features)
- **`development.json`** - Development environment overrides
- **`production.json`** - Production environment overrides

## How It Works

1. The app loads JSON files from `/data/` at runtime
2. Environment-specific overrides are applied (dev vs production)
3. Data is merged and provided through `PortfolioDataContext`
4. Fallback defaults are used if files are missing

## Editing Data

### Option 1: Direct JSON Editing
Edit the JSON files directly. Changes will be reflected after:
- **Development**: Hot-reloads every 5 seconds
- **Production**: Requires rebuild/redeploy

### Option 2: Admin Panel (Development Only)
1. Run `npm run dev`
2. Click the ⚙ button in bottom-left corner
3. Edit fields in the admin panel
4. Changes are saved to localStorage for preview
5. Export JSON to update files permanently

## Environment Overrides

### Development (`development.json`)
```json
{
  "overrides": {
    "personal": {
      "contact": {
        "email": "dev@example.dev"
      }
    }
  }
}
```

### Production (`production.json`)
```json
{
  "overrides": {
    "config": {
      "features": {
        "analytics": true
      }
    }
  }
}
```

## Type Safety

All JSON files are validated against TypeScript interfaces:
- `PersonalData`
- `StatsData`
- `SkillsData`
- `ProjectsData`
- `SiteConfig`

See `src/types/index.ts` for type definitions.

## Best Practices

1. **Keep JSON valid** - Use a JSON validator
2. **Backup before changes** - Version control your configs
3. **Test in dev first** - Use admin panel for quick edits
4. **Use environment overrides** - Don't hardcode env-specific values
5. **Export from admin panel** - For complex changes, use the export feature

## Example: Adding a New Project

Edit `projects.json`:
```json
{
  "projects": [
    {
      "title": "MY NEW PROJECT",
      "difficulty": "EPIC",
      "status": "COMPLETED",
      "description": "A cool project description",
      "xp": 2000,
      "stars": 4,
      "tech": ["REACT", "TYPESCRIPT"],
      "githubUrl": "https://github.com/user/repo",
      "liveUrl": "https://project.com",
      "questId": "NP-001"
    }
  ]
}
```

---

**Happy Customizing! 🎮**

