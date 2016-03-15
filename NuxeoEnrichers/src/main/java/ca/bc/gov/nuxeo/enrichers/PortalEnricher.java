package ca.bc.gov.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
import org.nuxeo.ecm.core.blob.binary.BinaryBlob;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class PortalEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "portal";

	public PortalEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode portalJsonObject = constructPortalJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(portalJsonObject);
	}

	private ObjectNode constructPortalJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = (String) doc.getType();

		/*
		 * Properties for FVPortal
		 */
		if (documentType.equalsIgnoreCase("FVPortal")) {
			
			// Process "fv-portal:featured_words" values
			String[] featuredWordsIds = (String[]) doc.getProperty("fv-portal", "featured_words");
			if (featuredWordsIds != null) {
				ArrayNode featuredWordJsonArray = mapper.createArrayNode();
				for (String featuredWordId : featuredWordsIds) {
					IdRef ref = new IdRef(featuredWordId);
					DocumentModel featuredWordDoc = null;
					// Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.

					try {
						featuredWordDoc = session.getDocument(ref);
					} catch (DocumentNotFoundException de) {
						continue;
					}
					
					ObjectNode featuredWordJsonObj = mapper.createObjectNode();
					featuredWordJsonObj.put("uid", featuredWordId);
					featuredWordJsonObj.put("dc:title", featuredWordDoc.getTitle());
									
					// Process "fv:literal translation" values
					Object literalTranslationObj = featuredWordDoc.getProperty("fvcore", "literal_translation");
					List<Object> literalTranslationList = (ArrayList<Object>) literalTranslationObj;
					ArrayNode literalTranslationJsonArray = mapper.createArrayNode();
					for(Object literalTranslationListItem : literalTranslationList) {
						Map<String, Object> complexValue = (HashMap<String, Object>) literalTranslationListItem;
						String language = (String) complexValue.get("language");
						String translation = (String) complexValue.get("translation");
						
						// Create JSON node and add it to the array
						ObjectNode literalTranslationJsonObj = mapper.createObjectNode();
						literalTranslationJsonObj.put("language", language);
						literalTranslationJsonObj.put("translation", translation);	
						literalTranslationJsonArray.add(literalTranslationJsonObj);
					}
					featuredWordJsonObj.put("fv:literal_translation", literalTranslationJsonArray);
					
					// Process "fv-word:part_of_speech" value
					String partOfSpeechId = (String) featuredWordDoc.getProperty("fv-word",	"part_of_speech");
					DirectoryService directoryService = Framework.getLocalService(DirectoryService.class);
					Session directorySession = directoryService.open("parts_of_speech");
					String partOfSpeechLabel = "";
					if (partOfSpeechId != null || !partOfSpeechId.isEmpty()) {
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
					featuredWordJsonObj.put("fv-word:part_of_speech", partOfSpeechLabel);
					
					// Process "fv:related_audio" values
					String[] relatedAudioIds = (String[]) featuredWordDoc.getPropertyValue("fv:related_audio");
					ArrayNode relatedAudioJsonArray = mapper.createArrayNode();
					
					for(String relatedAudioId : relatedAudioIds) {
						IdRef audioRef = new IdRef(relatedAudioId);
						DocumentModel audioDoc = null;
						ObjectNode relatedAudioJsonObj = null;
						// Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
						try {
							relatedAudioJsonObj = mapper.createObjectNode();
							audioDoc = session.getDocument(audioRef);
							
							BinaryBlob fileObj = (BinaryBlob)audioDoc.getProperty("file", "content");							
							String filename = fileObj.getFilename();
							String mimeType = fileObj.getMimeType();
							
							// Build JSON node
							relatedAudioJsonObj.put("uid", audioDoc.getId());
							relatedAudioJsonObj.put("name", filename);
							relatedAudioJsonObj.put("mime-type", mimeType);
							
							relatedAudioJsonArray.add(relatedAudioJsonObj);

						} catch (DocumentNotFoundException de) {
							continue;
						}
					}
					featuredWordJsonObj.put("fv:related_audio", relatedAudioJsonArray);

					featuredWordJsonArray.add(featuredWordJsonObj);
				}
				jsonObj.put("fv-portal:featured_words", featuredWordJsonArray);
			}
			
			// Process "fv-portal:audio" values
			String[] featuredAudioIds = (String[]) doc.getProperty("fv-portal", "featured_audio");
			if (featuredAudioIds != null) {
				ArrayNode featuredAudioJsonArray = mapper.createArrayNode();
				
				for (String featuredAudioId : featuredAudioIds) {
					IdRef ref = new IdRef(featuredAudioId);
					DocumentModel featuredAudioDoc = null;
					// Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.

					try {
						ObjectNode featuredAudioJsonObj = mapper.createObjectNode();
						featuredAudioDoc = session.getDocument(ref);
						
						BinaryBlob fileObj = (BinaryBlob)featuredAudioDoc.getProperty("file", "content");							
						String filename = fileObj.getFilename();
						String mimeType = fileObj.getMimeType();
						
						// Build JSON node
						featuredAudioJsonObj.put("uid", featuredAudioDoc.getId());
						featuredAudioJsonObj.put("name", filename);
						featuredAudioJsonObj.put("mime-type", mimeType);
						
						featuredAudioJsonArray.add(featuredAudioJsonObj);						
					} catch (DocumentNotFoundException de) {
						continue;
					}
				}
				jsonObj.put("fv-portal:featured_audio", featuredAudioJsonArray);
			}
		}

		return jsonObj;
	}
}