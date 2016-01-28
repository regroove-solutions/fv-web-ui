import { Collection } from 'backbone';
import LanguageFamily from 'models/LanguageFamily';

export default class LanguageFamilies extends Collection {

	constructor (options) {
		super(options);
		this.model = LanguageFamily;
	}
}