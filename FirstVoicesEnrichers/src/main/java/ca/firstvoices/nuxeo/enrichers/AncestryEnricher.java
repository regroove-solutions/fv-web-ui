package ca.firstvoices.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.UnrestrictedSessionRunner;
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

		/*
		 * Process fvancestry values
		 */

		// Process Language Family

		String languageFamilyId = (String) doc.getProperty("fvancestry", "family");

		if (languageFamilyId != null && !languageFamilyId.equals("")) {

		    // Allow access to workspace title and uid even for unauthenticated users via Unrestricted subclass
		    UnrestrictedGetDocumentAncestry ancestryFamilyResolver = new UnrestrictedGetDocumentAncestry(doc.getCoreSession(), languageFamilyId);
		    ancestryFamilyResolver.runUnrestricted();

		    if (ancestryFamilyResolver.resolvedDoc != null) {
		        ObjectNode languageFamilyObj = mapper.createObjectNode();
	            languageFamilyObj.put("uid", languageFamilyId);
	            languageFamilyObj.put("dc:title", ancestryFamilyResolver.resolvedDoc.getTitle());
	            jsonObj.put("family", languageFamilyObj);
		    }
		}

		// Process Language

		String languageId = (String) doc.getProperty("fvancestry", "language");

		if (languageId != null && !languageId.equals("")) {

		    // Allow access to workspace title and uid even for unauthenticated users via Unrestricted subclass
		    UnrestrictedGetDocumentAncestry ancestryLanguageResolver = new UnrestrictedGetDocumentAncestry(doc.getCoreSession(), languageId);
		    ancestryLanguageResolver.runUnrestricted();

		    if (ancestryLanguageResolver.resolvedDoc != null) {
		        ObjectNode languageObj = mapper.createObjectNode();
	            languageObj.put("uid", languageId);
	            languageObj.put("dc:title", ancestryLanguageResolver.resolvedDoc.getTitle());
	            jsonObj.put("language", languageObj);
		    }
		}

		// Process Dialect

		String dialectId = (String) doc.getProperty("fvancestry", "dialect");

		if (dialectId != null && !dialectId.equals("")) {

		    // Allow access to workspace title and uid even for unauthenticated users via Unrestricted subclass
		    UnrestrictedGetDocumentAncestry ancestryDialectResolver = new UnrestrictedGetDocumentAncestry(doc.getCoreSession(), dialectId);
		    ancestryDialectResolver.runUnrestricted();

		    if (ancestryDialectResolver.resolvedDoc != null) {
		        ObjectNode dialectDoc = mapper.createObjectNode();
	            dialectDoc.put("uid", dialectId);
	            dialectDoc.put("dc:title", ancestryDialectResolver.resolvedDoc.getTitle());
	            jsonObj.put("dialect", dialectDoc);
		    }
		}

		return jsonObj;
	}

    protected static class UnrestrictedGetDocumentAncestry extends UnrestrictedSessionRunner {

        protected final String docId;
        protected DocumentModel resolvedDoc = null;

        protected UnrestrictedGetDocumentAncestry(CoreSession session, String docId) {
            super(session);
            this.docId = docId;
        }

        @Override
        public void run() {
            IdRef docIdRef = new IdRef(docId);
            resolvedDoc = session.getDocument(docIdRef);
        }
    }
}