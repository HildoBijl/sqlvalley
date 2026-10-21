import annaPicture from './portraits/anna.svg'
import bobPicture from './portraits/bob.svg'
import carlPicture from './portraits/carl.svg'

export const characters = {
	anna: { name: 'Anna Adams', picture: annaPicture },
	bob: { name: 'Bob Barlow', picture: bobPicture },
	carl: { name: 'Carl Caspian', picture: carlPicture },
	paris: { name: 'Paris Morgan', picture: annaPicture },
}

export type CharacterId = keyof typeof characters
