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
import org.nuxeo.ecm.core.api.NuxeoPrincipal;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import ca.firstvoices.nuxeo.utils.EnricherUtils;

import org.nuxeo.ecm.core.api.security.ACE;
import org.nuxeo.ecm.core.api.security.SecurityConstants;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class DialectEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "dialect";

	public DialectEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode dialectJsonObject = constructDialectJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(dialectJsonObject);
	}

	private ObjectNode constructDialectJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = doc.getType();

		/*
		 * Properties for FVDialect
		 */
		if (documentType.equalsIgnoreCase("FVDialect")) {

			// Process "fvdialect:keyboards" values
			String[] keyboardLinkIds = (String[]) doc.getProperty("fvdialect", "keyboards");
			if (keyboardLinkIds != null) {
				ArrayNode keyboardJsonArray = mapper.createArrayNode();
				for (String keyboardId : keyboardLinkIds) {
					ObjectNode keyboardJsonObj = EnricherUtils.getLinkJsonObject(keyboardId, session);
					if(keyboardJsonObj != null) {
						keyboardJsonArray.add(keyboardJsonObj);
					}
				}
				jsonObj.put("keyboards", keyboardJsonArray);
			}


			ArrayNode roles = mapper.createArrayNode();

			// Show has permission
			if (session.hasPermission(doc.getRef(), "Record")) {
				roles.add("Record");
			}

			if (session.hasPermission(doc.getRef(), "Approve")) {
				roles.add("Approve");
			}

			if (session.hasPermission(doc.getRef(), SecurityConstants.EVERYTHING)) {
				roles.add("Manage");
			}

			// Test explicitly for members
			NuxeoPrincipal principal = (NuxeoPrincipal) session.getPrincipal();

			for (ACE ace : doc.getACP().getACL("local").getACEs()){
				if (SecurityConstants.READ.equals(ace.getPermission())) {
					if (principal.isMemberOf(ace.getUsername())) {
						roles.add("Member");
						break;
					}
				}
			}

			jsonObj.put("roles", roles);
		}

		return jsonObj;
	}
}