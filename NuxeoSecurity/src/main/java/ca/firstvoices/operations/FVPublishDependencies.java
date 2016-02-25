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
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.collectors.DocumentModelCollector;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.platform.publisher.api.PublicationTree;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

/**
 *
 */
@Operation(id=FVPublishDependencies.ID, category=Constants.CAT_DOCUMENT, label="FVPublishDependencies", description="")
public class FVPublishDependencies {

    public static final String ID = "FVPublishDependencies";

    @OperationMethod(collector=DocumentModelCollector.class)
    public DocumentModel run(DocumentModel input) {

    	CoreSession session = input.getCoreSession();

    	PublisherService ps = Framework.getService(PublisherService.class);
    	PublicationTree tree = ps.getPublicationTree(ps.getAvailablePublicationTree().get(0), session, null);

		ArrayList<String> dependencies = new ArrayList<String>();

		dependencies.add("fv-word:categories");
		dependencies.add("fv-word:related_phrases");
		dependencies.add("fvcore:related_audio");
		dependencies.add("fvcore:related_pictures");
		dependencies.add("fvcore:related_videos");
		dependencies.add("fvcore:reference");
		dependencies.add("fvcore:source");

		//PublicationTree currentPublicationTree = ps.getPublicationTree(currentPublicationTreeNameForPublishing,
        //        documentManager, null, navigationContext.getCurrentDocument());


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

            			  // e.g. Resources
            			  DocumentModel parentDependencyDocModel = session.getDocument(dependencyDocModel.getParentRef());

            			  DocumentModelList sections = session.getProxies(parentDependencyDocModel.getRef(), null);

            			  for (DocumentModel section : sections) {
            				  // Ensure section is within the publication target
            				  // TODO: Ensure document isn't already published
            				  if (section.getPath().toString().indexOf(tree.getPath()) == 0) {
            					  session.publishDocument(dependencyDocModel, section, true);
            				  }
            			  }
            		  }
    			  }
    		  }

    		  session.save();
    	  }





      return input;
    }

}
