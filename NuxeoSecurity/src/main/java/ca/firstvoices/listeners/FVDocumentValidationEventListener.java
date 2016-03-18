/**
 * 
 */

package ca.firstvoices.listeners;

import org.nuxeo.ecm.core.api.ClientException;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IterableQueryResult;
import org.nuxeo.ecm.core.api.RecoverableClientException;
import org.nuxeo.ecm.core.api.event.CoreEventConstants;
import org.nuxeo.ecm.core.api.event.DocumentEventTypes;
import org.nuxeo.ecm.core.event.DeletedDocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.core.query.sql.NXQL;
import org.nuxeo.ecm.platform.web.common.exceptionhandling.ExceptionHelper;

/**
 * @author cstuart
 */
public class FVDocumentValidationEventListener implements EventListener {
	
    public void handleEvent(Event event) throws ClientException {

    	// aboutToCreate and beforeDocumentModification events
    	if (!DocumentEventTypes.ABOUT_TO_CREATE.equals(event.getName()) && !DocumentEventTypes.BEFORE_DOC_UPDATE.equals(event.getName())) {
            return;
        }
        if (!(event.getContext() instanceof DocumentEventContext)) {
            return;
        }
        DocumentEventContext ctx = (DocumentEventContext) event.getContext();
        DocumentModel doc = ctx.getSourceDocument();
        // Skip shallow document
        if (doc instanceof DeletedDocumentModel) {
            return;
        }
        if (doc.isProxy() || doc.isVersion()) {
            return;
        }    
        
        // Word-specific validation
        if(doc.getType().equals("FVWord")) {
            // Return an error if dc:title is empty
            String title = (String) doc.getPropertyValue("dc:title");        
        	if(title == null || title.isEmpty()) {
        		generateValidationError(event, "Title cannot be empty.");
         	}            	
        	// Return an error if part of speech is empty
        	String partOfSpeech = (String) doc.getPropertyValue("fv-word:part_of_speech");
        	if(partOfSpeech == null || partOfSpeech.isEmpty()) {
        		generateValidationError(event, "Part of speech cannot be empty.");
        	}       	       	
        	// Check title and part of speech combination
        	if(!wordTitleValidates(ctx, title)) {
        		generateValidationError(event, "A word with the same title and part of speech already exists in the current dictionary.");
        	}
        }
        // Validation for other specified document types
        else if(doc.getType().matches("FVPhrase|FVCategory|FVContributor|FVPhraseBook|FVBook")) {
            // Return an error if dc:title is empty
            String title = (String) doc.getPropertyValue("dc:title");        
        	if(title == null || title.isEmpty()) {
        		generateValidationError(event, "Title cannot be empty.");
         	}    
	        if (!documentTitleValidates(ctx, title)) {
	            generateValidationError(event, "A document with the same title already exists under the current parent.");
	        }
        }    
    } 
    
    // Validate the title of a non-word document. A document title must be unique under the same parent
    protected boolean documentTitleValidates(DocumentEventContext ctx, String title) {

        DocumentModel doc = ctx.getSourceDocument();
        String docType = (String) doc.getDocumentType().getName();	
    	
        // retrieving parent folderish document
        DocumentRef parentRef = (DocumentRef) ctx.getProperty(CoreEventConstants.DESTINATION_REF);  
        // Retrieve parent doc reference if an existing doc is being modified
        if(parentRef == null) {
        	parentRef = doc.getParentRef();
        }        
        
        DocumentModel parentDoc = ctx.getCoreSession().getDocument(parentRef);
        // searching for documents with same title in the parent folderish document
        StringBuilder sb = new StringBuilder("SELECT " + NXQL.ECM_UUID + " FROM " + docType + " WHERE ");
        sb.append("dc:title").append("=").append(NXQL.escapeString(title))
        .append(" AND ").append(NXQL.ECM_PARENTID).append("=").append(NXQL.escapeString(parentDoc.getId()));
        IterableQueryResult result = ctx.getCoreSession().queryAndFetch(sb.toString(), NXQL.NXQL);
        return (result.size() == 0);
    } 
    
    // Validate the title of a word. A word must have a unique combination of title/part of speech under the same parent
    protected boolean wordTitleValidates(DocumentEventContext ctx, String title) {
    	
        DocumentModel doc = ctx.getSourceDocument();
        String partOfSpeech = (String) doc.getPropertyValue("fv-word:part_of_speech");
        
        // Retrieving parent folderish document during document creation
        DocumentRef parentRef = (DocumentRef) ctx.getProperty(CoreEventConstants.DESTINATION_REF);          
        // Retrieve parent doc reference if an existing doc is being modified
        if(parentRef == null) {
        	parentRef = doc.getParentRef();
        }
        
        DocumentModel parentDoc = ctx.getCoreSession().getDocument(parentRef);
        // searching for documents with same title in the parent folderish document
        StringBuilder sb = new StringBuilder("SELECT " + NXQL.ECM_UUID + " FROM FVWord WHERE ");
        sb.append("dc:title").append("=").append(NXQL.escapeString(title))
        .append(" AND ").append(NXQL.ECM_PARENTID).append("=").append(NXQL.escapeString(parentDoc.getId()))
        .append(" AND ").append("fv-word:part_of_speech='" + partOfSpeech + "'");
        
        IterableQueryResult result = ctx.getCoreSession().queryAndFetch(sb.toString(), NXQL.NXQL);
        return (result.size() == 0);
    }
    
    // Roll back the event and throw an exception containing a description of the validation error
    protected void generateValidationError(Event event, String message) {
        event.markBubbleException();
        event.markRollBack();
        throw new ClientException(ExceptionHelper.unwrapException(new RecoverableClientException("Bubbling exception by " + FVDocumentValidationEventListener.class.getName(), message, null)));
    }
    
}
