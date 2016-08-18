package ca.firstvoices.nuxeo.enrichers;

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

import ca.firstvoices.nuxeo.utils.EnricherUtils;


@Setup(mode = SINGLETON, priority = REFERENCE)
public class CharacterEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "character";

	public CharacterEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode characterJsonObject = constructCharacterJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(characterJsonObject);
	}

	private ObjectNode constructCharacterJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = doc.getType();

		/*
		 * Properties for FVCharacter
		 */
		if (documentType.equalsIgnoreCase("FVCharacter")) {

			// Process "fv:related_audio" values
			String[] audioIds = (String[]) doc.getProperty("fvcore", "related_audio");
			if (audioIds != null) {
				ArrayNode audioJsonArray = mapper.createArrayNode();
				for (String audioId : audioIds) {
					ObjectNode binaryJsonObj = EnricherUtils.getBinaryPropertiesJsonObject(audioId, session);
					if(binaryJsonObj != null) {
						audioJsonArray.add(binaryJsonObj);
					}
				}
				jsonObj.put("related_audio", audioJsonArray);
			}
		}

		return jsonObj;
	}
}