# Task App

A task management application built with **Vue 3** and **TypeScript**, created as a frontend project to practice modern web development, state management, component design and responsive UI.

The project started as a simple task manager and gradually evolved to include features such as tags, filters, subtasks, due dates and activity history.

## Features

* Create, edit and delete tasks
* Mark tasks as completed
* Undo task completion
* Add descriptions and due dates
* Create subtasks
* Track task completion progress
* Add up to 3 tags per task
* Create and manage tags
* Filter tasks by different criteria
* Task history and activity tracking
* Responsive interface for desktop and mobile
* Empty states and user feedback messages
* Persistent data through a JSON-based backend

## Tech Stack

* **Vue 3**
* **TypeScript**
* **Pinia** — state management
* **Vue Router**
* **Vite**
* **HTML**
* **CSS**
* **Lucide Icons**

## Project Structure

The application is organized around reusable Vue components, stores and composables.

```text
src/
├── components/       # Reusable UI components
├── views/            # Main application views
├── stores/           # Pinia stores
├── composables/      # Reusable application logic
├── utils/            # Utility functions
├── types/            # TypeScript types
└── router/           # Application routing
```

The state management uses a normalized structure where task IDs and task entities are kept separately, making task updates and lookups more straightforward.

## Main Concepts

### Tasks

Tasks support basic information such as:

* Title
* Description
* Due date
* Completion state
* Tags
* Subtasks

Subtasks are associated with their parent task, allowing tasks to have their own hierarchy and completion progress.

### Tags

Tasks can be associated with up to **3 tags**.

Tags have their own management system, including creation and removal. Removing a tag also handles its association with existing tasks.

### Filters

The application provides a filtering system that can combine different filter groups and display active filters as removable chips.

### History

Task-related actions are recorded in a history store, allowing the user to see previous activity grouped by date.

## State Management

Application state is handled with **Pinia**.

Different responsibilities are separated into stores, keeping the components focused mainly on presentation and user interaction.

Reusable logic is extracted into composables such as filtering, task state management and user messages.

## Running the Project

Clone the repository:

```bash
git clone <repository-url>
cd task-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## What I Learned

This project was mainly developed as a learning project, with the goal of becoming more comfortable with frontend development.

Through the project I practiced:

* Vue component architecture
* Composition API
* TypeScript
* Pinia and centralized state management
* Reactive data and computed properties
* Reusable composables
* CSS and responsive layouts
* Component-based UI design
* Managing relationships between tasks and subtasks
* Data normalization
* Frontend/backend communication
* Git and project organization
* Designing UI interactions and user feedback

It also helped me understand the difference between putting logic directly inside components and extracting reusable application logic into stores, composables and utilities.

## Future Improvements

This project is considered complete as a frontend learning project. Possible future improvements could include:

* Authentication
* A real backend and database
* User accounts
* Cloud persistence
* Task search
* More advanced sorting and filtering
* Drag-and-drop task organization

## Status

**Completed — Frontend learning project**

The main goal of this project was to learn and practice frontend development rather than build a production-ready task management platform.
