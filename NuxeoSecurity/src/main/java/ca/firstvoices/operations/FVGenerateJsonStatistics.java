/**
 * 
 */

package ca.firstvoices.operations;

import java.io.Serializable;
import java.security.Principal;
import java.text.SimpleDateFormat;
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
//	protected final String BASE_DOCS_QUERY = "SELECT * FROM Document WHERE ecm:currentLifeCycleState <> 'deleted' AND ecm:primaryType='%s'";
	
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
    	
		IterableQueryResult totalDocsResult = session.queryAndFetch(baseDocumentsQuery + queryDialectRestriction + " ORDER BY dc:modified DESC", NXQL.NXQL);
		documentJsonObj.put("total", totalDocsResult.size());	

		// If the document uses the fv-lifecycle
		if(hasFVLifecycle(documentType)) {		
		
			int newDocsCount = 0;
			int enabledDocsCount = 0;
			int disabledDocsCount = 0;
			int publishedDocsCount = 0;
			
			int docsWithoutImagesCount = 0;
			int docsWithoutAudioCount = 0;
			int docsWithoutVideoCount = 0;
			int docsWithoutSourceCount = 0;

			int docsModifiedTodayCount = 0;
			int docsCreatedTodayCount = 0;			
			
			ArrayNode recentlyModifiedJsonArray = mapper.createArrayNode();		
			ArrayNode userRecentlyModifiedJsonArray = mapper.createArrayNode();		
			
			// Loop through each document in the result and generate statistics
			for (Map<String, Serializable> docResult : totalDocsResult) {
		        String value = (String) docResult.get("ecm:uuid");
		        DocumentRef docRef = new IdRef(value);
		        DocumentModel doc = session.getDocument(docRef);		      	        
		    			    			        
		    	// Count document states
		        if(doc.getCurrentLifeCycleState().equals("New")) {
		        	newDocsCount++;
		        }
		        else if(doc.getCurrentLifeCycleState().equals("Enabled")) {
		        	enabledDocsCount++;
		        }
		        else if(doc.getCurrentLifeCycleState().equals("Disabled")) {
		        	disabledDocsCount++;
		        }
		        else if(doc.getCurrentLifeCycleState().equals("Published")) {
		        	publishedDocsCount++;
		        }
		        
		        // Check for missing properties
		        String[] relatedPictures = (String[]) doc.getProperty("fvcore", "related_pictures");		        
		        if(relatedPictures.length == 0) {
		        	docsWithoutImagesCount++;
		        }
		        String[] relatedAudio = (String[]) doc.getProperty("fvcore", "related_audio");		        
		        if(relatedAudio.length == 0) {
		        	docsWithoutAudioCount++;
		        }
		        String[] relatedVideo = (String[]) doc.getProperty("fvcore", "related_videos");		        
		        if(relatedVideo.length == 0) {
		        	docsWithoutVideoCount++;
		        }		        
		        String[] source = (String[]) doc.getProperty("fvcore", "source");		        
		        if(source.length == 0) {
		        	docsWithoutSourceCount++;
		        }
		       
		        GregorianCalendar gregorianCalendar = new GregorianCalendar();            
		        int currentMonth = gregorianCalendar.get(GregorianCalendar.MONTH);            
		        int currentDay = gregorianCalendar.get(GregorianCalendar.DAY_OF_MONTH);
		        int currentYear = gregorianCalendar.get(GregorianCalendar.YEAR);
		    	GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
		    	GregorianCalendar dateCreated = (GregorianCalendar)doc.getPropertyValue("dc:created");
		    	
		    	// Count documents modified today
		    	if(dateModified.get(GregorianCalendar.YEAR) == currentYear && dateModified.get(GregorianCalendar.MONTH) == currentMonth 
		    			&& dateModified.get(GregorianCalendar.DAY_OF_MONTH) == currentDay) {
					docsModifiedTodayCount++;
		    	}
		    	
		    	// Count documents created today
		    	if(dateCreated.get(GregorianCalendar.YEAR) == currentYear && dateCreated.get(GregorianCalendar.MONTH) == currentMonth 
		    			&& dateCreated.get(GregorianCalendar.DAY_OF_MONTH) == currentDay) {
					docsCreatedTodayCount++;
		    	}
		    	
		    	// Most recently modified documents - current query is sorted by modified date, so newest docs are at the beginning
		    	if(recentlyModifiedJsonArray.size() < maxQueryResults) {
			    	ObjectNode recentlyModifiedJsonObj = mapper.createObjectNode();
			    	recentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
			    	recentlyModifiedJsonObj.put("dc:title", doc.getTitle());
			    	recentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
			    	//GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
			    	recentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
			    	recentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));	        
			    	recentlyModifiedJsonArray.add(recentlyModifiedJsonObj);
		        }		        

		    	// Current user most recently modified documents - current query is sorted by modified date, so newest docs are at the beginning
		    	if(doc.getPropertyValue("dc:lastContributor").equals(principalName) && userRecentlyModifiedJsonArray.size() < maxQueryResults) {
			    	ObjectNode userRecentlyModifiedJsonObj = mapper.createObjectNode();
			    	userRecentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
			    	userRecentlyModifiedJsonObj.put("dc:title", doc.getTitle());
			    	userRecentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
			    	//GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
			    	userRecentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
			    	userRecentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));     
			    	userRecentlyModifiedJsonArray.add(userRecentlyModifiedJsonObj);
		        }			        
		    }
			// Build JSON object
			documentJsonObj.put("new", newDocsCount);
			documentJsonObj.put("enabled", enabledDocsCount);
			documentJsonObj.put("disabled", disabledDocsCount);
			documentJsonObj.put("published", publishedDocsCount);
			documentJsonObj.put("created_today", docsCreatedTodayCount);
			documentJsonObj.put("modified_today", docsModifiedTodayCount);
			
			documentJsonObj.put("without_images", docsWithoutImagesCount);
			documentJsonObj.put("without_audio", docsWithoutAudioCount);
			documentJsonObj.put("without_video", docsWithoutVideoCount);
			documentJsonObj.put("without_source", docsWithoutSourceCount);
		    documentJsonObj.put("most_recently_modified", recentlyModifiedJsonArray);					
		    documentJsonObj.put("user_most_recently_modified", userRecentlyModifiedJsonArray);					
			
		}
		// Close the IterableQueryResult - important
		totalDocsResult.close();	        

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
