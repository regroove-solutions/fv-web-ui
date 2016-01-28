package ca.bc.gov.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class AncestryEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "ancestry";

	public AncestryEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode wordJsonObject = constructAncestryJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(wordJsonObject);
	}

	private ObjectNode constructAncestryJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		/*
		 * Process fvancestry values
		 */
		String languageFamilyId = (String) doc.getProperty("fvancestry", "family");
		if (languageFamilyId != null && !languageFamilyId.equals("")) {
			IdRef languageFamilyRef = new IdRef(languageFamilyId);
			DocumentModel languageFamilyDoc = null;
			languageFamilyDoc = session.getDocument(languageFamilyRef);
			ObjectNode languageFamilyObj = mapper.createObjectNode();
			languageFamilyObj.put("uid", languageFamilyId);
			languageFamilyObj.put("dc:title", languageFamilyDoc.getTitle());
			jsonObj.put("family", languageFamilyObj);
		}

		String languageId = (String) doc.getProperty("fvancestry", "language");
		if (languageId != null && !languageId.equals("")) {
			IdRef languageRef = new IdRef(languageId);
			DocumentModel languageDoc = null;
			languageDoc = session.getDocument(languageRef);
			ObjectNode languageObj = mapper.createObjectNode();
			languageObj.put("uid", languageId);
			languageObj.put("dc:title", languageDoc.getTitle());
			jsonObj.put("language", languageObj);
		}

		String dialectId = (String) doc.getProperty("fvancestry", "dialect");
		if (dialectId != null && !dialectId.equals("")) {
			IdRef dialectRef = new IdRef(dialectId);
			DocumentModel dialectDoc = null;
			dialectDoc = session.getDocument(dialectRef);
			ObjectNode dialectObj = mapper.createObjectNode();
			dialectObj.put("uid", dialectId);
			dialectObj.put("dc:title", dialectDoc.getTitle());
			jsonObj.put("dialect", dialectObj);
		}

		return jsonObj;
	}
}