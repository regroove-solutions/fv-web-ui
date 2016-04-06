/**
 * 
 */

package ca.firstvoices.operations;

import java.io.Serializable;
import java.security.Principal;
import java.util.GregorianCalendar;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;
import org.nuxeo.ecm.core.query.sql.NXQL;

/**
 * @author cstuart
 */
@Operation(id=FVGenerateJsonStatistics.ID, category=Constants.CAT_FETCH, label="FVGenerateJsonStatistics", description="")
public class FVGenerateJsonStatistics {
	
    public static final String ID = "FVGenerateJsonStatistics";

    @Context
    protected CoreSession session;     

    @Param(name = "dialectPath")
    protected String dialectPath;     

    @Param(name = "docTypes")
    protected String[] docTypes;        
    
    protected String sectionDialectId;
    
    protected String principalName;
    
    protected int maxQueryResults = 10;
    
    protected ObjectMapper mapper = new ObjectMapper();

	protected final String BASE_DOCS_QUERY = "SELECT * FROM %s WHERE ecm:currentLifeCycleState <> 'deleted'";
//	protected final String BASE_DOCS_QUERY2 = "SELECT * FROM Document WHERE ecm:currentLifeCycleState <> 'deleted' AND ecm:primaryType='%s'";
	
//	protected final String BASE_DOCS_COUNT_QUERY = "SELECT COUNT(ecm:uuid) FROM %s WHERE ecm:currentLifeCycleState <> 'deleted'";
//	protected final String BASE_DOCS_COUNT_QUERY2 = "SELECT COUNT(ecm:uuid) FROM Document WHERE ecm:currentLifeCycleState <> 'deleted' AND ecm:primaryType='%s'";
	
    @OperationMethod
    public Blob run() {
    	
		// JSON object to be returned        
    	ObjectNode rootJsonObj = mapper.createObjectNode();
    	    	
		rootJsonObj.put("dialectPath", dialectPath);	
		
		// Get current user
    	Principal principal = session.getPrincipal();
    	principalName = principal.getName();		
		rootJsonObj.put("user", principalName);		
		
		// Generate statistics for each specified docType, and add them to the root JSON object
		for(String docType : docTypes) {
	    	ObjectNode jsonObj = generateDocumentStatsJson(docType);
			rootJsonObj.put(docType, jsonObj);				
		}			
        return new StringBlob(rootJsonObj.toString(), "application/json");    
    } 
    
    private ObjectNode generateDocumentStatsJson(String documentType) {
    	ObjectNode documentJsonObj = mapper.createObjectNode();
    	
    	// Query to get documents from the workspace
    	String baseDocumentsQuery = String.format(BASE_DOCS_QUERY, documentType);
    	
    	// Add additional query parameters depending on path
    	if(dialectPath.contains("/Workspaces/")) {
    		baseDocumentsQuery = baseDocumentsQuery + " AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0";
    	} 
    	else if(dialectPath.contains("/sections/")) {
    		baseDocumentsQuery = baseDocumentsQuery + " AND ecm:isProxy = 1";   		
    	}
   	    	
    	// Restrict the query to the specified dialect. Otherwise leave it empty
        String queryDialectRestriction = " AND ecm:path STARTSWITH '" + dialectPath + "'"; 		
    	
		IterableQueryResult totalDocsResult = session.queryAndFetch(baseDocumentsQuery + queryDialectRestriction, NXQL.NXQL);
		documentJsonObj.put("total", totalDocsResult.size());	

		// If the document uses the fv-lifecycle, get counts for documents in each lifecycle state
		if(hasFVLifecycle(documentType)) {		
		
			int newDocs = 0;
			int enabledDocs = 0;
			int disabledDocs = 0;
		    
			for (Map<String, Serializable> docResult : totalDocsResult) {
		        String value = (String) docResult.get("ecm:uuid");
		        DocumentRef docRef = new IdRef(value);
		        DocumentModel doc = session.getDocument(docRef);
		        if(doc.getCurrentLifeCycleState().equals("New")) {
		        	newDocs++;
		        }
		        else if(doc.getCurrentLifeCycleState().equals("Enabled")) {
		        	enabledDocs++;
		        }
		        else if(doc.getCurrentLifeCycleState().equals("Disabled")) {
		        	disabledDocs++;
		        }
		    }
			documentJsonObj.put("new", newDocs);
			documentJsonObj.put("enabled", enabledDocs);
			documentJsonObj.put("disabled", disabledDocs);
		}
		// Close the IterableQueryResult - important
		totalDocsResult.close();	        
			
	    // Query for the most recently modified docs
		IterableQueryResult mostRecentlyModifiedDocsResult = session.queryAndFetch(baseDocumentsQuery + queryDialectRestriction 
																+ " ORDER BY dc:modified DESC", NXQL.NXQL);
		// Loop through results and get the most recently modified docs
		int recentlyModifiedCount = 0;
	    ArrayNode recentlyModifiedJsonArray = mapper.createArrayNode();		
		for (Map<String, Serializable> docResult : mostRecentlyModifiedDocsResult) {
	        String value = (String) docResult.get("ecm:uuid");
	        DocumentRef docRef = new IdRef(value);
	        DocumentModel doc = session.getDocument(docRef);
	    	ObjectNode recentlyModifiedJsonObj = mapper.createObjectNode();
	    	recentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
	    	recentlyModifiedJsonObj.put("dc:title", doc.getTitle());
	    	recentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
	    	GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
	    	recentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
	    	recentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));	        
	    	recentlyModifiedJsonArray.add(recentlyModifiedJsonObj);
	    	
