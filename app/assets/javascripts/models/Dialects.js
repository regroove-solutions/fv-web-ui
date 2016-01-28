import { Collection } from 'backbone';
import Dialect from 'models/Dialect';

export default class Dialects extends Collection {

	constructor (options) {
		super(options);
		this.model = Dialect;
	}
}