/**
 * 
 */

package ca.firstvoices.operations;

import java.io.Serializable;
import java.security.Principal;
import java.util.Arrays;
import java.util.GregorianCalendar;
import java.util.List;
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
    
    protected int maxQueryResults = 5;
    
    protected ObjectMapper mapper = new ObjectMapper();

	protected final String BASE_DOCS_QUERY = "SELECT * FROM %s WHERE ecm:path STARTSWITH '%s' AND ecm:currentLifeCycleState <> 'deleted'";
	
	private final List<String> allowedDocTypes = Arrays.asList("words", "phrases", "characters", "songs", "stories");
	
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
			// Perform some validation on provided parameters
			if(allowedDocTypes.contains(docType) && (dialectPath.startsWith("/FV/Workspaces/") || dialectPath.startsWith("/FV/sections/"))) {
		    	ObjectNode jsonObj = generateDocumentStatsJson(docType);
				rootJsonObj.put(docType, jsonObj);
			}	
		}			
        return new StringBlob(rootJsonObj.toString(), "application/json");    
    } 
    
    private ObjectNode generateDocumentStatsJson(String docType) {
		
    	int newDocsCount = 0;
		int enabledDocsCount = 0;
		int disabledDocsCount = 0;
		int publishedDocsCount = 0;

		int docsAvailableInChildrensArchiveCount = 0;
		
		int docsModifiedTodayCount = 0;
		int docsCreatedTodayCount = 0;			
		int docsCreatedWithinSevenDaysCount = 0;				
		
		ArrayNode recentlyModifiedJsonArray = mapper.createArrayNode();		
		ArrayNode userRecentlyModifiedJsonArray = mapper.createArrayNode();	    	
    	
    	ObjectNode documentJsonObj = mapper.createObjectNode();
    	
    	// Build query for the specified document type
    	String query = constructQuery(docType);
    	
    	if(query != null) {
	    	
	        // Execute the query
			IterableQueryResult resultDocs = session.queryAndFetch(query + " ORDER BY dc:modified DESC", NXQL.NXQL);
			
			try {			
				documentJsonObj.put("total", resultDocs.size());	
									
				// Loop through each document in the result and generate statistics
				for (Map<String, Serializable> resultDoc : resultDocs) {
			        String value = (String) resultDoc.get("ecm:uuid");
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
		        	Boolean isAvailableInChildrensArchive = (Boolean)doc.getProperty("fvcore", "available_in_childrens_archive");
		        	if(isAvailableInChildrensArchive != null && isAvailableInChildrensArchive.booleanValue()) {
		        		docsAvailableInChildrensArchiveCount++;
			        }
			        
			        // Get current date
			        GregorianCalendar today = new GregorianCalendar();            
			        int currentMonth = today.get(GregorianCalendar.MONTH);            
			        int currentDay = today.get(GregorianCalendar.DAY_OF_MONTH);
			        int currentYear = today.get(GregorianCalendar.YEAR);
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
		
			    	// Count documents created within the last 7 days
			    	GregorianCalendar sevenDaysAgo = new GregorianCalendar();
			    	sevenDaysAgo.add(GregorianCalendar.DAY_OF_MONTH, -7); 
			    	if(dateCreated.after(sevenDaysAgo)) {
						docsCreatedWithinSevenDaysCount++;
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
		    		    	
					// Build JSON object
					documentJsonObj.put("new", newDocsCount);
					documentJsonObj.put("enabled", enabledDocsCount);
					documentJsonObj.put("disabled", disabledDocsCount);
					documentJsonObj.put("published", publishedDocsCount);
					documentJsonObj.put("created_today", docsCreatedTodayCount);
					documentJsonObj.put("modified_today", docsModifiedTodayCount);
					documentJsonObj.put("created_within_7_days", docsCreatedWithinSevenDaysCount);
					        
				    documentJsonObj.put("most_recently_modified", recentlyModifiedJsonArray);					
				    documentJsonObj.put("user_most_recently_modified", userRecentlyModifiedJsonArray);
				    documentJsonObj.put("most_recently_modified", recentlyModifiedJsonArray);					
				    documentJsonObj.put("user_most_recently_modified", userRecentlyModifiedJsonArray);	
	
					documentJsonObj.put("available_in_childrens_archive", docsAvailableInChildrensArchiveCount);							    			
				}
			}
			finally {
				// Close the IterableQueryResult - important
				if(resultDocs != null) {
					resultDocs.close();	
				}	
			}
    	}
    	return documentJsonObj;
    }   
    
    // Build the query for a specified document type
    private String constructQuery(String docType) {
    	
    	String query = null;
    	String proxyQueryParams = null;
    	
    	// Query parameters depending on path
    	if(dialectPath.contains("/Workspaces/")) {
    		proxyQueryParams = " AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0";
    	} 
    	else if(dialectPath.contains("/sections/")) {
    		proxyQueryParams = " AND ecm:isProxy = 1";   		
    	}   	  	
    	
    	if(docType.equalsIgnoreCase("words")) {
    		query = String.format(BASE_DOCS_QUERY, "FVWord", dialectPath) + proxyQueryParams;
    	}
    	else if(docType.equalsIgnoreCase("phrases")) {
    		query = String.format(BASE_DOCS_QUERY, "FVPhrase", dialectPath) + proxyQueryParams;
    	}
    	else if(docType.equalsIgnoreCase("characters")) {
    		query = String.format(BASE_DOCS_QUERY, "FVCharacter", dialectPath) + proxyQueryParams;
    	}    	
    	else if(docType.equalsIgnoreCase("songs")) {
    		query = String.format(BASE_DOCS_QUERY, "FVBook", dialectPath) + proxyQueryParams + " AND fvbook:type = 'song'";
    	}
    	else if(docType.equalsIgnoreCase("stories")) {
    		query = String.format(BASE_DOCS_QUERY, "FVBook", dialectPath) + proxyQueryParams + " AND fvbook:type = 'story'";
    	}    	
	    	
    	return query;
    }

}