	    	recentlyModifiedCount++;
	    	if(recentlyModifiedCount >= maxQueryResults) {
	        	break;
	        }
	    }
	    documentJsonObj.put("most_recently_modified", recentlyModifiedJsonArray);					

	    // Loop through results again and get the current user most recently modified docs
		int userRecentlyModifiedCount = 0;	
		ArrayNode userRecentlyModifiedJsonArray = mapper.createArrayNode();		
		// Reset query results position to the beginning
		mostRecentlyModifiedDocsResult.skipTo(0);		
		for (Map<String, Serializable> docResult : mostRecentlyModifiedDocsResult) {
	        String value = (String) docResult.get("ecm:uuid");
	        DocumentRef docRef = new IdRef(value);
	        DocumentModel doc = session.getDocument(docRef);
	        // Match on the current users name
	        if(doc.getPropertyValue("dc:lastContributor").equals(principalName)) {
		    	ObjectNode userRecentlyModifiedJsonObj = mapper.createObjectNode();
		    	userRecentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
		    	userRecentlyModifiedJsonObj.put("dc:title", doc.getTitle());
		    	userRecentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
		    	GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
		    	userRecentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
		    	userRecentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));	        
		    	userRecentlyModifiedJsonArray.add(userRecentlyModifiedJsonObj);	        	
		    	
		    	userRecentlyModifiedCount++;
		    	if(userRecentlyModifiedCount >= maxQueryResults) {
		        	break;
		        }		    	
	        }
	    }		
	    documentJsonObj.put("user_most_recently_modified", userRecentlyModifiedJsonArray);

	    // Close the IterableQueryResult - important
		mostRecentlyModifiedDocsResult.close();	        

//	    
//	    // Get data about the users most recently modified docs
//	    ArrayNode userRecentlyModifiedJsonArray = mapper.createArrayNode();		
//		IterableQueryResult userRecentlyModifiedDocsResult = session.queryAndFetch(baseDocumentsQuery + queryDialectRestriction 
//																+ " AND dc:lastContributor = '" + principalName + "'"
//																+ " ORDER BY dc:modified DESC", NXQL.NXQL);
//		int userRecentlyModifiedCount = 0;
//		for (Map<String, Serializable> docResult : userRecentlyModifiedDocsResult) {
//	        String value = (String) docResult.get("ecm:uuid");
//	        DocumentRef docRef = new IdRef(value);
//	        DocumentModel doc = session.getDocument(docRef);
//	    	ObjectNode userRecentlyModifiedJsonObj = mapper.createObjectNode();
//	    	userRecentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
//	    	userRecentlyModifiedJsonObj.put("dc:title", doc.getTitle());
//	    	userRecentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
//	    	GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
//	    	userRecentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
//	    	userRecentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));	        
//	    	userRecentlyModifiedJsonArray.add(userRecentlyModifiedJsonObj);
//	    	
//	    	userRecentlyModifiedCount++;
//	    	if(userRecentlyModifiedCount >= maxQueryResults) {
//	        	break;
//	        }
//	    }
//		userRecentlyModifiedDocsResult.close();	        
//	    documentJsonObj.put("user_most_recently_modified", userRecentlyModifiedJsonArray);	

    	return documentJsonObj;
    }   
    
    // Only some of the FV document types use the fv-lifecycle (New/Enabled/Disabled)
    private boolean hasFVLifecycle(String documentType) {
    	if(documentType.matches("FVWord|FVPhrase|FVBook|FVAudio|FVPicture|FVVideo")) {
    		return true;
    	}
    	return false;
    }
}
