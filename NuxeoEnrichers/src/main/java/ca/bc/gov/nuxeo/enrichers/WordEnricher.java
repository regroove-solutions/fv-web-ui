package ca.bc.gov.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class WordEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "word";

	public WordEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode wordJsonObject = constructWordJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(wordJsonObject);
	}

	private ObjectNode constructWordJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = (String) doc.getType();

		/*
		 * Properties for FVWord
		 */
		if (documentType.equalsIgnoreCase("FVWord")) {
			
			// Process "fv-word:categories" values
			String[] categoryIds = (String[]) doc.getProperty("fv-word", "categories");
			ArrayNode categoryArray = mapper.createArrayNode();
			for (String categoryId : categoryIds) {
				IdRef ref = new IdRef(categoryId);
				DocumentModel categoryDoc = null;
				// Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
				try {
					categoryDoc = session.getDocument(ref);
				} catch (DocumentNotFoundException de) {
					continue;
				}

				ObjectNode categoryObj = mapper.createObjectNode();
				categoryObj.put("uid", categoryId);
				categoryObj.put("dc:title", categoryDoc.getTitle());
				categoryArray.add(categoryObj);
			}
			jsonObj.put("categories", categoryArray);

			// Process "fv-word:part_of_speech" value
			String partOfSpeechId = (String) doc.getProperty("fv-word",	"part_of_speech");
			DirectoryService directoryService = Framework.getLocalService(DirectoryService.class);
			Session directorySession = directoryService.open("parts_of_speech");
			String partOfSpeechLabel = "";
			if (!partOfSpeechId.isEmpty() && partOfSpeechId != null) {
				// Create a query filter
				Map<String, Serializable> queryFilter = new HashMap<String, Serializable>();
				queryFilter.put("id", partOfSpeechId);

				// Execute the query, wrapped in a DocumentModel list
				DocumentModelList queryResult = directorySession.query(queryFilter);
				DocumentModel partOfSpeechDoc = queryResult.get(0);
				if (partOfSpeechDoc != null) {
					partOfSpeechLabel = partOfSpeechDoc.getProperty("xvocabulary:label").getValue(String.class);
				}
			}
			directorySession.close();
			jsonObj.put("part_of_speech", partOfSpeechLabel);

			// Process "fvcore:source" values
			String[] sourceIds = (String[]) doc.getProperty("fvcore", "source");
			if (sourceIds != null) {
				ArrayNode sourceArray = mapper.createArrayNode();
				for (String sourceId : sourceIds) {
					IdRef ref = new IdRef(sourceId);
					DocumentModel sourceDoc = null;
					// Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
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