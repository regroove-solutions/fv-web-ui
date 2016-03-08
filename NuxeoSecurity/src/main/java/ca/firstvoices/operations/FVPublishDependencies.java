/*
 * (C) Copyright ${year} Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     dyona
 */

package ca.firstvoices.operations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

/**
 *
 */
@Operation(id=FVPublishDependencies.ID, category=Constants.CAT_DOCUMENT, label="FVPublishDependencies", description="")
public class FVPublishDependencies extends AbstractFVPublishOperation {

    public static final String ID = "FVPublishDependencies";

    @OperationMethod(collector=DocumentModelCollector.class)
    public DocumentModel run(DocumentModel input) {

    	session = input.getCoreSession();

    	tree = ps.getPublicationTree(ps.getAvailablePublicationTree().get(0), session, null);

		ArrayList<String> dependencies = new ArrayList<String>();

		dependencies.add("fvcore:related_audio");
		dependencies.add("fvcore:related_pictures");
		dependencies.add("fvcore:related_videos");
		dependencies.add("fvcore:source");
		dependencies.add("fv-word:categories");
		dependencies.add("fv-word:related_phrases");


    	  for (String dependency : dependencies) {
    		  // Check if input has schema
    		  if (!input.hasSchema(dependency.split(":")[0])) {
				continue;
    		  }

    		  // Publish dependency
    		  //String documentPath = input.getPathAsString();

    		  String[] dependencyPropertyValue = (String[]) input.getPropertyValue(dependency);

    		  if (dependencyPropertyValue != null && dependencyPropertyValue.length > 0) {

    			  // input is the document in the section

    			  for (String relatedDocUUID : dependencyPropertyValue) {
            		  IdRef DependencyRef = new IdRef(relatedDocUUID);

            		  if (DependencyRef != null) {
            			  DocumentModel dependencyDocModel = session.getDocument(DependencyRef);

            			  // If dependency published, no need to republish
            			  if (hasPublication(dependencyDocModel)) {
            				  continue;
            			  }

            			  // Get parent of dependency
            			  DocumentModel parentDependencyDocModel = session.getDocument(dependencyDocModel.getParentRef());
            			  DocumentModel section = getSectionToPublishTo(parentDependencyDocModel);

            			  // Publish categories recursively
            			  if ("FVCategory".equals(dependencyDocModel.getType())) {
            				  try {
								// Run new operation (FVPublishParents) to publish recursively
								OperationContext ctx = new OperationContext(session);
								ctx.setInput(dependencyDocModel);
								Map<String, Object> params = new HashMap<String, Object>();
								params.put("stopDocumentType", "FVCategories");
								service.run(ctx, "FVPublishParents", params);

							} catch (OperationException e) {
								e.printStackTrace();
							}
            			  }
            			  // Publish other dependencies normally
            			  else {
            				  DocumentModel publishedDocument = session.publishDocument(dependencyDocModel, section, true);

            				  // Update properties on proxy document to reflect new GUIDs
            				  // This code is not working as a proxy is immutable
            				  int i = Arrays.asList(dependencyPropertyValue).indexOf(relatedDocUUID);
            				  dependencyPropertyValue[i] = publishedDocument.getId();
            				  input.setPropertyValue(dependency, dependencyPropertyValue);
            			  }
            		  }
    			  }
    		  }
    	  }

    	  session.save();


      return input;
    }

}
