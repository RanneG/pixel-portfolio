# Desktop audio licensing (ElevenLabs)

## Current setup (free tier)

| Asset | Source | License note |
|-------|--------|----------------|
| `public/audio/bios-welcome.mp3` | ElevenLabs TTS (Sarah) | Free tier — **attribution required** for public use |
| `public/audio/bios-loading.mp3` | ElevenLabs TTS | Same |
| `public/audio/login-confirm.mp3` | ElevenLabs TTS | Same |
| `public/audio/desktop-fm.mp3` | SoundHelix placeholder | **Not** ElevenLabs — replace after Starter upgrade |

The site shows an **ElevenLabs attribution** link in the Win98 taskbar tray while voice clips use the free plan.

## Before treating audio as “shipped” on rannegerodias.com

Choose one:

1. **Stay on free** — keep attribution visible; verify [ElevenLabs pricing](https://elevenlabs.io/pricing) terms on ship day.
2. **Upgrade to Starter (~$6/mo)** — commercial license for TTS clips; enables **Music API** to regenerate `desktop-fm.mp3` via `elevenlabs-gen music` in linkup_mcp.

Regenerate voice assets from **linkup_mcp**:

```bash
uv run elevenlabs-gen tts "Welcome to my portfolio website." -o ../pixel-portfolio/public/audio/bios-welcome.mp3
uv run elevenlabs-gen tts "Loading portfolio." -o ../pixel-portfolio/public/audio/bios-loading.mp3
uv run elevenlabs-gen tts "Welcome back." -o ../pixel-portfolio/public/audio/login-confirm.mp3
# After paid plan:
uv run elevenlabs-gen music "Windows 98 desktop ambient..." -o ../pixel-portfolio/public/audio/desktop-fm.mp3 --length-ms 45000
```
