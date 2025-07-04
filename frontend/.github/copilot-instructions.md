# GitHub Copilot Instructions

## Project Overview
This project is a prototype for face comparison using a Vite + React + Tailwind CSS frontend and a FastAPI backend with DeepFace and MTCNN.

## Copilot Usage Guidelines
- Use React functional components and hooks (e.g., useState, useEffect).
- Use Tailwind CSS for all styling.
- All API calls to the backend should use fetch and handle errors gracefully.
- UI must have 4 input fields for image URLs, a Compare button, and a 2x2 grid to display the images with tick/cross icons.
- Show a green tick if a face matches any other, or a red cross if not, based on backend response.
- Keep code modular: separate components for input form, image grid, and result icons.
- Use clear, concise variable and function names.
- Add comments for non-obvious logic.
- Ensure the UI is responsive and visually clean.

## File Structure
- `src/components/` for React components
- `src/App.jsx` for main app logic
- `src/index.css` for Tailwind imports

## Testing
- Manual testing: run backend and frontend locally, use public face image URLs, verify correct tick/cross display.

## Documentation
- Update README with setup and usage instructions if changes are made.

---
