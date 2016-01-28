package ca.bc.gov.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class PhraseEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "phrase";

	public PhraseEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode wordJsonObject = constructPhraseJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(wordJsonObject);
	}

	private ObjectNode constructPhraseJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = (String) doc.getType();

		/*
		 * Properties for FVPhrase
		 */
		if (documentType.equalsIgnoreCase("FVPhrase")) {

			// Process "fv-phrase:phrase_books" values
			String[] phraseBookIds = (String[]) doc.getProperty("fv-phrase", "phrase_books");
			ArrayNode phraseBookArray = mapper.createArrayNode();
			for (String phraseBookId : phraseBookIds) {
				IdRef ref = new IdRef(phraseBookId);
				DocumentModel phraseBookDoc = null;
				// Try to retrieve Nuxeo document. If it isn't found, continue
				// to next iteration.
				try {
					phraseBookDoc = session.getDocument(ref);
				} catch (DocumentNotFoundException de) {
					continue;
				}

				ObjectNode phraseBookObj = mapper.createObjectNode();
				phraseBookObj.put("uid", phraseBookId);
				phraseBookObj.put("dc:title", phraseBookDoc.getTitle());
				phraseBookArray.add(phraseBookObj);
			}
			jsonObj.put("phrase_books", phraseBookArray);

			// Process "fvcore:source" values
			String[] sourceIds = (String[]) doc.getProperty("fvcore", "source");
			if (sourceIds != null) {
				ArrayNode sourceArray = mapper.createArrayNode();
				for (String sourceId : sourceIds) {
					IdRef ref = new IdRef(sourceId);
					DocumentModel sourceDoc = null;
					// Try to retrieve Nuxeo document. If it isn't found,
					// continue to next iteration.
					try {
						sourceDoc = session.getDocument(ref);
					} catch (DocumentNotFoundException de) {
						continue;
					}

					ObjectNode sourceObj = mapper.createObjectNode();
					sourceObj.put("uid", sourceId);
					sourceObj.put("dc:title", sourceDoc.getTitle());
					sourceArray.add(sourceObj);
				}
				jsonObj.put("sources", sourceArray);
			}
		}

		return jsonObj;
	}
}