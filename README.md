# Nigeria Independence Day Art Competition 🇳🇬

An interactive, scene-based visual presentation celebrating Nigeria's independence, people, and national identity through animation, imagery, and audio.

The experience is designed as a **single-interaction website**: visitors watch the presentation and use one sound button to play or mute the audio.

## Tech Stack

- **React**
- **CSS**
- **HTML Canvas** for the particle animation

## Experience Flow

The presentation is arranged into scenes. Each scene has a distinct theme and transitions to the next as the story unfolds.

### 1. Nigeria in Space

The experience opens against a dark, space-inspired background with stars and small planets.

### 2. The Introduction

A narration introduces the story of Nigeria:

> “Once upon a time, there were a group of people with different tongues, culture, traditions, and location, joined together to become one. Those people are called, Nigeria.”

### 3. The Formation of Nigeria

Separate sections of the Nigerian map enter from different directions—east, west, north, and south—and come together to form the complete map.

This visual represents the coming together of different peoples and communities.

### 4. Our Languages

The presentation zooms into an area of the map to showcase Nigeria's linguistic diversity. The scene introduces the theme:

**“Our Languages”**

The view then zooms back out to the full map.

### 5. Our Heritage

The presentation zooms into another area to showcase Nigerian cities and places of historical significance.

The scene introduces the theme:

**“Our Heritage”**

The view zooms back out before the next scene.

### 6. Our Delicacies

The presentation zooms into another area to showcase Nigerian foods and delicacies.

The scene introduces the theme:

**“Our Delicacies”**

The view then returns to the full map.

### 7. Our Culture

The presentation zooms into another area to showcase Nigeria's cultural expressions and traditions.

The scene introduces the theme:

**“Our Culture”**

The presentation then transitions to the people who shaped the country's history.

### 8. Our People

The map scene gives way to a presentation of past Nigerian leaders and presidents, accompanied by the theme:

**“Our People, Who Fought and Remained One”**

This scene honours the people and leaders connected to Nigeria's journey and continued unity.

### 9. The Final Scene: The Nigerian Flag

The final scene retains the existing particle animation.

Using React and the HTML Canvas API, the presentation transforms words into particles, then brings those particles together to form the Nigerian flag.

This concludes the experience with a visual celebration of Nigeria's independence and unity.

## Interaction Design

The website is intentionally designed to be a single-interaction experience.

- Visitors watch the presentation in sequence.
- A sound button lets visitors play or mute the audio.
- There are no menus or additional navigation flows planned.

## Project Direction

The project is evolving into an **Independence Day art presentation** rather than a conventional informational website. Its primary purpose is to tell a visual story about Nigeria through motion, narration, geography, culture, food, heritage, and people.

The focus is on creating a cohesive, cinematic experience in which each scene contributes to the overall story.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Deployment

The project is configured for deployment as a React website. If hosted on GitHub Pages under a repository path, ensure Vite's `base` setting matches that repository path and that public asset URLs respect `import.meta.env.BASE_URL`.

## Vision

To celebrate Nigeria's independence through a short, immersive art experience that honours the country's diversity and presents its many peoples, languages, traditions, cities, delicacies, and leaders as parts of one nation.
