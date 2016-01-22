import { Collection } from 'backbone';
import Word from 'models/Word';

export default class Words extends Collection {

	constructor (options) {
		super(options);
		this.model = Word;
	}
}