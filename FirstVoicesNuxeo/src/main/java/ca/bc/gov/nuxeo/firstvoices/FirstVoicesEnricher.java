package ca.bc.gov.nuxeo.firstvoices;
 
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
 
// The class will be instanciated as a singleton
// Priority defines which marshaller will be used in case of conflict. Priority is an integer.
// The higher the number, the more priority you get: 10 > 1 for instance.
@Setup(mode = SINGLETON, priority = REFERENCE)
public class FirstVoicesEnricher extends AbstractJsonEnricher<DocumentModel> { // You could also enrich a user or anything else
 
    // The enricher will be called using X-NXenrichers.document: name (name being parentDoc here)
    // If you were enriching a user, you would call it using X-NXenrichers.user: name (X-NXenrichers.entity-type)
    public static final String NAME = "firstvoices";
 
    public FirstVoicesEnricher() {
        super(NAME);
    }
 
    // Method that will be called when the enricher is asked for
    @Override
    public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
      // We use the Jackson library to generate Json
      ObjectNode wordJsonObject = constructFirstVoicesJSON(doc);
      jg.writeFieldName(NAME);
      jg.writeObject(wordJsonObject);
    }
 
    private ObjectNode constructFirstVoicesJSON(DocumentModel doc) {
      ObjectMapper mapper = new ObjectMapper();
      
      // JSON object to be returned
      ObjectNode jsonObj = mapper.createObjectNode();
 
      // First create the parent document's Json object content
      CoreSession session = doc.getCoreSession();
 
      /* 
       * Process fvancestry values
       */
      String languageFamilyId = (String) doc.getProperty("fvancestry", "family");
      if(languageFamilyId != null && !languageFamilyId.equals("")) {
	      IdRef languageFamilyRef = new IdRef(languageFamilyId);
	      DocumentModel languageFamilyDoc = null;
	      languageFamilyDoc = session.getDocument(languageFamilyRef);       	  
	      ObjectNode languageFamilyObj = mapper.createObjectNode();
	      languageFamilyObj.put("uid", languageFamilyId);
	      languageFamilyObj.put("title", languageFamilyDoc.getTitle());
	      jsonObj.put("family", languageFamilyObj);      
      }
      
      String languageId = (String) doc.getProperty("fvancestry", "language");
      if(languageId != null && !languageId.equals("")) {      
	      IdRef languageRef = new IdRef(languageId);
	      DocumentModel languageDoc = null;
	      languageDoc = session.getDocument(languageRef);       	  
	      ObjectNode languageObj = mapper.createObjectNode();
	      languageObj.put("uid", languageId);
	      languageObj.put("title", languageDoc.getTitle());
	      jsonObj.put("language", languageObj);      
      }
      
      String dialectId = (String) doc.getProperty("fvancestry", "dialect");
      if(dialectId != null && !dialectId.equals("")) {      
	      IdRef dialectRef = new IdRef(dialectId);
	      DocumentModel dialectDoc = null;
	      dialectDoc = session.getDocument(dialectRef);       	  
	      ObjectNode dialectObj = mapper.createObjectNode();
	      dialectObj.put("uid", dialectId);
	      dialectObj.put("title", dialectDoc.getTitle());
	      jsonObj.put("dialect", dialectObj);      
      }
      
      /* 
       * Process fvcore SOURCES
       */
      String[] sourceIds = (String[]) doc.getProperty("fvcore", "source");
      if(sourceIds != null) {
          ArrayNode sourceArray = mapper.createArrayNode();
    	  for(String sourceId : sourceIds) {
	    	  IdRef ref = new IdRef(sourceId);
	    	  DocumentModel sourceDoc = null;
	    	  // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
	    	  try {
	    		  sourceDoc = session.getDocument(ref);
	    	  } catch(DocumentNotFoundException de) {
	    		  continue;
	    	  }
	    	  
		      ObjectNode sourceObj = mapper.createObjectNode();
		      sourceObj.put("uid", sourceId);
		      sourceObj.put("title", sourceDoc.getTitle());
		      sourceArray.add(sourceObj);
	      }      
	      jsonObj.put("sources", sourceArray);
      }
      
      String documentType = (String) doc.getType();      
      
      /* 
       * Word-specific properties
       */
      if(documentType.equalsIgnoreCase("FVWord")) {
           // Process fvcore CATEGORIES
          String[] categoryIds = (String[]) doc.getProperty("fv-word", "categories");
          ArrayNode categoryArray = mapper.createArrayNode();
          for(String categoryId : categoryIds) {
        	  IdRef ref = new IdRef(categoryId);
        	  DocumentModel categoryDoc = null;
        	  // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
        	  try {
        		  categoryDoc = session.getDocument(ref);
        	  } catch(DocumentNotFoundException de) {
        		  continue;
        	  }
        	  
    	      ObjectNode categoryObj = mapper.createObjectNode();
    	      categoryObj.put("uid", categoryId);
    	      categoryObj.put("title", categoryDoc.getTitle());
    	      categoryArray.add(categoryObj);
          }      
          jsonObj.put("categories", categoryArray);      
          
          // Process fv-word PART_OF_SPEECH
          String partOfSpeechId = (String) doc.getProperty("fv-word", "part_of_speech");
          DirectoryService directoryService = Framework.getLocalService(DirectoryService.class);
          Session directorySession = directoryService.open("parts_of_speech");
          String partOfSpeechLabel = "";
          if(!partOfSpeechId.isEmpty() && partOfSpeechId != null) {	      
    	      // Create a query filter
    	      Map<String, Serializable> queryFilter = new HashMap<String, Serializable>();
    	      queryFilter.put("id", partOfSpeechId);
    	     
    	      // Execute the query, wrapped in a DocumentModel list
    	      DocumentModelList queryResult = directorySession.query(queryFilter);
    	      DocumentModel partOfSpeechDoc = queryResult.get(0);
    	      if(partOfSpeechDoc != null) {
    	    	  partOfSpeechLabel = partOfSpeechDoc.getProperty("xvocabulary:label").getValue(String.class);
    	      }
          }
          directorySession.close();
          jsonObj.put("part_of_speech", partOfSpeechLabel);    	  
      }
      
      /* 
       * Phrase-specific properties
       */      
      else if(documentType.equalsIgnoreCase("FVPhrase")) {
          // Process fv-phrase PHRASE_BOOKS            
    	  String[] phraseBookIds = (String[]) doc.getProperty("fv-phrase", "phrase_books");
          ArrayNode phraseBookArray = mapper.createArrayNode();
          for(String phraseBookId : phraseBookIds) {
        	  IdRef ref = new IdRef(phraseBookId);
        	  DocumentModel phraseBookDoc = null;
        	  // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
        	  try {
        		  phraseBookDoc = session.getDocument(ref);
        	  } catch(DocumentNotFoundException de) {
        		  continue;
        	  }
        	  
    	      ObjectNode phraseBookObj = mapper.createObjectNode();
    	      phraseBookObj.put("uid", phraseBookId);
    	      phraseBookObj.put("title", phraseBookDoc.getTitle());
    	      phraseBookArray.add(phraseBookObj);
          }      
          jsonObj.put("phrase_books", phraseBookArray);       	  
      }
      return jsonObj;
    }
}