# ApniLab Custom Icon Assets Directory

This folder is the designated storage location for the application's reference image assets:

| File Name | Purpose / Target Item | Visual Specification |
|---|---|---|
| `completed.png` | Completed Metric & Badges | Green circular icon with a white tick |
| `lab-hours.png` | Lab Practice Hours Metric | Blue clock/stopwatch illustration |
| `active-streak.png` | Active Day Streak Metric | Orange/yellow flame icon |
| `avg-score.png` | Average Score Metric | Blue calendar-style icon containing the word "SCORE" |
| `ohms-law.png` | Ohm's Law Experiment Card & Simulator | Black uppercase Greek omega symbol (Ω) |
| `pendulum.png` | SHM & Simple Pendulum Experiment Card | Pendulum with swinging bob and curved motion arrow |
| `physics.png` | Physics Discipline Card & Header | Dark-blue physics illustration with graphs, equations, and a magnet |

### Image Specifications:
- **Format:** Transparent PNG or WebP
- **Recommended Dimensions:** 128x128 px or 256x256 px (square 1:1 aspect ratio)
- **Component Handler:** Rendered via `<AppIcon />` using React Native `<Image resizeMode="contain" />` with dynamic SVG fallbacks.
