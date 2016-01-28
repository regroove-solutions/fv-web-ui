import { Collection } from 'backbone';
import Language from 'models/Language';

export default class Languages extends Collection {

	constructor (options) {
		super(options);
		this.model = Language;
	}
}