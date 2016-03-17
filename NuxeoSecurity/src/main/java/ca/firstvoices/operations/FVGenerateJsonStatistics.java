/**
 * 
 */

package ca.firstvoices.operations;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

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
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
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

    @Param(name = "dialectId")
    protected String dialectId; 
    
    protected String sectionDialectId;
    
    protected String principalName;
    
    protected int mostRecentMaxResults = 10;
    
    protected ObjectMapper mapper = new ObjectMapper();
    
    protected final String WORKSPACE_DOCS_QUERY = "SELECT * FROM %s WHERE ecm:path STARTSWITH '/FV/Workspaces/Data/'"
										    		+ " AND ecm:currentLifeCycleState <> 'deleted'"
										    		+ " AND ecm:isProxy = 0"
										    		+ " AND ecm:isCheckedInVersion = 0";
    
    protected final String SECTION_DOCS_QUERY = "SELECT * FROM %s WHERE ecm:path STARTSWITH '/FV/sections/Data/'"
													+ " AND ecm:currentLifeCycleState <> 'deleted'";
    
    @OperationMethod
    public Blob run() {
    	
		// JSON object to be returned        
    	ObjectNode rootJsonObj = mapper.createObjectNode();
    	    	
		rootJsonObj.put("dialectId", dialectId);	
		
		// Get current user
    	Principal principal = session.getPrincipal();
    	principalName = principal.getName();		
		rootJsonObj.put("user", principalName);		
		
    	// Words
    	ObjectNode wordJsonObj = generateDocumentStatsJson("FVWord");
		rootJsonObj.put("words", wordJsonObj);		
		
		// Phrases
    	ObjectNode phraseJsonObj = generateDocumentStatsJson("FVPhrase");				
		rootJsonObj.put("phrases", phraseJsonObj);		

		// Books (Stories & Songs)
    	ObjectNode booksJsonObj = generateDocumentStatsJson("FVBook");				
		rootJsonObj.put("books", booksJsonObj);		

		// Stories & Songs
    	ObjectNode charactersJsonObj = generateDocumentStatsJson("FVCharacter");				
		rootJsonObj.put("characters", charactersJsonObj);			
		
		// Contributors
    	ObjectNode contributorsJsonObj = generateDocumentStatsJson("FVContributor");				
		rootJsonObj.put("contributors", contributorsJsonObj);

		// Categories
    	ObjectNode categoriesJsonObj = generateDocumentStatsJson("FVCategory");				
		rootJsonObj.put("categories", categoriesJsonObj);		
		
		// Audio
    	ObjectNode audioJsonObj = generateDocumentStatsJson("FVAudio");				
		rootJsonObj.put("audio", audioJsonObj);		

		// Picture
    	ObjectNode pictureJsonObj = generateDocumentStatsJson("FVPicture");				
		rootJsonObj.put("pictures", pictureJsonObj);		
		
		// Video
    	ObjectNode videoJsonObj = generateDocumentStatsJson("FVVideo");				
		rootJsonObj.put("videos", videoJsonObj);		
		
        return new StringBlob(rootJsonObj.toString(), "application/json");    
    } 
    
    private ObjectNode generateDocumentStatsJson(String documentType) {
    	ObjectNode documentJsonObj = mapper.createObjectNode();
    	
    	// Query to get documents from the workspace
    	String workspaceDocumentsQuery = String.format(WORKSPACE_DOCS_QUERY, documentType);    	
    	
    	// Query to get documents from the section (published)   	    	
    	String publishedDocumentsQuery = String.format(SECTION_DOCS_QUERY, documentType);
    	
    	// If dialectId was passed as a parameter to the operation, restrict the query to that dialect. Otherwise leave it empty
        String queryDialectRestriction = "";
    	if(!dialectId.isEmpty()) {
    		queryDialectRestriction = " AND ecm:ancestorId='" + dialectId + "'"; 		
    	}   	
    	
    	// Get a count of all documents of the specified type
        DocumentModelList totalDocuments = session.query(workspaceDocumentsQuery + queryDialectRestriction, NXQL.NXQL, null, 1, 0, true);
        int totalDocumentsCount = (int) totalDocuments.totalSize();
		documentJsonObj.put("total", totalDocumentsCount);

		// If the document uses the fv-lifecycle, get counts for documents in each lifecycle state
		if(hasFVLifecycle(documentType)) {
			// New
	        DocumentModelList totalNewDocuments = session.query(workspaceDocumentsQuery + queryDialectRestriction 
	        											+ " AND ecm:currentLifeCycleState='New'", NXQL.NXQL, null, 1, 0, true);
	        int totalNewDocumentsCount = (int) totalNewDocuments.totalSize();
			documentJsonObj.put("new", totalNewDocumentsCount);		

			// Enabled
	        DocumentModelList totalEnabledDocuments = session.query(workspaceDocumentsQuery + queryDialectRestriction 
	        											+ " AND ecm:currentLifeCycleState='Enabled'", NXQL.NXQL, null, 1, 0, true);
	        int totalEnabledDocumentsCount = (int) totalEnabledDocuments.totalSize();
			documentJsonObj.put("enabled", totalEnabledDocumentsCount);

			// Disabled
	        DocumentModelList totalDisabledDocuments = session.query(workspaceDocumentsQuery + queryDialectRestriction
	        											+ " AND ecm:currentLifeCycleState='Disabled'", NXQL.NXQL, null, 1, 0, true);
	        int totalDisabledDocumentsCount = (int) totalDisabledDocuments.totalSize();
			documentJsonObj.put("disabled", totalDisabledDocumentsCount);				
		}	

		// Count the docs that have been published to the section
		int totalPublishedDocumentsCount;
        String querySectionDialectRestriction = "";
		if(!dialectId.isEmpty()) {
    		String sectionDialectId = getSectionDialectId(dialectId);
    		if(sectionDialectId != null) {
    			// We know there is a section being published to, so count the documents inside
    			querySectionDialectRestriction = " AND ecm:ancestorId='" + sectionDialectId + "'";
    		    DocumentModelList totalPublishedDocuments = session.query(publishedDocumentsQuery + querySectionDialectRestriction, NXQL.NXQL, null, 1, 0, true);
    		    totalPublishedDocumentsCount = (int) totalPublishedDocuments.totalSize();  
    		} else {
    			// There is no section to publish to, so there won't be any docs published
    			totalPublishedDocumentsCount = 0;
    		}
    	} else {
    		// Case to handle when dialectId is empty (if so, query documents under all dialects)
		    DocumentModelList totalPublishedDocuments = session.query(publishedDocumentsQuery, NXQL.NXQL, null, 1, 0, true);
		    totalPublishedDocumentsCount = (int) totalPublishedDocuments.totalSize();     		
    	} 	
	    documentJsonObj.put("published", totalPublishedDocumentsCount);	
	    
	    // Get counts for all docs created and modified today
	    Date date = Calendar.getInstance().getTime();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    String dateStringToday = sdf.format(date);
	    // Created today
	    DocumentModelList createdTodayDocs = session.query(workspaceDocumentsQuery + queryDialectRestriction 
	    										+ " AND dc:created >= DATE '" + dateStringToday + "'", NXQL.NXQL, null, 1, 0, true);
        int createdTodayDocumentsCount = (int) createdTodayDocs.totalSize();
		documentJsonObj.put("created_today", createdTodayDocumentsCount);
		// Modified today
	    DocumentModelList modifiedTodayDocs = session.query(workspaceDocumentsQuery + queryDialectRestriction 
	    										+ " AND dc:modified >= DATE '" + dateStringToday + "'", NXQL.NXQL, null, 1, 0, true);
        int modifiedTodayDocumentsCount = (int) modifiedTodayDocs.totalSize();
		documentJsonObj.put("modified_today", modifiedTodayDocumentsCount);			    
	    
	    // Get data about the most recently created docs
	    DocumentModelList mostRecentlyCreatedDocs = session.query(workspaceDocumentsQuery + queryDialectRestriction
	    											+ " ORDER BY dc:created DESC", NXQL.NXQL, null, mostRecentMaxResults, 0, true);
	    ArrayNode recentlyCreatedJsonArray = mapper.createArrayNode();
	    for(DocumentModel doc : mostRecentlyCreatedDocs) {
	    	ObjectNode recentlyCreatedJsonObj = mapper.createObjectNode();
	    	recentlyCreatedJsonObj.put("ecm:uuid", doc.getId());
	    	recentlyCreatedJsonObj.put("dc:title", doc.getTitle());
	    	GregorianCalendar dateCreated = (GregorianCalendar)doc.getPropertyValue("dc:created");
	    	recentlyCreatedJsonObj.put("dc:created", dateCreated.getTime().toString());
	    	recentlyCreatedJsonObj.put("dc:creator", (String)doc.getPropertyValue("dc:creator"));
	    	
	    	recentlyCreatedJsonArray.add(recentlyCreatedJsonObj);
	    }
	    documentJsonObj.put("most_recently_created", recentlyCreatedJsonArray);		    
	    
	    // Get data about the most recently modified docs
	    DocumentModelList mostRecentlyModifiedDocs = session.query(workspaceDocumentsQuery + queryDialectRestriction 
	    											+ " ORDER BY dc:modified DESC", NXQL.NXQL, null, mostRecentMaxResults, 0, true);
	    ArrayNode recentlyModifiedJsonArray = mapper.createArrayNode();
	    for(DocumentModel doc : mostRecentlyModifiedDocs) {
	    	ObjectNode recentlyModifiedJsonObj = mapper.createObjectNode();
	    	recentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
	    	recentlyModifiedJsonObj.put("dc:title", doc.getTitle());
	    	GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
	    	recentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
	    	recentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));
	    	
	    	recentlyModifiedJsonArray.add(recentlyModifiedJsonObj);
	    }
	    documentJsonObj.put("most_recently_modified", recentlyModifiedJsonArray);	
	    
    	// Get data about the current user's most recently modified docs
        DocumentModelList userMostRecentlyModifiedDocs = session.query(workspaceDocumentsQuery + queryDialectRestriction 
	        											+ " AND dc:lastContributor = '" + principalName + "'"
	        											+ " ORDER BY dc:modified DESC", NXQL.NXQL, null, 10, 0, true);
	    ArrayNode userRecentlyModifiedJsonArray = mapper.createArrayNode();
	    for(DocumentModel doc : userMostRecentlyModifiedDocs) {
	    	ObjectNode userRecentlyModifiedJsonObj = mapper.createObjectNode();
	    	userRecentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
	    	userRecentlyModifiedJsonObj.put("dc:title", doc.getTitle());
	    	GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue("dc:modified");
	    	userRecentlyModifiedJsonObj.put("dc:modified", dateModified.getTime().toString());
	    	userRecentlyModifiedJsonObj.put("dc:lastContributor", (String)doc.getPropertyValue("dc:lastContributor"));
		
	    	userRecentlyModifiedJsonArray.add(userRecentlyModifiedJsonObj);
	    }
	    documentJsonObj.put("user_most_recently_modified", userRecentlyModifiedJsonArray);	
		
    	return documentJsonObj;
    }   
    
    // Only some of the FV document types use the fv-lifecycle (New/Enabled/Disabled)
    private boolean hasFVLifecycle(String documentType) {
    	if(documentType.matches("FVWord|FVPhrase|FVBook|FVAudio|FVPicture|FVVideo")) {
    		return true;
    	}
    	return false;
    }
    
    // Get the uuid of the section that the workspace document is publishing to, if it exists. If not, return null
    private String getSectionDialectId(String dialectId) {
		IdRef dialectIdRef = new IdRef(dialectId);
		DocumentModelList sections = session.getProxies(dialectIdRef, null);
		if(sections != null && !sections.isEmpty()) {
			sectionDialectId = sections.get(0).getId();
			return sectionDialectId;
		}
		return null;
    }

}
