import { createSelector } from '@reduxjs/toolkit';

export const selectSortedNotebooks = createSelector(
  [(state) => state.notebooks.notebooks, (state) => state.notebooks.sortBy],
  (notebooks, sortBy) => {
    switch (sortBy) {
      case 'a-z':
        return [...notebooks].sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':
        return [...notebooks].sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
        return [...notebooks].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case 'oldest':
        return [...notebooks].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      default:
        return notebooks;
    }
  }
);
