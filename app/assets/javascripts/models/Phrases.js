import { Collection } from 'backbone';
import Phrase from 'models/Phrase';

export default class Phrases extends Collection {

	constructor (options) {
		super(options);
		this.model = Phrase;
	}
}