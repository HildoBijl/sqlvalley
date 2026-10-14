// Dimensions for cards in pixels.
export const cardWidth = 160
export const cardHeight = 80

// The distance between the centers of two neighbouring cells. Cells are spaced at 1.5x the card size.
export const columnSpacing = cardWidth * 1.5
export const rowSpacing = cardHeight * 1.5

// How paths are displayed above/below cards.
export const maxPathSpace = cardWidth * 0.9 // The maximum width at a card that may be taken up by paths, when there are many.
export const initialPathSpacing = 16 // The horizontal spacing between paths when there is a small number of paths.
export const maxVerticalOffset = 16 // The vertical offset that is used for paths at the center.
export const minVerticalOffset = 10 // The vertical offset that is used for paths further away from the center.
